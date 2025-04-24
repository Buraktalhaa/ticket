import { Request, Response } from 'express';
import { checkSignUp } from './checkSignUp';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

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


    // ACCESS TOKEN
    function createToken(id:string, secretKey:string, ) { //expiresIn: string
        return jwt.sign(
            { userId: id }, 
            secretKey!, 
            { algorithm: 'HS256', expiresIn:"1h" }
        );
    };


    // Create Auth
    const newAuth = await prisma.auth.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword
        }
    });

    // Create User
    const newUSer = await prisma.user.create({
        data:{
            name:"",
            surname:'',
            email:email,
            birthday:'',
            active:true,
            authId:newAuth.id

        }
    }) 


    const accessToken = createToken(newAuth.id, process.env.ACCESS_SECRET!)
    const refreshToken = createToken(newAuth.id, process.env.REFRESH_SECRET!)

    await prisma.token.create({
        data: {
            accessToken,
            refreshToken,
            authId: newAuth.id

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


