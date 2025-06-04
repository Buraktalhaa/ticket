import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../../common/utils/prisma';

passport.use("google",
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails?.[0].value;

            if (!email) {
                done(new Error("Email not found from Google"));
                return
            }

            // check user
            let user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        firstName: profile.name?.givenName || '',
                        lastName: profile.name?.familyName || '',
                        email,
                        active: true,
                        birthday: '',
                        photoName: profile.photos?.[0].value || ''
                    }
                });

                const defaultRole = await prisma.role.findUnique({
                    where: {
                        name: 'user'
                    }
                });

                if (defaultRole) {
                    await prisma.userRole.create({
                        data: {
                            userId: user.id,
                            roleId: defaultRole.id
                        }
                    });
                }
            }

            const googleAuth = await prisma.googleAuth.findUnique({
                where:{
                    userId:user.id
                }
            })

            if(!googleAuth){
                await prisma.googleAuth.create({
                    data:{
                       userId:user.id 
                    }
                })
            }

            // googleToken
            await prisma.googleToken.upsert({
                where: {
                    userId: user.id
                },
                update: {
                    googleAccessToken: accessToken,
                    googleRefreshToken: refreshToken,
                    updatedAt: new Date()
                },
                create:{
                    userId: user.id,
                    googleAccessToken: accessToken,
                    googleRefreshToken: refreshToken,
                }
            })

            return done(null, {
                id: user.id,
                email: user.email
            });
        }
    )
)