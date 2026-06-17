const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

// لما تطلب /dashboard هينفذ الدالة دي
router.get("/dashboard", protect, dashboardController.dashboard_get);

module.exports = router;