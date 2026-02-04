const prismaService = require("../../../services/prismaService");

const STUDENT_UPDATE_EXAM = async (req, res) => {
    try {
        const student = req.user;
        const { id } = req.params;
        const { userSubmit, progress, success, wrong } = req.body;

        if(!userSubmit)
        {
          return res.status(400).json({
            success:false,
            data:[],
            message: "Шалгалтыг дуусгана уу."
          })
        }

        const result = await prismaService.exam.update({
            where: {
                id: parseInt(id),
            },
            data: {
                isMake: 1,
                progress:parseFloat(progress),
                success:parseInt(success),
                wrong: parseInt(wrong)
            }
        });

        for (const item of userSubmit) {
            const { examTestId, answer, isSuccess } = item;

            await prismaService.exam_test.update({
                where: {
                    id: parseInt(examTestId)
                },
                data: {
                    answer: answer === "" || answer === null ? null : parseInt(answer),
                    isSuccess: isSuccess === "" || isSuccess === null ? 0 : parseInt(isSuccess)
                }
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Шалгалтыг амжилттай илгээлээ."
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа: " + err.message
        });
    }
};

module.exports = STUDENT_UPDATE_EXAM;