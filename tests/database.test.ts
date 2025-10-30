import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';

// Mock mongoose
jest.mock('mongoose', () => ({
    connect: jest.fn(),
    connection: {
        readyState: 0
    }
}));

const mockMongoose = mongoose as jest.Mocked<typeof mongoose>;

describe('Database', () => {
    let consoleSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    describe('connectDatabase', () => {
        it('should connect to MongoDB successfully', async () => {
            mockMongoose.connect.mockResolvedValue(undefined as any);
            (mockMongoose.connection as any).readyState = 0;

            await connectDatabase();

            expect(mockMongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/typescript-mongodb-app');
            expect(console.log).toHaveBeenCalledWith('MongoDB connected successfully');
        });

        it('should use custom MongoDB URI from environment', async () => {
            const customUri = 'mongodb://custom:27017/custom-db';
            process.env.MONGODB_URI = customUri;
            
            mockMongoose.connect.mockResolvedValue(undefined as any);
            (mockMongoose.connection as any).readyState = 0;

            await connectDatabase();

            expect(mockMongoose.connect).toHaveBeenCalledWith(customUri);
            
            // Clean up
            delete process.env.MONGODB_URI;
        });

        it('should skip connection if already connected', async () => {
            (mockMongoose.connection as any).readyState = 1; // Already connected

            await connectDatabase();

            expect(mockMongoose.connect).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('MongoDB already connected');
        });

        it('should handle connection errors gracefully', async () => {
            const error = new Error('Connection failed');
            mockMongoose.connect.mockRejectedValue(error);
            (mockMongoose.connection as any).readyState = 0;

            await connectDatabase();

            expect(mockMongoose.connect).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('MongoDB connection failed:', error);
            expect(console.log).toHaveBeenCalledWith('Continuing without MongoDB...');
        });

        it('should not crash on connection failure', async () => {
            mockMongoose.connect.mockRejectedValue(new Error('Network error'));
            (mockMongoose.connection as any).readyState = 0;

            await expect(connectDatabase()).resolves.not.toThrow();
        });
    });
});
