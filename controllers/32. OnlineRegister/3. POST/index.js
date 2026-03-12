const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const generateStudentCode = async () => {
    try {
        const lastCourse = await prismaService.course.findFirst({
            orderBy: {
                id: 'desc'
            },
            select: {
                kode: true
            }
        });

        const basePrefix = "DL";
        const suffix = "D";
        
        if (!lastCourse || !lastCourse.kode) {
            return `${basePrefix}01${suffix}001`;
        }

        const lastCode = lastCourse.kode;
       
        const regex = /^DL(\d{2})S(\d{3})$/;
        const match = lastCode.match(regex);
        
        if (match) {
            let groupNumber = parseInt(match[1]); // DL-ийн дараах 2 оронтой дугаар (01, 02, ...)
            let sequenceNumber = parseInt(match[2]); // S-ийн дараах 3 оронтой дугаар (001, 002, ...)
            
            sequenceNumber += 1;
            
            if (sequenceNumber > 999) {
                groupNumber += 1;
                sequenceNumber = 1;
            }
            
            const formattedGroup = String(groupNumber).padStart(2, '0');
            const formattedSequence = String(sequenceNumber).padStart(3, '0');
            
            return `${basePrefix}${formattedGroup}${suffix}${formattedSequence}`;
        }
        
        return `${basePrefix}01${suffix}001`;
        
    } catch (err) {
        console.error("Код үүсгэхэд алдаа:", err);
        return "DL01S001";
    }
};

const POST_ONLINE_REGISTER = async (req , res) => {
    try 
    {
        const {course, branch, category, familyname, firstname, lastname, register, gender, bloodtype, city, district, ward, location, phone, birthdate } = req.body;

        if(!course)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургууль сонгоно уу."
            })
        }
        if(!branch)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургуулийн салбар сонгоно уу."
            })
        }
        if(!category)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ангилал сонгоно уу."
            })
        }
        if(!familyname)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Ургийн овог оруулна уу."
            })
        }
        if(!firstname)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Овог нэр оруулна уу."
            })
        }
        if(!lastname)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Нэр оруулна уу."
            })
        }
        if(!register)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Регистерийн дугаар оруулна уу."
            })
        }
        if(!gender)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хүйс сонгоно уу."
            })
        }
        if(!bloodtype)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Цусны бүлэг сонгоно уу."
            })
        }
        if(!city)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хот аймаг сонгоно уу."
            })
        }
        if(!district)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Дүүрэг сонгоно уу."
            })
        }
        if(!ward)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Хороо сонгоно уу."
            })
        }
        if(!location)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "гудамж байр тоот оруулна уу."
            })
        }
        if(!phone)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Утасны дугаар оруулна уу."
            })
        }
        if(!birthdate)
        {
            return res.status(400).json({
                succes:false,
                data:[],
                message: "Төрсөн огноо оруулна уу."
            })
        }

        const courseCategory = await prismaService.course_category.findFirst({
            where: {
                course:parseInt(course),
                category: parseInt(category)
            }
        })

        if(!courseCategory)
        {
            return res.status(404).json({
                success:false,
                data:{},
                message: "Сонгосон ангилал тухайн автосургуульд бүртгэлгүй байна."
            })
        }

        const responseByl = await axios.post(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices`,
            {
                amount: parseInt(courseCategory?.registerPrice),
                description: `${ course } АВТОСУРГУУЛИЙН, БҮРТГЭЛИЙН ТӨЛБӨР`,
                auto_advance:true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            }
        )

        const result = await prismaService.course_online_register.create({
            data:{
                course: parseInt(course),
                branch: parseInt(branch),
                invoice_id: parseInt(responseByl.data.data.invoice_id),
                status: responseByl?.data?.data?.status,
                amount: responseByl?.data?.data?.amount,
                description: responseByl?.data?.data.description,
                number: responseByl?.data?.data?.number,
                url: responseByl?.data?.data?.url,
                due_date:responseByl?.data?.data?.due_date,
                created_at: responseByl?.data?.data?.created_at,
                updated_at: responseByl?.data?.data?.updated_at,
                familyname:familyname,
                firstname:firstname,
                lastname:lastname,
                register:register,
                gender:parseInt(gender),
                bloodtype:parseInt(bloodtype),
                city:parseInt(city),
                district:parseInt(district),
                ward:parseInt(ward),
                location: location,
                phone:phone,
                birthdate:new Date(birthdate),
                date: new Date()
            }
        })

        return res.status(200).json({
            success:true,
            data:[],
            message: "Амжилттай."
        })

    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Амжилттай."
        })
    }
}

module.exports = POST_ONLINE_REGISTER;