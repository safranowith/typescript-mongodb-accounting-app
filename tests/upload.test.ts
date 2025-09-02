import multer from 'multer';
import path from 'path';
import upload from '../src/middleware/upload';

// Mock multer
jest.mock('multer');

const mockMulter = multer as jest.MockedFunction<typeof multer>;

describe('Upload Middleware', () => {
    let mockDiskStorage: jest.Mock;
    let mockMulterInstance: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockDiskStorage = jest.fn();
        mockMulterInstance = {
            single: jest.fn(),
            array: jest.fn(),
            fields: jest.fn()
        };

        (multer as any).diskStorage = mockDiskStorage;
        mockMulter.mockReturnValue(mockMulterInstance);
    });

    it('should create multer instance with correct configuration', () => {
        expect(mockMulter).toHaveBeenCalledWith({
            storage: expect.anything(),
            fileFilter: expect.any(Function)
        });
    });

    it('should configure disk storage correctly', () => {
        expect(mockDiskStorage).toHaveBeenCalledWith({
            destination: expect.any(Function),
            filename: expect.any(Function)
        });
    });

    describe('storage configuration', () => {
        let destinationCallback: Function;
        let filenameCallback: Function;

        beforeEach(() => {
            const storageConfig = mockDiskStorage.mock.calls[0][0];
            destinationCallback = storageConfig.destination;
            filenameCallback = storageConfig.filename;
        });

        it('should set destination to uploads folder', () => {
            const mockCb = jest.fn();
            destinationCallback({}, {}, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, 'uploads/');
        });

        it('should generate unique filename with extension', () => {
            const mockFile = {
                originalname: 'test.jpg'
            };
            const mockCb = jest.fn();
            
            // Mock Date.now and Math.random for predictable results
            jest.spyOn(Date, 'now').mockReturnValue(1234567890);
            jest.spyOn(Math, 'random').mockReturnValue(0.5);
            
            filenameCallback({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, '1234567890-500000000.jpg');
            
            // Restore mocks
            (Date.now as jest.Mock).mockRestore();
            (Math.random as jest.Mock).mockRestore();
        });

        it('should preserve file extension', () => {
            const mockFile = {
                originalname: 'document.pdf'
            };
            const mockCb = jest.fn();
            
            jest.spyOn(Date, 'now').mockReturnValue(1111111111);
            jest.spyOn(Math, 'random').mockReturnValue(0.123);
            
            filenameCallback({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, '1111111111-123000000.pdf');
            
            (Date.now as jest.Mock).mockRestore();
            (Math.random as jest.Mock).mockRestore();
        });
    });

    describe('file filter', () => {
        let fileFilter: any;

        beforeEach(() => {
            const multerConfig = mockMulter.mock.calls[0]?.[0];
            fileFilter = multerConfig?.fileFilter;
        });

        it('should accept valid image files', () => {
            const mockFile = {
                mimetype: 'image/jpeg',
                originalname: 'test.jpg'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, true);
        });

        it('should accept PNG files', () => {
            const mockFile = {
                mimetype: 'image/png',
                originalname: 'test.png'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, true);
        });

        it('should accept PDF files', () => {
            const mockFile = {
                mimetype: 'application/pdf',
                originalname: 'document.pdf'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(null, true);
        });

        it('should reject unsupported file types', () => {
            const mockFile = {
                mimetype: 'application/msword',
                originalname: 'document.doc'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should reject files with wrong mimetype but correct extension', () => {
            const mockFile = {
                mimetype: 'text/plain',
                originalname: 'fake.jpg'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should reject files with correct mimetype but wrong extension', () => {
            const mockFile = {
                mimetype: 'image/jpeg',
                originalname: 'image.txt'
            };
            const mockCb = jest.fn();
            
            fileFilter({}, mockFile, mockCb);
            
            expect(mockCb).toHaveBeenCalledWith(expect.any(Error));
        });
    });

    it('should export the upload middleware', () => {
        expect(upload).toBe(mockMulterInstance);
    });
});
