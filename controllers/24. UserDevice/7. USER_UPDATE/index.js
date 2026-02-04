const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService")

const USER_UPDATE_DEVICE = async (req, res) => {
  try 
  {
    const user = req.user;

    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
      })
    }

    const existData = await prismaService.course_user_device.findUnique({
        where:{
            id: parseInt(id),
            user: parseInt(user?.id)
        }
    })

    if(!existData)
    {
        return res.status(404).json({
            success:false,
            data:[],
            message: "Мэдээлэл устсан эсвэл байхгүй байна."
        })
    }

    const { isTrusted, isBlocked } = req.body;

    await updateData(res, {
            model:`course_user_device`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(isTrusted !== undefined && isTrusted !== null && { isTrusted: parseInt(isTrusted) || 0 }),
                ...(isBlocked !== undefined && isBlocked !== null && { isBlocked: parseInt(isBlocked) || 0 }),
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

module.exports = USER_UPDATE_DEVICE
