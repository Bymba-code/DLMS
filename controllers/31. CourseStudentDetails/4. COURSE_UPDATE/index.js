const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_STUDENT_DETAILS = async (req, res) => {
  try {
    const admin = req.user;

    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const {citizen, education, weight, height, eye_color, hair_color} = req.body;

    const data = await prismaService.course_student_details.findFirst({
      where:{
        id:parseInt(id),
          course_student: {
            course: parseInt(admin?.course)
          },
      }
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Мэдээлэл устсан эсвэл байхгүй байна."
      });
    }

    await updateData(res, {
      model: "course_student_details",
      whereClause: { id: parseInt(id) },
      data: {
        ...(citizen && { citizen }),
        ...(education && { education }),
        ...(weight && { weight:parseInt(weight) }),
        ...(height && { height:parseInt(height) }),
        ...(eye_color && { eye_color }),
        ...(hair_color && { hair_color }),
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

module.exports = COURSE_UPDATE_STUDENT_DETAILS
