const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_BRANCHES = async (req, res) => {
  try 
  {
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const { 
      course, 
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

    await updateData(res, {
      model: "branches",
      whereClause: { id: parseInt(id) },
      data: {
        ...(course && { course:parseInt(course) }),
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

module.exports = UPDATE_BRANCHES
