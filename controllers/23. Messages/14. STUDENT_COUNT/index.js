const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_MESSAGE_COUNT = async (req, res) => {
    try 
    {
        const student = req.user;

        const result = await prismaService.messages.count({
            where: {
                isRead:0,
                student: parseInt(student?.id)
            }
        })

        console.log(result)

        return res.status(200).json({
            success:true,
            data:result,
            message: "Амжилттай"
        })

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = STUDENT_GET_MESSAGE_COUNT ;