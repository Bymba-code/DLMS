const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService")

const UPDATE_TEACHER = async (req , res) => {
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

        const { course, firstname, lastname, register, kode, password} = req.body;

        if(course)
        {
            const existCourse = await prismaService.course.findUnique({
                where: {
                    id: parseInt(course)
                }
            })

            if(!existCourse)
            {
                return res.status(404).json({
                    success:false,
                    data:[],
                    message: "Автосургуулийн мэдээлэл олдсонгүй."
                })
            }
        }

        let hash;

        if(password)
        {
            hash = await bcrypt.hash(password, 10)
        }

      

        await updateData(res, {
            model:`course_teachers`,
            whereClause: { id: parseInt(id)},
            data: {
                ...(course && { course }),
                ...(firstname && { firstname }),
                ...(lastname && { lastname }),
                ...(register && { register }),
                ...(kode && { kode }),
                ...(password && { password: hash })
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

module.exports = UPDATE_TEACHER