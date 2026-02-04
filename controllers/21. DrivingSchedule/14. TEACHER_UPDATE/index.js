const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const TEACHER_UPDATE_DRIVING_SCHEDULE = async (req, res) => {
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

    const { category, car, area, schedule_date, start_time, end_time, note } = req.body;

    if(category)
    {
      const existCategory = await prismaService.category.findUnique({
        where: {
          id: parseInt(category)
        }
      })

      if(!existCategory)
      {
        return res.status(404).json({
          success:false,
          data:[],
          message: "Ангилалийн мэдээлэл олдсонгүй."
          })
        }
    }

    if(car)
    {
      const existCar = await prismaService.course_cars.findUnique({
        where:{
          id: parseInt(car)
          }
        })

        if(!existCar)
        {
          return res.status(404).json({
            success:false,
            data:[],
            message: "Автомашины мэдээлэл олдсонгүй."
          })
        }
    }

    await updateData(res, {
            model:`driving_schedule`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(category && { category }),
                ...(car && { car:parseInt(car) }),
                ...(area && { area }),
                ...(schedule_date && { schedule_date: new Date(schedule_date) }),
                ...(start_time && { start_time: new Date(start_time) }),
                ...(end_time && { end_time: new Date(end_time) }),
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

module.exports = TEACHER_UPDATE_DRIVING_SCHEDULE
