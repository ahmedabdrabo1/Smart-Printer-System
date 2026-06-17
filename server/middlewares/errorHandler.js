const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // بيطبع الخطأ في التيرمينال عشانك كمطور
    res.status(500).json({ 
      success: false, 
      message: err.message || "حدث خطأ داخلي في الخادم" 
    });
  };
  
  module.exports = errorHandler;