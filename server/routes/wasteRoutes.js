const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const multer = require('multer');

// إعداد ملتر (Multer) لتخزين الصورة مؤقتاً في الذاكرة (Buffer) دون حفظها على الهارد ديسك
const upload = multer({ storage: multer.memoryStorage() });

// ✅ مسار الأدمن لعرض تقارير الهالك
router.get("/", protect, adminOnly, wasteController.admin_waste_get);

// مسار الموظف القديم لتسجيل هالك يدوياً
router.post("/add", protect, wasteController.createWasteReport);

// 🤖 مسار الموظف الجديد لتسجيل الهالك الذكي بتحليل الـ AI
// لاحظ استدعاء الدالة الجديدة من الـ Controller هنا:
router.post("/add-with-ai", protect, upload.single('image'), wasteController.createWasteReportWithAI);

module.exports = router;