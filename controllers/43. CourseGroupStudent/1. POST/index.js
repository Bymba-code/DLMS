const prismaService = require("../../../services/prismaService");

const COURSE_POST_GROUP_STUDENT = async (req, res) => {
    try {
        const user = req.user;
        const { course_group, student } = req.body;

        if (!course_group) return res.status(400).json({
            success: false, data: [], message: "Грүпп сонгоно уу."
        });
        if (!student) return res.status(400).json({
            success: false, data: [], message: "Суралцагч сонгоно уу."
        });

        const existGroup = await prismaService.course_group.findFirst({
            where: { id: parseInt(course_group), course: parseInt(user?.course) }
        });
        if (!existGroup) return res.status(404).json({
            success: false, data: [], message: "Грүппийн мэдээлэл устсан эсвэл байхгүй байна."
        });

        const existStudent = await prismaService.course_student.findFirst({
            where: { id: parseInt(student), course: parseInt(user?.course) }
        });
        if (!existStudent) return res.status(404).json({
            success: false, data: [], message: "Суралцагчийн мэдээлэл устсан эсвэл байхгүй байна."
        });

        // Давхардал шалгах
        const alreadyIn = await prismaService.course_group_to_student.findFirst({
            where: { course_group: parseInt(course_group), student: parseInt(student) }
        });
        if (alreadyIn) return res.status(409).json({
            success: false, data: [], message: "Суралцагч энэ грүппт аль хэдийн бүртгэгдсэн байна."
        });

        const result = await prismaService.course_group_to_student.create({
            data: {
                course_group: parseInt(course_group),
                student:      parseInt(student),
                created_at:   new Date()
            }
        });

        return res.status(200).json({
            success: true,
            data: result,
            message: 'Суралцагч амжилттай нэмэгдлээ.'
        });

    } catch (err) {
        return res.status(500).json({
            success: false, data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = COURSE_POST_GROUP_STUDENT;