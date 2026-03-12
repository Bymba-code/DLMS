const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_COURSE_STUDENT = async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const {
      familyname,
      firstname,
      lastname,
      register,
      gender,
      bloodtype,
      city,
      district,
      location,
      phone,
      kode,
      password,
      confirmPassword,
      birthdate
    } = req.body

    // Password hash
    let hashedPassword
    if (password) {
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
        ...(familyname && { familyname }),
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(register && { register }),
        ...(gender && { gender }),
        ...(bloodtype && { bloodtype }),
        ...(city && { city }),
        ...(district && { district }),
        ...(location && { location }),
        ...(phone && { phone }),
        ...(kode && { kode }),
        ...(birthdate && { birthdate: new Date(birthdate) }),
        ...(hashedPassword && { password: hashedPassword })
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

module.exports = UPDATE_COURSE_STUDENT
