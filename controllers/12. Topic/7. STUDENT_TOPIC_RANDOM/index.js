const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_TOPIC_TEST = async (req, res) => {
    try 
    {
        const student = req.user;
        const { topic, testLength = 15 } = req.body; 

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

        const requestedLength = parseInt(testLength);
        if (isNaN(requestedLength) || requestedLength <= 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'Тестийн тоо буруу байна.'
            });
        }

        const shuffled = [...allTests];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const randomTests = shuffled.slice(0, Math.min(requestedLength, allTests.length));

        return res.status(200).json({
            success: true,
            data: randomTests,
            total: allTests.length,
            requested: requestedLength,
            selected: randomTests.length,
            message: 'Амжилттай'
        });
    } 
    catch(err) 
    {
        console.error('STUDENT_TOPIC_TEST error:', err);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STUDENT_TOPIC_TEST;