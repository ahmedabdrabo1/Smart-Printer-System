const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // 💡 التعديل: الربط بـ user عشان req.user.id يشتغل صح
    required: true
  },
  printerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "printer", // 💡 تأكد أن اسم موديل الطابعة عندك printer (حرف صغير)
    required: true
  },
  wastedSheets: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true 
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Waste", wasteSchema);