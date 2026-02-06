const prismaService = require("../../../services/prismaService");

const LOGOUT_STUDENT = async (req, res) => {
  try {
    res.clearCookie("STUDENT_ELEMENT_TKN", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      data: [],
      message: "Амжилттай logout хийгдлээ",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа гарлаа: " + err.message,
    });
  }
};

module.exports = LOGOUT_STUDENT;
