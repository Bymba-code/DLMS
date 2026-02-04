const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const ME_STUDENT = async (req, res) => {
    try 
    {
        const student = req.user;

        const data = await prismaService.course_student.findUnique({
            where: {
                id: parseInt(student?.id)
            }
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }
        
        const messageCount = await prismaService.messages.count({
            where: {
                isRead:0,
                student: parseInt(student?.id)
            }
        })

        return res.status(200).json({
            success:true,
            data:{data,
            messageCount},
            message:"Амжилттай."
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

module.exports = ME_STUDENT ;