const { insertData } = require("../../../services/controllerService")
const prismaService = require("../../../services/prismaService"); 
const bcrypt = require("bcrypt")

const generateStudentCode = async () => {
    try {
        const lastStudent = await prismaService.course_owners.findFirst({
            orderBy: { id: 'desc' },
            select:  { kode: true }
        });

        const BASE   = "DL";
        const SUFFIX = "W";

        if (!lastStudent?.kode) {
            return `${BASE}01${SUFFIX}001`;
        }

        const regex = /^DL(\d{2})W(\d{3})$/;
        const match = lastStudent.kode.match(regex);

        if (!match) {
            return `${BASE}01${SUFFIX}001`;
        }

        let group    = parseInt(match[1], 10);
        let sequence = parseInt(match[2], 10);

        sequence += 1;

        if (sequence > 999) {
            group    += 1;
            sequence  = 1;
        }

        const fGroup = String(group).padStart(2, '0');
        const fSeq   = String(sequence).padStart(3, '0');

        return `${BASE}${fGroup}${SUFFIX}${fSeq}`;

    } catch (err) {
        console.error("Код үүсгэхэд алдаа:", err);
        return "DL01W001";
    }
};

const POST_COURSE_OWNER = async (req, res) => {
    try {
        const { course, firstname, lastname, phone } = req.body;

        if (!course)     return res.status(400).json({ success: false, data: [], message: "Автосургууль сонгоно уу." });
        if (!firstname)  return res.status(400).json({ success: false, data: [], message: "Хэрэглэгчийн овог нэр оруулна уу." });
        if (!lastname)   return res.status(400).json({ success: false, data: [], message: "Хэрэглэгчийн нэр оруулна уу." });
        if (!phone)      return res.status(400).json({ success: false, data: [], message: "Хэрэглэгчийн утасны дугаар оруулна уу." });

        const generatedKode = await generateStudentCode();

        console.log("Үүссэн код:", generatedKode);

        const salt    = await bcrypt.genSalt(10);
        const hashed  = await bcrypt.hash(generatedKode, salt);

        await insertData(res, {
            model: 'course_owners',
            data: {
                course:     parseInt(course),
                firstname,
                lastname,
                phone,
                kode:       generatedKode,
                password:   hashed,
                created_at: new Date(),
            }
        });

    } catch (err) {
        console.error("POST_COURSE_OWNER алдаа:", err);
        return res.status(500).json({ success: false, data: [], message: "Серверийн алдаа гарлаа." });
    }
};

module.exports = POST_COURSE_OWNER;