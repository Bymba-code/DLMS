const { storeData } = require("../../../services/controllerService");
const prismaService = require("../../../services/prismaService");

const GET_ALL_COURSE = async (req, res) => {
    try 
    {
        const {
            page,
            limit,
            search,
            orderBy,
            order,
            phone,
            city,
            district,
            horoo, 
            featured
        } = req.query;

        const where = {};

        if(phone)
        {
            where.phone = phone;
        }
        if(city)
        {
            where.city = parseInt(city)
        }
        if(district)
        {
            where.district = parseInt(district)
        }
        if(horoo)
        {
            where.horoo = parseInt(horoo)
        }
        if(featured)
        {
            where.featured = parseInt(featured)
        }

        const orderByObj = {
            [orderBy]: order
        };

        const searchOptions = search ? {
            fields: ['name'], 
            value: search
        } : null;

        const include = {
                course_category_course_category_courseTocourse:true,
                course_images_course_images_courseTocourse:true,
                course_list_course_list_courseTocourse:true
            };

        return await storeData(res, 'course', {
            where,
            orderBy: orderByObj,
            page: page ? parseInt(page) : null,
            limit: limit ? parseInt(limit) : null,
            include,
            search: searchOptions
        });

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

module.exports = GET_ALL_COURSE ;