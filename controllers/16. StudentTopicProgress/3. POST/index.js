const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_POST_TOPIC_PROGRESS = async (req, res) => {
    try 
    {
        const student = req.user;
       
        const { topic, progress } = req.body;
        
        let completed = 0;

        if(!topic)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Үзэж буй сэдэв оруулна уу."
            })
        }
       

        if(progress >= 90)
        {
            completed = 1
        }

        const data = await prismaService.student_topic_progress.create({
            data: {
                topic:parseInt(topic),
                student: parseInt(student.id),
                progress:parseFloat(progress),
                completed: parseInt(completed),
                date: new Date()
            }
        })

        return res.status(200).json({
            success:true,
            data:[],
            message: "Амжилттай."
        })


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

module.exports = STUDENT_POST_TOPIC_PROGRESS;