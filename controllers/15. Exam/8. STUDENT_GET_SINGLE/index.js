const { storeSingleData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_SINGLE_EXAM = async (req, res) => {
    try {
        const student = req.user;

        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const where = { id: parseInt(id), student:parseInt(student.id) };

       
        const include = {
               exam_test_exam_test_examToexam:{
                    include: {
                        test_exam_test_testTotest:
                        {
                            include: {
                                test_answers_test_answers_testTotest:true
                            }
                        }
                    }
                }
            };

        return await storeSingleData(res, 'exam', {
            where,
            include
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: null,
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = STUDENT_GET_SINGLE_EXAM;