const prismaService = require("../../../services/prismaService");

const STUDENT_POST_EXAM = async (req, res) => {
  try {
    const student = req.user;

    const { category } = req.body;

    if (!category) {
      return res.status(403).json({
        success: false,
        data: [],
        message: "Жолооны ангилал алга байна.",
      });
    }

   const date = new Date();

  // Одоогийн цаг дээр 20 минут нэмэх
  const endDate = new Date(date.getTime() + 20 * 60 * 1000);

  const result = await prismaService.exam.create({
    data: {
      course: parseInt(student?.course),
      student: parseInt(student?.id),
      category: parseInt(category),
      isMake: 0,
      end_date: endDate,
      date: date
    }
  });

    let totalTestNeeded = 0;
    let testsPerTopic = 2;

    if (category === 11) totalTestNeeded = 20;
    if (category === 12) totalTestNeeded = 10;

    const topics = await prismaService.topic.findMany({
      where: {
        category: parseInt(category)
      }
    });

    console.log(topics);

    let selectedTests = [];

    // Сэдэв бүрээс 2-2 тест авах
    for (const topic of topics) {
      const topicTests = await prismaService.test.findMany({
        where: {
          topic: topic.id // эсвэл topic буюу таны schema-д байгаа field нэр
        }
      });

      // Random байдлаар холих ба 2 тест авах
      const shuffled = topicTests.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, testsPerTopic);
      
      selectedTests.push(...selected);

      if (selectedTests.length >= totalTestNeeded) {
        break;
      }
    }

    // Зөвхөн шаардлагатай тоогоор авах
    selectedTests = selectedTests.slice(0, totalTestNeeded);

    // Exam-тай холбох
    const examTests = await Promise.all(
      selectedTests.map((test) =>
        prismaService.exam_test.create({
          data: {
            exam: result.id,
            test: test.id,
            
          }
        })
      )
    );

    return res.status(200).json({
      success: true,
      data: {
        exam: result,
        tests: selectedTests,
        totalTests: selectedTests.length
      },
      message: "Шалгалт амжилттай үүсгэгдлээ."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Серверийн алдаа гарлаа: " + err.message,
    });
  }
};

module.exports = STUDENT_POST_EXAM;