import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js'
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Snitch API' });
})

app.use('/api/auth', authRouter)

export default app;