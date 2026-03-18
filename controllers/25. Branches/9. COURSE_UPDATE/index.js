const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_BRANCHES = async (req, res) => {
  try 
  {
    const course = req.user;

    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const { 
      name, 
      code, 
      phone, 
      email, 
      city, 
      district, 
      ward, 
      location,
      map, 
      active
    } = req.body;

    const data = await prismaService.branches.findFirst({
      where: {
        id: parseInt(id),
        course: parseInt(course?.course)
      }
    })

    if(!data)
    {
      return res.status(404).json({
        success:false,
        data:[],
        message: "Мэдээлэл олдсонгүй."
      })
    }

    await updateData(res, {
      model: "branches",
      whereClause: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(city && { city:parseInt(city) }),
        ...(district && { district:parseInt(district) }),
        ...(ward && { ward:parseInt(ward) }),
        ...(location && { location }),
        ...(map && { map }),
        ...(active !== undefined && active !== null && { active: parseInt(active) || 0 }),
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

module.exports = COURSE_UPDATE_BRANCHES
