module.exports = {
    SECRET_KEY: process.env.JWT_SECRET || "mysecretkey",
    EXPIRES_IN: "1h", // التوكن يخلص بعد ساعة
    COOKIE_MAX_AGE: 60 * 60 * 1000, // الكوكي تعيش ساعة (بالميللي ثانية)
  };