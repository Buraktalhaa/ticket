import { Request, Response } from 'express';
import { checkSignUp } from './checkSignUp';
import prisma from '../../common/utils/prisma';
import bcrypt from 'bcrypt'
import { createToken } from '../utils/createToken';



export async function signUpController(req: Request, res: Response) {

    if (checkSignUp(req) === false) {
        res.status(400).json({
            status: 'fail',
            message: 'Email, name and password are required'
        })
        return
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { email, name } = req.body;


    const existingUSer = await prisma.auth.findUnique(
        {
            where: {
                email
            }
        });

    if (existingUSer) {
        res.status(400).json({
            status: 'fail',
            message: 'There is a user with this email address'
        })
        return;
    }


    // Create Auth
    const newAuth = await prisma.auth.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    });

    // Create User
    const user = await prisma.user.create({
        data:{
            name:"",
            surname:'',
            birthday:'',
            active:true,
            email
        }
    })
    
    const accessToken = createToken(user.id, email, process.env.ACCESS_SECRET!, 10 * 60)
    const refreshToken = createToken(user.id, email, process.env.REFRESH_SECRET!, 24 * 60 * 60)

    // Create Token
    await prisma.token.create({
        data: {
            email,
            accessToken,
            refreshToken
        }
    })

    res.status(200).json({
        status: 'success',
        message: 'Sign up successful',
        accessToken,
        refreshToken,
        data: {
            email: newAuth.email,
            name: newAuth.name,
        }
    });
}


// Süresi dolan token için Express server 403(forbidden) kodu ile işlemin yapılamayacağı bilgisini döndürmektedir.

// Bir access token genellikle üç farklı parçadan oluşur:
// Header: Token’ın tipi ve oluşturmak için kullanılan algoritma hakkındaki veriler burada bulunur.
// Payload: Kullanıcı hakkında bilgi, izinler ve süre sonları burada bulunur.
// Signature: Token’ın kimliğinin doğruluğunu sağlamak için veri bulunur. Bu imza genellikle hashlenir, böylece hackleyici tarafından kolayca taklit edilmesi zor olur.


