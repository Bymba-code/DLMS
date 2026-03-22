const { insertData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt")
const prismaService = require("../../../services/prismaService") 

const POST_COURSE = async (req, res) => {
    try {
        const {
            name, city, district, horoo, location, phone,
            firstname, lastname, phoneUser, kode, password, confirmPassword, birthdate
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, data: [], message: "Автосургуулийн нэрийг оруулна уу." })
        }
        if (!city) {
            return res.status(400).json({ success: false, data: [], message: "Аймаг / Хот сонгоно уу." })
        }
        if (!district) {
            return res.status(400).json({ success: false, data: [], message: "Дүүрэг сонгоно уу." })
        }
        if (!horoo) {
            return res.status(400).json({ success: false, data: [], message: "Хороо сонгоно уу." })
        }
        if (!location) {
            return res.status(400).json({ success: false, data: [], message: "Тодорхой хаяг оруулна уу." })
        }
        if (!phone) {
            return res.status(400).json({ success: false, data: [], message: "Холбогдох дугаар оруулна уу." })
        }
        if (!firstname) {
            return res.status(400).json({ success: false, data: [], message: "Овог нэр оруулна уу." })
        }
        if (!lastname) {
            return res.status(400).json({ success: false, data: [], message: "Нэр оруулна уу." })
        }
        if (!phoneUser) {
            return res.status(400).json({ success: false, data: [], message: "Утасны дугаар оруулна уу." })
        }
        if (!kode) {
            return res.status(400).json({ success: false, data: [], message: "Нэвтрэх код оруулна уу." })
        }
        if (!password) {
            return res.status(400).json({ success: false, data: [], message: "Нууц үг оруулна уу." })
        }
        if (!confirmPassword) {
            return res.status(400).json({ success: false, data: [], message: "Нууц үг давтан оруулна уу." })
        }
        if (!birthdate) {
            return res.status(400).json({ success: false, data: [], message: "Төрсөн огноо оруулна уу." })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, data: [], message: "Нууц үг хоорондоо таарахгүй байна." })
        }

        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt)

        const data = await prismaService.course.create({
            data: {
                name:         name,
                city:         parseInt(city),
                district:     parseInt(district),
                horoo:        parseInt(horoo),
                location:     location,
                phone,
                date:         new Date()
            }
        })

        const resultUser = await prismaService.course_users.create({
            data: {
                course:    parseInt(data?.id),
                firstname: firstname,
                lastname:  lastname,
                phone:     phoneUser,
                kode:      kode,
                password:  hashed,        
                birthdate: new Date(birthdate),
                date:      new Date()
            }
        })

        return res.status(200).json({
            success: true,
            data:    resultUser,
            message: "Амжилттай."
        })

    } catch (err) {
        // ✅ ЗАСАВ: хоосон catch → алдааг буцааж өгөх
        console.error("POST_COURSE error:", err)
        return res.status(500).json({
            success: false,
            data:    [],
            message: err?.message || "Серверт алдаа гарлаа."
        })
    }
}

module.exports = POST_COURSE