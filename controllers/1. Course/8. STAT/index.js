const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const STAT_COURSE = async (req, res) => {
    try 
    {
        const user = req.user;
        const { month } = req.query; 

        let startDate = null;

        const exams = await prismaService.exam.findMany({
            where: {
                course:parseInt(user.course)
            },
            include:{
                course_student:true,
                category_exam_categoryTocategory:true
            }
        })
        let endDate = null;
        
        if (month && month !== 'all') {
            const [year, monthNum] = month.split('-').map(Number);
            
            if (year && monthNum >= 1 && monthNum <= 12) {
                // Тухайн сарын эхний өдөр
                startDate = new Date(year, monthNum - 1, 1);
                // Дараа сарын эхний өдөр (тухайн сарын сүүлийн өдрийг олох)
                endDate = new Date(year, monthNum, 1);
            }
        }

        const dateFilter = startDate && endDate ? {
            created_at: {
                gte: startDate,
                lt: endDate
            }
        } : {};

        const students = await prismaService.course_student.findMany({
            where: {
                course: parseInt(user?.course)
            },
            include: {
                course_student_category: {
                    include: {
                        course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category: {
                            where: dateFilter // Сараар шүүнэ
                        }
                    }
                }
            }
        });

        // Fetch system rental invoices with date filter
        const systemRentalWhere = {
            course: parseInt(user?.course),
            status: "paid",
            ...(startDate && endDate && {
                created_at: {
                    gte: startDate,
                    lt: endDate
                }
            })
        };

        const systemRentalInvoice = await prismaService.course_system_rental.findMany({
            where: systemRentalWhere
        });

        // Current date
        const now = new Date();

        // Calculate total system rental expenses
        let systemRentalExpenses = 0;
        const activeRentals = [];
        const expiredRentals = [];
        
        systemRentalInvoice.forEach(invoice => {
            systemRentalExpenses += parseFloat(invoice.amount) || 0;
            
            const startDateRental = new Date(invoice.start_date);
            const endDateRental = new Date(invoice.end_date);
            
            if (startDateRental <= now && endDateRental >= now) {
                activeRentals.push(invoice);
            } else {
                expiredRentals.push(invoice);
            }
        });

        // Find latest active system rental
        const sortedActiveRentals = activeRentals
            .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
        
        const latestActiveRental = sortedActiveRentals.length > 0 ? sortedActiveRentals[0] : null;

        // Fetch limit invoices with date filter
        const limitBoughtWhere = {
            course: parseInt(user?.course),
            status: "paid",
            ...(startDate && endDate && {
                created_at: {
                    gte: startDate,
                    lt: endDate
                }
            })
        };

        const limitBoughtInvoices = await prismaService.course_limit_invoice.findMany({
            where: limitBoughtWhere
        });

        // Calculate total expenses from limit invoices
        let limitExpenses = 0;
        let totalLimitsBought = 0;
        
        limitBoughtInvoices.forEach(invoice => {
            limitExpenses += parseFloat(invoice.amount) || 0;
            totalLimitsBought += parseInt(invoice.limit) || 0;
        });

        // Calculate payment statistics
        let totalAmount = 0;
        let paidAmount = 0;
        let remainingAmount = 0;
        let totalInvoices = 0;
        let paidInvoices = 0;
        let unpaidInvoices = 0;
        let cancelledInvoices = 0;

        // Process each student
        students.forEach(student => {
            student.course_student_category.forEach(category => {
                // Хэрвээ сараар шүүж байгаа бол, зөвхөн тухайн сард үүссэн нэхэмжлэлүүдийг тооцоолно
                const payments = category.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
                
                if (startDate && endDate) {
                    // Сараар шүүж байгаа тохиолдолд зөвхөн тухайн сарын төлбөрүүд
                    payments.forEach(payment => {
                        totalInvoices++;
                        const invoiceAmount = parseFloat(payment.amount) || 0;
                        totalAmount += invoiceAmount;

                        if (payment.status === 'paid') {
                            paidAmount += invoiceAmount;
                            paidInvoices++;
                        } else if (payment.status === 'cancelled') {
                            cancelledInvoices++;
                        } else if (payment.status === 'open') {
                            unpaidInvoices++;
                        }
                    });
                } else {
                    // Бүх цаг үеийн өгөгдөл
                    const categoryPayment = parseFloat(category.payment) || 0;
                    totalAmount += categoryPayment;

                    payments.forEach(payment => {
                        totalInvoices++;
                        const invoiceAmount = parseFloat(payment.amount) || 0;

                        if (payment.status === 'paid') {
                            paidAmount += invoiceAmount;
                            paidInvoices++;
                        } else if (payment.status === 'cancelled') {
                            cancelledInvoices++;
                        } else if (payment.status === 'open') {
                            unpaidInvoices++;
                        }
                    });
                }
            });
        });

        // Calculate remaining amount
        remainingAmount = totalAmount - paidAmount;

        // Calculate percentages
        const paymentPercentage = totalAmount > 0 
            ? Math.round((paidAmount / totalAmount) * 100) 
            : 0;

        // Total expenses
        const totalExpenses = systemRentalExpenses + limitExpenses;

        // Get last 3 paid invoices (from filtered data)
        const allPaidInvoices = [];
        students.forEach(student => {
            student.course_student_category.forEach(category => {
                const payments = category.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
                
                payments.forEach(payment => {
                    if (payment.status === 'paid') {
                        allPaidInvoices.push({
                            ...payment,
                            studentName: `${student.lastname} ${student.firstname}`,
                            studentId: student.id
                        });
                    }
                });
            });
        });

        const lastThreePaidInvoices = allPaidInvoices
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 3);

        // Get students with remaining balance (from filtered data)
        const studentsWithDebt = [];
        students.forEach(student => {
            let studentTotal = 0;
            let studentPaid = 0;

            student.course_student_category.forEach(category => {
                const payments = category.course_student_category_payments_course_student_category_payments_course_student_categoryTocourse_student_category || [];
                
                if (startDate && endDate) {
                    // Сараар шүүж байгаа тохиолдолд
                    payments.forEach(payment => {
                        const amount = parseFloat(payment.amount) || 0;
                        studentTotal += amount;
                        
                        if (payment.status === 'paid') {
                            studentPaid += amount;
                        }
                    });
                } else {
                    // Бүх цаг үеийн өгөгдөл
                    studentTotal += parseFloat(category.payment) || 0;
                    
                    payments.forEach(payment => {
                        if (payment.status === 'paid') {
                            studentPaid += parseFloat(payment.amount) || 0;
                        }
                    });
                }
            });

            const remaining = studentTotal - studentPaid;

            if (remaining > 0) {
                studentsWithDebt.push({
                    id: student.id,
                    studentName: `${student.lastname} ${student.firstname}`,
                    familyname: student.familyname,
                    firstname: student.firstname,
                    lastname: student.lastname,
                    phone: student.phone,
                    totalAmount: studentTotal,
                    paidAmount: studentPaid,
                    remainingAmount: remaining,
                    paymentProgress: studentTotal > 0 
                        ? Math.round((studentPaid / studentTotal) * 100) 
                        : 0
                });
            }
        });

        studentsWithDebt.sort((a, b) => b.remainingAmount - a.remainingAmount);

        // Get last 5 exams
        const lastFiveExams = exams
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
            .map(exam => ({
                id: exam.id,
                name: exam.name,
                categoryName: exam.category_exam_categoryTocategory?.name || 'Ангилал байхгүй',
                totalStudents: exam.course_student?.length || 0,
                createdAt: exam.created_at,
                duration: exam.time,
                questionCount: exam.question_count
            }));

        // Calculate student limits (бүх цаг үеийн)
        const allLimitInvoices = await prismaService.course_limit_invoice.findMany({
            where: {
                course: parseInt(user?.course),
                status: "paid"
            }
        });

        let allTotalLimitsBought = 0;
        allLimitInvoices.forEach(invoice => {
            allTotalLimitsBought += parseInt(invoice.limit) || 0;
        });

        const totalStudentsRegistered = students.length;
        const remainingLimit = allTotalLimitsBought - totalStudentsRegistered;
        const limitUsagePercentage = allTotalLimitsBought > 0 
            ? Math.round((totalStudentsRegistered / allTotalLimitsBought) * 100) 
            : 0;

        // Calculate net profit
        const netProfit = paidAmount - totalExpenses;
        const profitMargin = paidAmount > 0 
            ? Math.round((netProfit / paidAmount) * 100) 
            : 0;

        // Prepare statistics object
        const statistics = {
            totalStudents: students.length,
            filterPeriod: startDate && endDate ? {
                month: month,
                startDate: startDate,
                endDate: endDate
            } : {
                month: 'all',
                message: 'Бүх цаг үеийн өгөгдөл'
            },
            studentLimit: {
                totalLimitsBought: allTotalLimitsBought,
                totalStudentsRegistered: totalStudentsRegistered,
                remainingLimit: remainingLimit,
                limitUsagePercentage: limitUsagePercentage,
                canRegisterMore: remainingLimit > 0
            },
            revenue: {
                totalAmount: totalAmount,
                paidAmount: paidAmount,
                remainingAmount: remainingAmount,
                paymentPercentage: paymentPercentage
            },
            expenses: {
                totalExpenses: totalExpenses,
                systemRentalExpenses: systemRentalExpenses,
                limitExpenses: limitExpenses,
                totalLimitsBought: totalLimitsBought,
                totalSystemRentalCount: systemRentalInvoice.length,
                activeSystemRentalCount: activeRentals.length,
                expiredSystemRentalCount: expiredRentals.length,
                limitInvoicesCount: limitBoughtInvoices.length
            },
            activeSystemRental: latestActiveRental ? {
                id: latestActiveRental.id,
                startDate: latestActiveRental.start_date,
                endDate: latestActiveRental.end_date,
                amount: parseFloat(latestActiveRental.amount) || 0,
                number: latestActiveRental.number,
                daysRemaining: Math.ceil((new Date(latestActiveRental.end_date) - now) / (1000 * 60 * 60 * 24)),
                isActive: true
            } : {
                isActive: false,
                message: "Идэвхтэй систем байхгүй"
            },
            profit: {
                netProfit: netProfit,
                profitMargin: profitMargin
            },
            invoices: {
                total: totalInvoices,
                paid: paidInvoices,
                unpaid: unpaidInvoices,
                cancelled: cancelledInvoices
            },
            lastFiveExams: lastFiveExams,
            lastThreePaidInvoices: lastThreePaidInvoices,
            studentsWithDebt: studentsWithDebt
        };

        return res.status(200).json({
            success: true,
            statistics: statistics,
            message: "Амжилттай."
        });

    } 
    catch(err) 
    {
        console.error("Statistics calculation error:", err);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа: ' + err.message
        });
    }
};

module.exports = STAT_COURSE;