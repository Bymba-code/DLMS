const prismaService = require('./prismaService'); // Зам зөв оруулна уу

const storeData = async (res, modelString, options = {}) => {
    try {

        if (!prismaService[modelString]) {
            return res.status(400).json({
                success: false,
                data: [],
                message: `'${modelString}' модел олдсонгүй.`,
                error: 'INVALID_MODEL'
            });
        }

        const {
            where = {},
            orderBy = { id: 'desc' },
            page = null,
            limit = null,
            include = null,
            select = null,
            search = null
        } = options;

        const queryOptions = {
            where: { ...where }
        };

        // Хайлтын функц нэмэх (search)
        if (search && search.fields && search.fields.length > 0 && search.value) {
            const searchConditions = search.fields.map(field => ({
                [field]: {
                    contains: search.value
                }
            }));

            queryOptions.where = {
                ...queryOptions.where,
                OR: searchConditions
            };
        }

        // OrderBy нэмэх
        if (orderBy) {
            queryOptions.orderBy = orderBy;
        }

        // Include нэмэх
        if (include) {
            queryOptions.include = include;
        }

        // Select нэмэх (select болон include хамт ашиглаж болохгүй)
        if (select && !include) {
            queryOptions.select = select;
        }

        // Pagination тохиргоо
        let pagination = null;

        if (page && limit) {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            // Утга буруу эсэхийг шалгах
            if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
                return res.status(400).json({
                    success: false,
                    data: [],
                    message: 'Хуудас ба лимит нь эерэг тоо байх ёстой.'                
                });
            }

            const skip = (pageNum - 1) * limitNum;
            queryOptions.skip = skip;
            queryOptions.take = limitNum;

            // Нийт тооллогыг авах
            const total = await prismaService[modelString].count({
                where: queryOptions.where
            });

            pagination = {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
                hasNextPage: pageNum < Math.ceil(total / limitNum),
                hasPrevPage: pageNum > 1
            };
        }

        // Датаг авах
        const data = await prismaService[modelString].findMany(queryOptions);

        // Датаг буцаах (хоосон байсан ч амжилттай гэж тооцох)
        const response = {
            success: true,
            data,
            count: data.length,
            message: data.length === 0 ? 'Мэдээлэл олдсонгүй.' : 'Амжилттай.',
        };

        if (pagination) {
            response.pagination = pagination;
        }

        return res.status(200).json(response);

    } catch (err) {

        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

const storeSingleData = async (res, modelString, options = {}) => {
    try {
        // Модел байгаа эсэхийг шалгах
        if (!prismaService[modelString]) {
            return res.status(400).json({
                success: false,
                data: null,
                message: `'${modelString}' модел олдсонгүй.`,
                error: 'INVALID_MODEL'
            });
        }

        const {
            where = {},
            include = null,
            select = null
        } = options;

        // Where clause хоосон эсэхийг шалгах
        if (!where || Object.keys(where).length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'Хайлтын нөхцөл заавал шаардлагатай.',
            });
        }

        // Query options үүсгэх
        const queryOptions = {
            where: { ...where }
        };

        // Include нэмэх
        if (include) {
            queryOptions.include = include;
        }

        // Select нэмэх
        if (select && !include) {
            queryOptions.select = select;
        }

        // Датаг авах
        const data = await prismaService[modelString].findUnique(queryOptions);

        // Дата олдоогүй бол
        if (!data) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Мэдээлэл олдсонгүй.',
            });
        }

        // Амжилттай бол
        return res.status(200).json({
            success: true,
            data: data,
            message: 'Амжилттай.'
        });

    } catch (err) {

        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Мэдээлэл олдсонгүй.',
            });
        }

        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.',
        });
    }
};

const insertData = async (res, params = {}) => {
    try 
    {
        const { model, data, include } = params

        if(!model)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Моделийн нэр оруулна уу."
            })
        }

        if(!data || typeof data !== "object" || Object.keys(data).length === 0)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Өгөгдөл байхгүй эсвэл буруу байна."
            })
        }

        // Модел байгаа эсэхийг шалгах
        if (!prismaService[model]) {
            return res.status(400).json({
                success: false,
                data: null,
                message: `'${model}' модел олдсонгүй.`
            });
        }

        const result = await prismaService[model].create({
            data,
            include
        })

        return res.status(200).json({
            success:true,
            data:result,
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

const updateData = async (res, options = {}) => {
    try {
        const { 
            model, 
            whereClause = {}, 
            data = {}, 
            include = {},
            select = undefined,
            returnResponse = true 
        } = options;

        if (!model || !prismaService[model]) {
            return res.status(400).json({
                success: false,
                data: [],
                message: `Тухайн модел устсан эсвэл байхгүй байна.`,
            });
        }   

        if (!whereClause || Object.keys(whereClause).length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Шинэчлэх бичлэгийн нөхцөл байхгүй байна.",
            });
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Шинэчлэлт хийх мэдээлэл байхгүй байна.",
            });
        }

        const existingRecord = await prismaService[model].findUnique({
            where: whereClause
        });

        if (!existingRecord) {
            return res.status(404).json({
                success: false,
                data: [],
                message: "Шинэчлэх өгөгдөл олдсонгүй.",
            });
        }

        const updateOptions = {
            where: whereClause,
            data: data
        };

        const updatedData = await prismaService[model].update(updateOptions);

        if (returnResponse) {
            return res.status(200).json({
                success: true,
                data: updatedData,
                message: "Амжилттай шинэчлэгдлээ.",
            });
        }

        return updatedData;

    } catch (err) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Серверийн алдаа гарлаа.' + err
        });
    }
};

const deleteData = async (model, whereClause = {}, res, include = {}) => {
    try {
        if (!prismaService[model]) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Тухайн модел устсан эсвэл байхгүй байна.",
            });
        }
        
        const data = await prismaService[model].findFirst({
            where:whereClause,
        })

        if(!data)
        {
            return res.status(404).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        const deletedData = await prismaService[model].delete({
            where: whereClause,
            include,
        });

        return res.status(200).json({
            success: true,
            data: deletedData,
            message: "Амжилттай устгалаа.",
        });
    } catch (err) {
        return returnCatchedError(err, res);
    }
};

module.exports = { storeData, storeSingleData, insertData, updateData, deleteData};