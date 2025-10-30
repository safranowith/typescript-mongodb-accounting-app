import { FileService } from '../src/services/fileService';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs', () => ({
  access: jest.fn(),
  constants: {
    F_OK: 0
  }
}));

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(() => {
    jest.clearAllMocks();
    fileService = new FileService();
  });

  describe('saveFile', () => {
    it('should return the file path for saved file', () => {
      const mockFile = {
        path: '/uploads/test-file.txt',
        originalname: 'test-file.txt',
        mimetype: 'text/plain',
        size: 1024
      } as Express.Multer.File;

      const result = fileService.saveFile(mockFile);

      expect(result).toBe('/uploads/test-file.txt');
    });

    it('should handle files with different paths', () => {
      const mockFile = {
        path: 'C:\\uploads\\document.pdf',
        originalname: 'document.pdf',
        mimetype: 'application/pdf',
        size: 2048
      } as Express.Multer.File;

      const result = fileService.saveFile(mockFile);

      expect(result).toBe('C:\\uploads\\document.pdf');
    });
  });

  describe('getFile', () => {
    it('should return file path when file exists', async () => {
      const filename = 'existing-file.txt';
      const expectedPath = path.join('uploads', filename);

      // Mock fs.access to simulate file exists (no error)
      (fs.access as unknown as jest.Mock).mockImplementation((path, mode, callback) => {
        callback(null); // No error means file exists
      });

      const result = await fileService.getFile(filename);

      expect(result).toBe(expectedPath);
      expect(fs.access).toHaveBeenCalledWith(
        expectedPath,
        fs.constants.F_OK,
        expect.any(Function)
      );
    });

    it('should return null when file does not exist', async () => {
      const filename = 'non-existing-file.txt';
      const expectedPath = path.join('uploads', filename);

      // Mock fs.access to simulate file does not exist (error)
      (fs.access as unknown as jest.Mock).mockImplementation((path, mode, callback) => {
        callback(new Error('File not found')); // Error means file doesn't exist
      });

      const result = await fileService.getFile(filename);

      expect(result).toBeNull();
      expect(fs.access).toHaveBeenCalledWith(
        expectedPath,
        fs.constants.F_OK,
        expect.any(Function)
      );
    });

    it('should handle different filenames', async () => {
      const filename = 'document.pdf';
      const expectedPath = path.join('uploads', filename);

      (fs.access as unknown as jest.Mock).mockImplementation((path, mode, callback) => {
        callback(null);
      });

      const result = await fileService.getFile(filename);

      expect(result).toBe(expectedPath);
      expect(fs.access).toHaveBeenCalledWith(
        expectedPath,
        fs.constants.F_OK,
        expect.any(Function)
      );
    });

    it('should construct correct path for subdirectories', async () => {
      const filename = 'subfolder/file.txt';
      const expectedPath = path.join('uploads', filename);

      (fs.access as unknown as jest.Mock).mockImplementation((path, mode, callback) => {
        callback(null);
      });

      const result = await fileService.getFile(filename);

      expect(result).toBe(expectedPath);
    });
  });
});
