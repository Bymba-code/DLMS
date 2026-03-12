const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddlewareCourse = (req, res, next) => {
    try {
        const token = req.cookies.ASPANEL_ELEMENT
        
        if (!token) {
            return res.status(401).json({
                success: false, 
                message: "Нэвтрэх шаардлагатай.",
                code: "NO_TOKEN"
            })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        
        req.user = decoded

        next()

    } catch (err) {
        console.error("Auth middleware error:", err.name)

        // Cookie устгах
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

        // Token хугацаа дууссан
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.",
                code: "TOKEN_EXPIRED"
            })
        }

        // Буруу token
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Буруу эсвэл хүчингүй token байна.",
                code: "INVALID_TOKEN"
            })
        }

        // Бусад алдаа
        return res.status(401).json({
            success: false,
            message: "Нэвтрэх шаардлагатай.",
            code: "AUTH_ERROR"
        })
    }
}

module.exports = authMiddlewareCourse