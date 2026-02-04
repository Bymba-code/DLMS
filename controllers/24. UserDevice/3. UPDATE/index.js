const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService")

const UPDATE_USER_DEVICE = async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID буруу байна."
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

module.exports = UPDATE_USER_DEVICE
