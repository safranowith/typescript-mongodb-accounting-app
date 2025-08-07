import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }
        
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/typescript-mongodb-app');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        console.log('Continuing without MongoDB...');
        // Don't exit the process, just continue without MongoDB
    }
};