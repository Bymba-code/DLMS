const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STUDENT_GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const student = req.user;

        const data = await prismaService.course_student_category.findMany({
            where: {
                student: parseInt(student.id)
            },
            include:{
                course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category:true,
                category_course_student_category_categoryTocategory:true
            }
        })

        const processedData = data.map(category => {
            const invoices = category.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category;
            
            const totalAmount = parseFloat(category.payment) || 0;
            
            const paidAmount = invoices
                .filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + parseFloat(invoice.amount || 0), 0);
            
            const remainingAmount = totalAmount - paidAmount;
            
            const paymentStats = {
                totalAmount: totalAmount,
                paidAmount: paidAmount,
                remainingAmount: remainingAmount,
                totalInvoices: invoices.length,
                paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
                unpaidInvoices: invoices.filter(inv => inv.status === 'open').length,
                paymentPercentage: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0
            };

            return {
                ...category,
                paymentStats
            };
        });

        const overallStats = {
            totalAmount: processedData.reduce((sum, cat) => sum + cat.paymentStats.totalAmount, 0),
            totalPaid: processedData.reduce((sum, cat) => sum + cat.paymentStats.paidAmount, 0),
            totalRemaining: processedData.reduce((sum, cat) => sum + cat.paymentStats.remainingAmount, 0),
            totalInvoices: processedData.reduce((sum, cat) => sum + cat.paymentStats.totalInvoices, 0),
            totalPaidInvoices: processedData.reduce((sum, cat) => sum + cat.paymentStats.paidInvoices, 0),
            totalUnpaidInvoices: processedData.reduce((sum, cat) => sum + cat.paymentStats.unpaidInvoices, 0)
        };

        return res.status(200).json({
            success: true,
            data: processedData,
            overallStats: overallStats,
            message: "Амжилттай."
        })

    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

module.exports = STUDENT_GET_ALL_CATEGORY;