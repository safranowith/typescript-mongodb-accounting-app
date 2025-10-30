import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { setFileRoutes } from './routes/fileRoutes';
import { setDataRoutes } from './routes/dataRoutes';
import { setReportRoutes } from './routes/reportRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDatabase();

// Set up routes
setFileRoutes(app);
setDataRoutes(app);
setReportRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Local development: http://localhost:${PORT}`);
});