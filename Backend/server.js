import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/database.js';
import ErrorMiddleware from './middlewares/errorMiddleware.js';
import webhookRoutes from './routes/webhookRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

//load environment variables
dotenv.config()

//Connect DB
connectDatabase();

//Create express app
const app = express();

//Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/v1", webhookRoutes);
app.use("/api/v1/message", messageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use(ErrorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});