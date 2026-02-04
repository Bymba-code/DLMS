const { updateData } = require("../../../services/controllerService")
const bcrypt = require("bcrypt");
const prismaService = require("../../../services/prismaService");
const { default: axios } = require("axios");

const UPDATE_COURSE_SYSTEM_RENTAL = async (req , res) => {
    try 
    {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                data: null,
                message: 'Мэдээлэл буруу эсвэл дутуу байна.'
            });
        }

        const existData = await prismaService.course_system_rental.findUnique({
            where: {
                id: parseInt(id),
            }
        })

        if(!existData)
        {
            return res.status(400).json({
                success:false,
                data:[],
                message: "Мэдээлэл устсан эсвэл байхгүй байна."
            })
        }

        try 
        {
            const checkResponse = await axios.get(`https://byl.mn/api/v1/projects/${process.env.PROJECT_ID}/invoices/${existData?.invoice_id}`,{
                headers: {
                    Authorization: `Bearer ${process.env.BYL_TOKEN}`
                }
            })


            if(checkResponse?.data?.data?.status === 'open')
            {
                return res.status(400).json({
                    success:false,
                    data:[],
                    message: "Төлбөр төлөгдөөгүй байна."
                })
            }

            if(checkResponse?.data?.data?.status === 'paid')
            {
                
                const result = await prismaService.course_system_rental.update({
                    where: {
                        id:parseInt(id)
                    },
                    data: {
                        status: checkResponse?.data?.data?.status,
                        updated_at: checkResponse?.data?.data?.updated_at
                    }
                })

                return res.status(200).json({
                    success:true,
                    data:[],
                    message: "Төлбөр төлөгдсөн байна."
                })

            }
        }
        catch(err)
        {
            if(err.response.status === 404)
            {
                return res.status(404).json({
                    success:false,
                    data:[],
                    message: "Нэхэмжлэлийн мэдээлэл олдсонгүй."
                })
            }

        }
        
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            data:[],
            message: "Серверийн алдаа гарлаа." + err
        })
    }
}

module.exports = UPDATE_COURSE_SYSTEM_RENTAL