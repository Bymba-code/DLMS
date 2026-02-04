const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");

const POST_COURSE_CATEGORY = async (req , res) => {
    try 
    {
        const { course, category, registerPrice, price } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
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
                course: course,
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
        
        const result = await prismaService.course_category.create({
            data: {
                course:parseInt(course),
                category:parseInt(category),
                registerPrice: parseInt(registerPrice),
                price: parseInt(price)
            }
        })

        return res.status(200).json({
            success:true,
            data:result,
            message: "Амжилттай."
        })

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

module.exports = POST_COURSE_CATEGORY