const prismaService = require("../../../services/prismaService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const LOGIN_COURSE = async (req, res) => {
  try {
    const { kode, password } = req.body;

    if (!kode) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Нэвтрэх код оруулна уу."
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        data: [],
        message: "Нууц үг оруулна уу."
      });
    }

    const course = await prismaService.course.findFirst({
      where: {
        kode: kode
      }
    });

    if (!course) {
      return res.status(401).json({
        success: false,
        data: [],
        message: "Нэвтрэх код эсвэл нууц үг буруу байна."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, course.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        data: [],
        message: "Нэвтрэх код эсвэл нууц үг буруу байна."
      });
    }

    const token = jwt.sign(
      {
        id: course.id,
        kode: course.kode,
        name: course.name,
        role: 'course' 
      },
      process.env.TOKEN_SECRET || "your-secret-key-change-this-in-production",
      {
        expiresIn: "1d" 
      }
    );

    res.cookie("ASPANEL_ELEMENT", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    return res.status(200).json({
      success: true,
      data: {
        id: course.id,
        name: course.name,
        kode: course.kode,
        phone: course.phone,
        city: course.city,
        district: course.district,
        location: course.location
      },
      token: token, 
      message: "Амжилттай нэвтэрлээ"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа гарлаа: " + err.message
    });
  }
};

module.exports = LOGIN_COURSE;