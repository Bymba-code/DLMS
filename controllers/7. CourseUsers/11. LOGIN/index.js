  const prismaService = require("../../../services/prismaService");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const UAParser = require('ua-parser-js');

  const LOGIN_USER = async (req, res) => {
    try {
      const { kode, password } = req.body;

      // Validation
      if (!kode) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Нэвтрэх код оруулна уу."
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          data: [],
          message: "Нууц үг оруулна уу."
        });
      }

      // Find user
      const user = await prismaService.course_users.findFirst({
        where: {
          kode: kode
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          data: [],
          message: "Нэвтрэх код эсвэл нууц үг буруу байна."
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          data: [],
          message: "Нэвтрэх код эсвэл нууц үг буруу байна."
        });
      }

      // Get device info
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                req.socket.remoteAddress || 
                req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      const parser = new UAParser(userAgent);
      const result = parser.getResult();

      const browser = result.browser.name || 'Unknown';   
      const os = result.os.name || 'Unknown';              
      const deviceType = result.device.type || 'desktop';
      
      // Timezone клиентээс илгээх хэрэгтэй, эсвэл default утга өгөх
      const timezone = req.body.timezone || 'UTC';

      const userDevices = await prismaService.course_user_device.findMany({
        where: {
          user: parseInt(user?.id)
        }
      });

      const isExistDevice = userDevices.find((item) => 
        item.device_type === deviceType && 
        item.device === os && 
        item.browser === browser
      );

      await prismaService.course_user_device.updateMany({
        where: {
          user: parseInt(user.id)
        },
        data: {
          isActive: 0
        }

      
      });

      const date = new Date();

      const formatted = date.toLocaleString('sv-SE', { 
        timeZone: 'Asia/Ulaanbaatar', 
        hour12: false ,
      
      })

      const mongoliaTime = date.toLocaleString('sv-SE', {
        timeZone: 'Asia/Ulaanbaatar',
        hour12: false,
      });


// Монгол цагт шилжүүлэх (UTC+8)

// MySQL-д TIMESTAMP форматаар оруулах
const mongoliaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);


console.log(timezone)

      if (isExistDevice) {
        await prismaService.course_user_device.update({
          where: {
            id: isExistDevice.id
          },
          data: {
            last_login: new Date(),
            isActive: 1
          }
        });

        await prismaService.course_user_device_log.create({
          data: {
            course: parseInt(user?.course),
            user: parseInt(user?.id),
            device: parseInt(isExistDevice?.id),
            action: "LOGIN",
            targetType: "USER",
            targetId: `${isExistDevice?.id}`,
            label: ` [${mongoliaDate}] Хэрэглэгч нэвтэрсэн.`,
            ip: ip,
            date: mongoliaDate
          }
        })
      } else {
        if (userDevices.length >= 5) {
          return res.status(400).json({
            success: false,
            data: [],
            message: "Таны нэвтрэх боломжтой төхөөрөмжийн тоо хэтэрсэн байна. (Хамгийн ихдээ 5)"
          });
        }

        const result = await prismaService.course_user_device.create({
          data: {
            course_users: {
              connect: {
                id: user.id
              }
            },
            device: os,
            timezone: timezone,
            device_type: deviceType,
            browser: browser,
            first_login: mongoliaDate,
            last_login: mongoliaDate,
            isTrusted: 1, 
            isBlocked: 0,
            isActive: 1,
            date: mongoliaDate
          }
        });

        await prismaService.course_user_device_log.create({
          data: {
            course: parseInt(user?.course),
            user: parseInt(user?.id),
            device: parseInt(result?.id),
            action: "REGISTER_DEVICE",
            targetType: "DEVICE",
            targetId: `${result?.id}`,
            label: `Шинэ төхөөрөмжөөс нэвтэрлээ. ${[mongoliaDate]}`,
            ip: ip,
            date: mongoliaDate
          }
        })
      }
      
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          kode: user.kode,
          name: user.name,
          course: user.course
        },
        process.env.TOKEN_SECRET || "your-secret-key-change-this-in-production",
        {
          expiresIn: "1d" 
        }
      );

      // Set cookie
      res.cookie("ASPANEL_ELEMENT_TKN", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
        },
        token: token, 
        message: "Амжилттай нэвтэрлээ"
      });

    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({
        success: false,
        data: [],
        message: "Серверийн алдаа гарлаа: " + err.message
      });
    }
  };

  module.exports = LOGIN_USER;  