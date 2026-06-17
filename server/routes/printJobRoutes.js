const express = require("express");
const router = express.Router();
const jobController = require("../controllers/printJobController");
const { protect } = require("../middlewares/authMiddleware");

// مسارات الـ EJS (المدير)
router.get("/", protect, jobController.job_index_get);
router.get("/add", protect, jobController.job_add_get);
router.post("/add", protect, jobController.job_create_post);

// مسارات الـ API (الموظف - React)
router.post("/api/add", protect, jobController.createPrintJob);

module.exports = router;