const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeControllers");
const authMiddleware = require("../middlewares/authMiddleware");

const protect = authMiddleware.protect;
const adminOnly = authMiddleware.adminOnly;

// تطبيق الحماية على كل الروتس اللي جاية
router.use(protect);

// 1. عرض لوحة التحكم (الجدول الرئيسي)
router.get("/employees", protect, employeeController.employee_dashboard_get);

// 2. البحث (لازم يكون قبل الروتس اللي فيها :id)
router.post("/search", employeeController.employee_search_post);

// 3. إضافة موظف جديد (GET لعرض الصفحة و POST لحفظ البيانات)
router.get("/add", adminOnly, employeeController.employee_add_get); 
router.post("/add", adminOnly, employeeController.employee_create_post);

// 4. عرض بيانات موظف معين (لازم الـ :id يكون تحت خالص)
router.get("/view/:id", employeeController.employee_view_get);

// 5. تعديل بيانات موظف (GET لعرض الصفحة و POST للتحديث)
router.get("/edit/:id", adminOnly, employeeController.employee_edit_get);
router.post("/update/:id", adminOnly, employeeController.employee_update_post);

// 6. حذف موظف
router.post("/delete/:id", adminOnly, employeeController.employee_delete_post);

module.exports = router;