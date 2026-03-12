  const { updateData } = require("../../../services/controllerService")
  const prismaService = require("../../../services/prismaService");

  const COURSE_UPDATE_STUDENT_ACCESS = async (req, res) => {
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

      const {start_date, end_date} = req.body;

      await updateData(res, {
        model: "course_student_access",
        whereClause: { id: parseInt(id) },
        data: {
          ...(start_date && { start_date: new Date(start_date) }),
          ...(end_date && { end_date: new Date(end_date) })
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

  module.exports = COURSE_UPDATE_STUDENT_ACCESS
