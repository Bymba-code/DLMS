const { updateData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService");

const COURSE_UPDATE_CARS = async (req , res) => {
    try 
    {
        const user = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const data = await prismaService.course_cars.findFirst({
            where: {
                id: parseInt(id),
                course: parseInt(user?.course)
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

        const { vechile, region_number, type } = req.body;

        let image;

        if(req.file)
        {
            image = `/${req.file.path}`
        }

        await updateData(res, {
            model:`course_cars`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(vechile && { vechile }),
                ...(region_number && { region_number }),
                ...(req.file && { image:image }),
                ...(type && { type: parseInt(type) }),
            }
        })

        
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = COURSE_UPDATE_CARS