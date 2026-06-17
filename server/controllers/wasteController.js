const Waste = require("../models/Waste");
const Printer = require("../models/Printer");
const User = require("../models/User");
const moment = require("moment");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🤖 1. ميزة الموظف الجديدة (React API): تسجيل الهالك الذكي عبر Gemini AI
const createWasteReportWithAI = async (req, res) => {
  try {
    const { printerId, wastedSheets, reason } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          message: "رجاءً قم برفع صورة الورقة التالفة 📸",
        });
    }

    // قيم افتراضية آمنة في حال فشل الـ AI لضمان عدم توقف العمل
    let faultType = "Employee";
    let aiExplanation = "تم الحفظ تلقائياً (فشل اتصال بموديل الفحص الذكي)";

    // 🛡️ فحص حماية: التأكد من أن مفتاح الـ API متاح
    if (process.env.GEMINI_API_KEY) {
      try {
        // 1. تهيئة الـ SDK الأساسي بمفتاح الـ API فقط بدون أي معاملات إضافية
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 2. الحل القاطع للحزم القديمة: استدعاء موديل الرؤية القياسي المستقر والمجاني تماماً
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        // صياغة البنية البرمجية المتوافقة مع بافر الصورة في الحزم القديمة
        const imagePart = {
          inlineData: {
            data: req.file.buffer.toString("base64"),
            mimeType: req.file.mimetype,
          },
        };

        const prompt = `You are a quality control expert in a commercial printing house. Analyze the attached image of a damaged/wasted paper and determine the root cause.
        
        You must strictly provide your response in a clean JSON object format.
        
        The 'decision' field must only be one of these exact two values:
        1. "Machine" (if it is a printer mechanical/ink issue like lines, smudges, fading, paper jams).
        2. "Employee" (if it is a human error like wrong orientation, duplicate printing, wrong size).

        Response format must be exactly like this:
        { "decision": "Machine", "explanation": "اكتب هنا تشخيص المشكلة باللغة العربية باختصار شديد جدا" }`;

        // إرسال الطلب عبر تمرير عناصر مصفوفة المحتوى (النص والصورة)
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let responseText = response.text().trim();

        // تنظيف مخرجات الماركدوان المحتملة لضمان سلامة عملية الـ Parse
        if (responseText.startsWith("```json")) {
          responseText = responseText.replace(/```json|```/g, "").trim();
        } else if (responseText.startsWith("```")) {
          responseText = responseText.replace(/```/g, "").trim();
        }

        const aiAnalysis = JSON.parse(responseText);

        if (
          aiAnalysis.decision === "Machine" ||
          aiAnalysis.decision === "Employee"
        ) {
          faultType = aiAnalysis.decision;
        }
        aiExplanation = aiAnalysis.explanation || "تم الفحص التلقائي";

        console.log("✅ Gemini Vision AI Result:", aiAnalysis);
      } catch (aiError) {
        console.error(
          "🚨 تفادي كراش الـ AI الداخلي بنجاح - السبب الفعلي:",
          aiError.message
        );
        aiExplanation = `فشل اتصال بموديل الفحص الذكي (${aiError.message})`;
      }
    } else {
      console.warn(
        "⚠️ تحذير: لم يتم العثور على GEMINI_API_KEY في ملف الـ .env"
      );
      aiExplanation =
        "تم الحفظ تلقائياً (مفتاح الـ API الخاص بـ Gemini غير معرف بالسيستم)";
    }

    // حفظ التقرير في قاعدة البيانات في جميع الأحوال لضمان أمان البيانات وعدم ضياع التقارير
    const newReport = await Waste.create({
      employeeId: req.user._id,
      printerId,
      wastedSheets: Number(wastedSheets),
      reason: reason || "تم الفحص التلقائي",
      faultType,
      aiExplanation,
      date: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: newReport,
      aiAnalysis: { decision: faultType, explanation: aiExplanation },
    });
  } catch (err) {
    console.error("Main Controller Global Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "حدث خطأ غير متوقع في السيرفر" });
  }
};

// 2. للموظف (القديم): تسجيل الهالك يدوياً
const createWasteReport = async (req, res) => {
  try {
    const { printerId, wastedSheets, reason } = req.body;

    const newReport = await Waste.create({
      employeeId: req.user._id,
      printerId,
      wastedSheets: Number(wastedSheets),
      reason,
      faultType: "Employee",
      date: new Date(),
    });

    res.status(201).json({ success: true, data: newReport });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. للمدير (EJS): عرض كل تقارير الإتلاف مع الفلترة
const admin_waste_get = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    let filterQuery = {};

    if (employeeId) {
      filterQuery.employeeId = employeeId;
    }

    if (startDate && endDate) {
      filterQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59"),
      };
    }

    const reports = await Waste.find(filterQuery)
      .populate({
        path: "employeeId",
        select: "username fullName",
      })
      .populate("printerId", "name")
      .sort({ date: -1 });

    const employees = await User.find().select("username fullName");

    res.render("waste/wasteReports", {
      reports: reports,
      employees: employees,
      filters: req.query,
      username: req.user ? req.user.username : "Admin",
      currentPage: "waste",
      moment: moment,
    });
  } catch (err) {
    console.error("Error Fetching Waste:", err);
    res.status(500).send("Error fetching waste reports");
  }
};

module.exports = {
  createWasteReport,
  createWasteReportWithAI,
  admin_waste_get,
};