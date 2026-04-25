import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js'
import cors from 'cors';
import passport from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { config } from './config/config.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Here you would typically find or create a user in your database
    // For this example, we'll just return the profile
    return done(null, profile);
}))

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Snitch API' });
})

app.use('/api/auth', authRouter)

export default app;