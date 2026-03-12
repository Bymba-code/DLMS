const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const OWNER_GET_ALL_CATEGORY = async (req, res) => {
    try 
    {
        const owner = req.user;

        // Энэ course-д аль хэдийн нэмэгдсэн category-ийн ID-уудыг авна
        const courseCategories = await prismaService.course_category.findMany({
            where: {
                course: parseInt(owner?.id)
            },
            select: {
                category: true
            }
        });

        const usedCategoryIds = courseCategories.map((cc) => cc.category);

        // Нэмэгдээгүй байгаа ангилалуудыг авна
        const availableCategories = await prismaService.category.findMany({
            where: {
                id: {
                    notIn: usedCategoryIds
                }
            }
        });

        return res.status(200).json({
            success: true,
            data: availableCategories,
            message: "Амжилттай"
        });
    } 
    catch(err) 
    {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Серверийн алдаа гарлаа." + err
        });
    }
};

module.exports = OWNER_GET_ALL_CATEGORY;