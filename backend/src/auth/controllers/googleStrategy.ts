import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../../common/utils/prisma';
import { createToken } from '../utils/createToken';

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails?.[0].value;

            if (!email) {
                done(new Error("Email not found from Google"));
                return
            }

            let user = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            // Eğer yoksa, yeni kullanıcı oluştur
            if (!user) {
                const newAuth = await prisma.auth.create({
                    data: {
                        email,
                        password: 'GOOGLE_USER',
                    }
                });

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
            return done(null, {
                id: user.id,
                email: user.email
            });
        }

    )
)

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj as Express.User);
});

