const { insertData } = require("../../../services/controllerService");
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService"); 
const { default: axios } = require("axios");
const GET_ALL_WARDS = require("../../30. Wards/1. GET_ALL");

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
            let groupNumber = parseInt(match[1]); // DL-ийн дараах 2 оронтой дугаар (01, 02, ...)
            let sequenceNumber = parseInt(match[2]); // S-ийн дараах 3 оронтой дугаар (001, 002, ...)
            
            // Дараагийн дугаарыг тооцоолох
            sequenceNumber += 1;
            
            // Хэрэв 999-ээс давсан бол дараагийн group руу шилжих
            if (sequenceNumber > 999) {
                groupNumber += 1;
                sequenceNumber = 1;
            }
            
            // Форматлах: DL + 2 оронтой group + S + 3 оронтой sequence
            const formattedGroup = String(groupNumber).padStart(2, '0');
            const formattedSequence = String(sequenceNumber).padStart(3, '0');
            
            return `${basePrefix}${formattedGroup}${suffix}${formattedSequence}`;
        }
        
        return `${basePrefix}01${suffix}001`;
        
    } catch (err) {
        console.error("Код үүсгэхэд алдаа:", err);
        // Алдаа гарвал эхний код буцаах
        return "DL01S001";
    }
};

const COURSE_POST_STUDENT = async (req, res) => {
    try 
    {
        const user = req.user;

        const paidInvoices = await prismaService.course_limit_invoice.findMany({
            where: {
                course: parseInt(user?.course),
                status: "paid"
            }
        });


        if(!paidInvoices)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Танд худалдаж авсан бүртгэлийн тоо байхгүй байна."
            })
        }

        const totalLimit = paidInvoices.reduce((sum, item) => sum + item.limit, 0);

        const totalStudent = await prismaService.course_student.count({
            where: {
                course: parseInt(user?.course)
            }
        });

        if(parseInt(totalStudent) >= parseInt(totalLimit))
        {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Бүртгэлийн хязгаар дүүрсэн байна."
            });
        }
        
        const { branch, familyname, firstname, lastname, register, gender, bloodtype, city, district, ward, location, phone, birthdate, category } = req.body;

        if(!branch)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Салбар сонгоно уу."
            })
        }
        // Validation
        if(!familyname) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Ургийн овог оруулна уу."
            });
        }
        if(!firstname) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Овог нэр оруулна уу."
            });
        }
        if(!lastname) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Нэр оруулна уу."
            });
        }
        if(!register) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Регистерийн дугаар оруулна уу."
            });
        }
        if(!gender) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хүйс сонгоно уу."
            });
        }
        if(!bloodtype) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Цусны бүлэг сонгоно уу."
            });
        }
        if(!city) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хот аймаг сонгоно уу."
            });
        }
        if(!district) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Дүүрэг сонгоно уу."
            });
        }
        if(!ward) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Хороо / Баг сонгоно уу."
            });
        }
        if(!location) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Гудамж байр тоот оруулна уу."
            });
        }
        if(!phone) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Утасны дугаар оруулна уу."
            });
        }
        if(!birthdate) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Төрсөн огноо оруулна уу."
            });
        }
        if(!category) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Ангилал сонгоно уу."
            });
        }

        // Ангилал шалгах
        const existCategory = await prismaService.course_category.findFirst({
            where: {
                category: parseInt(category),
                course: parseInt(user.course)
            }
        });

        if(!existCategory) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Сонгосон ангилалын мэдээлэл олдсонгүй."
            });
        }

        const existBranch = await prismaService.branches.findFirst({
            where: {
                id:parseInt(branch),
                course:parseInt(user?.course)
            }
        })

        if(!existBranch)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Сонгосон салбарын мэдээлэл олдсонгүй."
            })
        }

        // Автоматаар код үүсгэх
        const generatedKode = await generateStudentCode(user.course);

        // Нууц үг = Код (hash хийх)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(generatedKode, salt);

        // Суралцагч үүсгэх
        const result = await prismaService.course_student.create({
            data: {
                branch: parseInt(branch),
                course: parseInt(user.course),
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
                kode: generatedKode, // Автоматаар үүссэн код
                password: hash, 
                birthdate: new Date(birthdate),
                date: new Date()
            }
        });

        const resultCategory = await prismaService.course_student_category.create({
            data: {
                student: parseInt(result?.id),
                category: parseInt(category),
                payment: parseInt(existCategory.price),
                date: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            data: {
                ...result,
                generatedKode: generatedKode // Үүссэн кодыг буцаах
            },
            message: `Амжилттай бүртгэгдлээ. Нэвтрэх код: ${generatedKode}, Нууц үг: ${generatedKode}`
        });

    }
    catch(err)
    {   
        console.log(err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа."
        });
    }
};

module.exports = COURSE_POST_STUDENT;