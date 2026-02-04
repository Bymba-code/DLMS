const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const COURSE_UPDATE_TEACHER = async (req, res) => {
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

    const { firstname, lastname, register, kode, password} = req.body;

    let hash;
    
    if(password)
    {
      hash = await bcrypt.hash(password, 10)
    }

    await updateData(res, {
      model:`course_teachers`,
          whereClause: { id: parseInt(id)},
          data: {
            ...(firstname && { firstname }),
            ...(lastname && { lastname }),
            ...(register && { register }),
            ...(kode && { kode }),
            ...(password && { password: hash })
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

module.exports = COURSE_UPDATE_TEACHER
