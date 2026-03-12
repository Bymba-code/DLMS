const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const student = req.user; 

        const {
            page,
            limit,
            search,
            orderBy,
            order,
        } = req.query;

        
        const studentData = await prismaService.course_student_category.findFirst({
            where: {
                student:parseInt(student.id)
            },
            include: {
                category_course_student_category_categoryTocategory:true
            }
        })

        if(!studentData)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Суралцагчийн ангилалын мэдээлэл олдсонгүй."
            })
        }

        const where = {};

        where.id = parseInt(studentData.category_course_student_category_categoryTocategory?.id)

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {};

        return await storeData(res, 'category', {
            where,
            orderBy: orderByObj,
            page: page ? parseInt(page) : null,
            limit: limit ? parseInt(limit) : null,
            include,
            search: searchOptions
        });

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

module.exports = STUDENT_GET_ALL_CATEGORY ;