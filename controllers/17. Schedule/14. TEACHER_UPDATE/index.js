const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const TEACHER_UPDATE_SCHEDULE = async (req, res) => {
  try {
    const teacher = req.user;
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const { schedule_date, start_time, end_time, location, note } = req.body;


    await updateData(res, {
      model:`schedule`,
          whereClause: { id: parseInt(id)},
          data: {
              ...(schedule_date && { schedule_date: new Date(schedule_date) }),
              ...(start_time && { start_time: new Date(start_time) }),
              ...(end_time && { end_time: new Date(end_time) }),
              ...(location && { location }),
              ...(note && { note }),
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

module.exports = TEACHER_UPDATE_SCHEDULE
