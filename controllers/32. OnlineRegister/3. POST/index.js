const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const generateStudentCode = async (courseId) => {
    try {
        const lastStudent = await prismaService.course_student.findFirst({
            orderBy: {
                id: 'desc'
            },
            select: {
                kode: true
            }
        });

        const basePrefix = "DL";
        const suffix = "S";
        
        if (!lastStudent || !lastStudent.kode) {
            return `${basePrefix}01${suffix}001`;
        }

        const lastCode = lastStudent.kode;
        
        const regex = /^DL(\d{2})S(\d{3})$/;
        const match = lastCode.match(regex);
        
        if (match) {
            let groupNumber = parseInt(match[1]); 
            let sequenceNumber = parseInt(match[2]); 
            
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

        const generatedKode = await generateStudentCode(course);
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(generatedKode, salt);

        const result = await prismaService.course_student.create({
            data: {
                branch: parseInt(branch),
                course: parseInt(course),
                familyname: familyname,
                firstname: firstname,
                lastname: lastname,
                register: register,
                gender: parseInt(gender),
                bloodtype: parseInt(bloodtype),
                city: parseInt(city),
                district: parseInt(district),
                ward:parseInt(ward),
                active:1,
                completed:0,
                location: location,
                phone: phone,
                kode: generatedKode, 
                password: hash, 
                birthdate: new Date(birthdate),
                date: new Date()
            }
        });

        const resultCategory = await prismaService.course_student_category.create({
            data: {
                student: parseInt(result?.id),
                category: parseInt(category),
                payment: parseInt(courseCategory.price),
                date: new Date()
            }
        });

        return res.status(200).json({
            success:true,
            data:result,
            message: "Амжилттай."
        })

    }
    catch(err)
    {
        console.log(err)
        return res.status(500).json({
            success:false,
            data:[],
            message: "Амжилттай."
        })
    }
}

module.exports = POST_ONLINE_REGISTER;