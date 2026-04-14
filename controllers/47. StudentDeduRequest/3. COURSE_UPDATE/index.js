const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_STUDENT_DEDU_REQUEST = async (req, res) => {
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

    const { status, note, exam_date, exam_location, updated_at} = req.body;

    const data = await prismaService.course_student_dedu_request.findFirst({
      where:{
        id:parseInt(id),
        course: parseInt(admin?.course)
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
        ...(status && { status }),
        ...(note && { note }),
        ...(exam_date && { exam_date:new Date(exam_date) }),
        ...(exam_location && { exam_location }),
        ...({ updated_at: new Date() }),
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

module.exports = COURSE_UPDATE_STUDENT_DEDU_REQUEST
