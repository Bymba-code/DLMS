const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_STUDENT = async (req, res) => {
  try {
    const user = req.user;

    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const existData = await prismaService.course_student.findFirst({
      where: {
        id:parseInt(id),
        course: parseInt(user?.course)
      }
    })

    if(!existData)
    {
      return res.status(404).json({
        success:false,
        data:[],
        message: "Мэдээлэл устсан эсвэл байхгүй байна."
      })
    }

    const { branch, familyname, firstname, lastname, register, gender, bloodtype, city, district, ward, location, phone, birthdate, category } = req.body;

    let hashedPassword = "";
    if (password) {
      if(!confirmPassword)
      {
        return res.status(400).json({
          success:false,
          data:[],
          message: "Нууц үг давтан оруулна уу."
        })
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "Нууц үг таарахгүй байна."
        })
      }
      hashedPassword = await bcrypt.hash(password, 10)
    }

    await updateData(res, {
      model: "course_student",
      whereClause: { id: parseInt(id) },
      data: {
        ...(branch && { branch:parseInt(branch) }),
        ...(familyname && { familyname }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(register && { register }),
        ...(gender && { gender:parseInt(gender) }),
        ...(bloodtype && { bloodtype:parseInt(bloodtype) }),
        ...(city && { city:parseInt(city) }),
        ...(district && { district:parseInt(district) }),
        ...(ward && {ward: parseInt(ward)}),
        ...(location && { location }),
        ...(phone && { phone }),
        ...(kode && { kode }),
        ...(birthdate && { birthdate: new Date(birthdate) }),
        ...(password && { password: hashedPassword })
      }
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      message: "Серверийн алдаа гарлаа. " + err.message
    })
  }
}

module.exports = COURSE_UPDATE_STUDENT
