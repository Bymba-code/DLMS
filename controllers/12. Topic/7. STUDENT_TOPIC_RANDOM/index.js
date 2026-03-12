const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_TOPIC_TEST = async (req, res) => {
    try 
    {
        const student = req.user;
        const { topic } = req.body; 

        const allTests = await prismaService.test.findMany({
            where: {
                topic: parseInt(topic)
            },
            include: {
                test_answers_test_answers_testTotest:true
            }
        });

        if (!allTests || allTests.length === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Тест олдсонгүй.'
            });
        }

        return res.status(200).json({
            success: true,
            data: allTests,
            total: allTests.length,
            message: 'Амжилттай'
        });
    } 
    catch(err) 
    {
        console.log('STUDENT_TOPIC_TEST error:', err);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STUDENT_TOPIC_TEST;