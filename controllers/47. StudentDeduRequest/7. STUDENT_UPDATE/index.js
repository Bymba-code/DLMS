const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const STUDENT_UPDATE_DEDU_REQUEST = async (req, res) => {
  try {
    const student = req.user;

    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const { description } = req.body;

    const data = await prismaService.course_student_dedu_request.findFirst({
      where:{
        id:parseInt(id),
        student:parseInt(student?.id)
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
      model: "course_student_dedu_request",
      whereClause: { id: parseInt(id) },
      data: {
        ...(description && { description })
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

module.exports = STUDENT_UPDATE_DEDU_REQUEST
