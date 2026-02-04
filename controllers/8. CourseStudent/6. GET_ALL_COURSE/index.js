const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const COURSE_GET_ALL_STUDENT = async (req, res) => {
    try 
    {
        const user = req.user;

        const data = await prismaService.course_student.findMany({
            where: {
                course: parseInt(user?.course)
            },
            include: {
                course_student_category: {
                    include: {
                        category_course_student_category_categoryTocategory: true,
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: true,

                    }
                },
                blood_type:true,
                branches:true,
                city_course_student_cityTocity:true,
                district_course_student_districtTodistrict:true,
                gender_course_student_genderTogender:true,
                wards:true

            },
            orderBy: {
                date: 'desc'
            },

        });

        // Хялбаршуулсан өгөгдөл боловсруулах
        const processedData = data.map(student => {
            // Ангилалуудын мэдээлэл
            const categories = student.course_student_category.map(category => {
                const totalAmount = parseFloat(category.payment || 0);
                const paidAmount = category.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category
                    .filter(payment => payment.status === 'paid')
                    .reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);

                return {
                    categoryID: category.category_course_student_category_categoryTocategory?.id, 
                    categoryName: category.category_course_student_category_categoryTocategory?.name || 'N/A',
                    totalAmount: totalAmount,
                    paidAmount: paidAmount,
                    remainingAmount: totalAmount - paidAmount
                };
            });

            // Нийт төлбөрийн тооцоолол
            const totalAmount = categories.reduce((sum, cat) => sum + cat.totalAmount, 0);
            const paidAmount = categories.reduce((sum, cat) => sum + cat.paidAmount, 0);

            // course_student_category-ийг устгах
            const { course_student_category, ...studentData } = student;

            return {
                ...studentData,
                categoryID: categories[0]?.categoryID, 
                categoryName: categories[0]?.categoryName || "",
                totalAmount: totalAmount,
                paidAmount: paidAmount,
                remainingAmount: totalAmount - paidAmount
            };
        });

        return res.status(200).json({
            success: true,
            data: processedData,
            message: "Амжилттай."
        });

    } 
    catch(err) 
    {
        console.error('Error in COURSE_GET_ALL_STUDENT:', err);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = COURSE_GET_ALL_STUDENT;