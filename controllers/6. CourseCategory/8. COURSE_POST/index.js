const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const COURSE_POST_CATEGORY = async (req , res) => {
    try 
    {
        const course = req.user 
        const { category, registerPrice, price, active  } = req.body;

        if(!category)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }
        if(!registerPrice)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Бүртгэлийн төлбөр оруулна уу."
            })
        }
        if(!price)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нийт үнэ оруулна уу."
            })
        }

        const categoryExist = await prismaService.category.findUnique({
            where: {
                id: parseInt(category)
            }
        })

        if(!categoryExist)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон ангилалын мэдээлэл олдсонгүй."
            })
        }

        const dataExist = await prismaService.course_category.findFirst({
            where: {
                course: parseInt(course.id),
                category: category
            }
        })

        if(dataExist)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Сонгосон ангилал нэмэгдсэн байна."
            })
        }
        
        await insertData(res, { model: 'course_category', data: { course: parseInt(course?.id), category:parseInt(category), registerPrice:parseInt(registerPrice), price:parseInt(price), active: active ? 1 : 0, created_at: new Date()}})
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = COURSE_POST_CATEGORY