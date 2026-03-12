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

const POST_COURSE = async (req , res) => {
    try 
    {
        const {name, city, district, horoo, location, location_map, phone, shortdesc  } = req.body;

        if(!name)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Автосургуулийн нэрийг оруулна уу."
            })
        }
        if(!city)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Аймаг / Хот сонгоно уу."
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
        if(!horoo)
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
                message: "Тодорхой хаяг оруулна уу."
            })
        }
        if(!location_map)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Байршил сонгоно уу."
            })
        }
        if(!phone)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Холбогдох дугаар оруулна уу."
            })
        }
        if(!shortdesc)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Богино тайлбар оруулна уу."
            })
        }

        const generatedKode = await generateStudentCode();

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(generatedKode, salt)

        await insertData(res, { model: 'course', data: { name, kode:generatedKode, password:hashed, city:parseInt(city), district: parseInt(district), horoo:parseInt(horoo), location, location_map, phone, shortdesc, date: new Date()}})
    }
    catch(err)
    {

    }
}

module.exports = POST_COURSE