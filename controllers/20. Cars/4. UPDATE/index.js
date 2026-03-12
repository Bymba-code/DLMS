const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")

const UPDATE_CARS = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const { course, vechile, region_number, type } = req.body;

        let image;

        if(req.file)
        {
            image = `/${req.file.path}`
        }

        await updateData(res, {
            model:`course_cars`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(course && { course: parseInt(course) }),
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

module.exports = UPDATE_CARS