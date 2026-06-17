const express = require("express");
const router = express.Router();
const Material = require("../models/Material");

// عرض صفحة قائمة الأسعار
router.get("/", async (req, res) => {
    try {
        const materials = await Material.find();
        res.render("material/materials", {
            materials,
            currentPage: "materials",
            username: req.user ? req.user.username : "Admin"
        });
    } catch (err) {
        res.status(500).send("Error fetching materials");
    }
});

// إضافة نوع ورق جديد
router.post("/add", async (req, res) => {
    try {
        const { name, paperSize, costPrice, sellingPrice } = req.body;
        await Material.create({ name, paperSize, costPrice, sellingPrice });
        res.redirect("/material/materials");
    } catch (err) {
        res.status(500).send("Error adding material");
    }
});

module.exports = router;