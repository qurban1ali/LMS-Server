import express, { NextFunction, Request, Response } from "express";
export const app = express();
require('dotenv').config();
import cors from "cors"; 
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from 'express-rate-limit'


//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors => cors origin resorse sharing header
const origin =  process.env.ORIGIN
console.log("🚀 ~ origin:", origin)

// Allow multiple origins for development and production
const allowedOrigins = [
    "https://lms-chi-ten-61.vercel.app", // Production
    "https://lms-mern-nine.vercel.app", // Alternative production (backup)
    "http://localhost:3000", // Local development (Next.js default)
    "http://localhost:3001", // Alternative local port
    "http://127.0.0.1:3000", // Alternative localhost
    "http://127.0.0.1:3001", // Alternative localhost
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin) || origin === process.env.ORIGIN) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        },
        credentials:true
    })
);



// api request limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56,
	
})


// Routes
app.use('/api/v1/', userRouter);
app.use('/api/v1/', courseRouter);
app.use('/api/v1/', orderRouter);
app.use('/api/v1/', notificationRouter);
app.use('/api/v1/', analyticsRouter);
app.use('/api/v1/', layoutRouter);



//TESTING API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
        success: true,
        message: "API is working"
    })
});

// app.all("", (req: Request, res: Response, next: NextFunction) => {
//     const err = new Error(`Route ${req.originalUrl} not found `) as any; 
//     err.statusCode = 404;
//     next(err);
// });

//miiddleware calls
app.use(limiter)

app.use(ErrorMiddleware);

