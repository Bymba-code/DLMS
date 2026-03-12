const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_LIMIT_INVOICE = async (req, res) => {
    try 
    {
        const course = req.user;

        const {
            page,
            limit,
            search,
            orderBy,
            order,
            status
        } = req.query;

        const where = {};
        
        if(status) where.status = status

        where.course = parseInt(course?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['number'], 
            value: search
        } : null;

        const include = {
                
        };

        const data = await prismaService.course_limit_invoice.findMany({
            where: {
                course: parseInt(course.id)
            }
        })

        const student = await prismaService.course_student.count({
            where: {
                course:parseInt(course?.id)
            }
        })

        return res.status(200).json({
            success:true,
            data:data,
            usedLimit:student,
            message: "Амжилттай."
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

module.exports = COURSE_GET_ALL_LIMIT_INVOICE ;