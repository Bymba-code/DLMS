const LOGOUT_COURSE = async (req, res) => {
  try {
    res.clearCookie("ASPANEL_ELEMENT", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      data: [],
      message: "Амжилттай гарлаа.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа гарлаа: " + err.message,
    });
  }
};

module.exports = LOGOUT_COURSE;