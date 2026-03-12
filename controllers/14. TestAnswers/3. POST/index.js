const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_TEST_ANSWERS = async (req , res) => {
    try 
    {
        const { test, title, isSuccess } = req.body;

        if(!test)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хариулт оруулах тест оруулна уу."
            })
        }
        if(!title)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хариул оруулна уу."
            })
        }
        if(!isSuccess)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Зөв эсэхийн сонгоно уу."
            })
        }

        const existTest = await prismaService.test.findUnique({
            where: {
                id: parseInt(test)
            }
        })

        if(!existTest)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон тестийн мэдээлэл олдсонгүй."
            })
        }

        await insertData(res, { model: 'test_answers', data: { test:parseInt(test), title , isSuccess: !isSuccess ? 0 : 1 }})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа."
        })
    }
}

module.exports = POST_TEST_ANSWERS