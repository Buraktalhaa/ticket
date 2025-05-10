import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
        async (accessToken, refreshToken, profile, done) => {
            // bunu incele
            const user = {
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0].value,
            };
            return done(null, user);
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj as Express.User);
});

