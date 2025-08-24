import { Request, Response } from 'express';
import FileController from '../src/controllers/fileController';
import { FileService } from '../src/services/fileService';

// Mock FileService
const mockFileService = {
  saveFile: jest.fn(),
  getFile: jest.fn()
};

// Mock FileService constructor
jest.mock('../src/services/fileService', () => ({
  FileService: jest.fn().mockImplementation(() => mockFileService)
}));

describe('FileController', () => {
  let fileController: FileController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    fileController = new FileController();
    
    mockRequest = {};
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
  });

  describe('uploadFile', () => {
    it('should upload file successfully', () => {
      const mockFile = {
        filename: 'test-file.txt',
        path: '/uploads/test-file.txt',
        originalname: 'test-file.txt',
        mimetype: 'text/plain',
        size: 1024
      } as Express.Multer.File;

      mockRequest.file = mockFile;
      mockFileService.saveFile.mockReturnValue('/uploads/test-file.txt');

      fileController.uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockFileService.saveFile).toHaveBeenCalledWith(mockFile);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'File uploaded successfully',
        path: '/uploads/test-file.txt'
      });
    });

    it('should return 400 when no file is uploaded', () => {
      mockRequest.file = undefined;

      fileController.uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockFileService.saveFile).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.send).toHaveBeenCalledWith('No file uploaded.');
    });

    it('should handle different file types', () => {
      const mockPdfFile = {
        filename: 'document.pdf',
        path: '/uploads/document.pdf',
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 2048
      } as Express.Multer.File;

      mockRequest.file = mockPdfFile;
      mockFileService.saveFile.mockReturnValue('/uploads/document.pdf');

      fileController.uploadFile(mockRequest as Request, mockResponse as Response);

      expect(mockFileService.saveFile).toHaveBeenCalledWith(mockPdfFile);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'File uploaded successfully',
        path: '/uploads/document.pdf'
      });
    });
  });

  describe('getFile', () => {
    it('should indicate that file retrieval is not implemented', () => {
      fileController.getFile(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        'Retrieve uploaded files logic not implemented yet.'
      );
    });

    it('should not interact with FileService for getFile method', () => {
      fileController.getFile(mockRequest as Request, mockResponse as Response);

      expect(mockFileService.getFile).not.toHaveBeenCalled();
    });
  });
});
