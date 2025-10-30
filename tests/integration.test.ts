import request from 'supertest';
import express from 'express';
import { DataController } from '../src/controllers/dataController';
import { DataService } from '../src/services/dataService';
import FileController from '../src/controllers/fileController';

// Mock dependencies
jest.mock('../src/services/dataService');
jest.mock('../src/services/fileService');

describe('Integration Tests', () => {
  let app: express.Application;
  let dataController: DataController;
  let fileController: FileController;

  beforeEach(() => {
    jest.clearAllMocks();
    
    app = express();
    app.use(express.json());
    
    // Create controller instances
    const dataService = new DataService();
    dataController = new DataController(dataService);
    fileController = new FileController();
    
    // Setup routes for testing
    app.post('/api/data', (req, res) => dataController.saveData(req, res));
    app.get('/api/data', (req, res) => dataController.getData(req, res));
    app.post('/api/upload', (req, res) => fileController.uploadFile(req, res));
    app.get('/api/files', (req, res) => fileController.getFile(req, res));
  });

  describe('Data API Integration', () => {
    it('should handle POST /api/data with valid data', async () => {
      // Mock successful save
      (DataService.prototype.saveData as jest.Mock).mockResolvedValue({
        success: true,
        message: 'Data saved successfully',
        data: { id: 'test-id', name: 'Test Entry', value: 'Test Value' }
      });

      const response = await request(app)
        .post('/api/data')
        .send({
          name: 'Test Entry',
          value: 'Test Value'
        })
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Data saved successfully',
        data: { id: 'test-id', name: 'Test Entry', value: 'Test Value' }
      });
    });

    it('should handle POST /api/data with missing fields', async () => {
      const response = await request(app)
        .post('/api/data')
        .send({
          name: 'Test Entry'
          // Missing value field
        })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Name and value are required fields'
      });
    });

    it('should handle GET /api/data successfully', async () => {
      // Mock successful retrieval
      (DataService.prototype.getData as jest.Mock).mockResolvedValue([
        { id: 'id1', name: 'Entry 1', value: 'Value 1' },
        { id: 'id2', name: 'Entry 2', value: 'Value 2' }
      ]);

      const response = await request(app)
        .get('/api/data')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Data retrieved successfully',
        data: [
          { id: 'id1', name: 'Entry 1', value: 'Value 1' },
          { id: 'id2', name: 'Entry 2', value: 'Value 2' }
        ]
      });
    });

    it('should handle duplicate data submission', async () => {
      // Mock duplicate response
      (DataService.prototype.saveData as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Duplicate data found - item with this name already exists'
      });

      const response = await request(app)
        .post('/api/data')
        .send({
          name: 'Duplicate Entry',
          value: 'Test Value'
        })
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        message: 'Duplicate data found - item with this name already exists'
      });
    });
  });

  describe('File API Integration', () => {
    it('should handle file upload endpoint without file', async () => {
      const response = await request(app)
        .post('/api/upload')
        .expect(400);

      expect(response.text).toBe('No file uploaded.');
    });

    it('should handle file retrieval endpoint', async () => {
      const response = await request(app)
        .get('/api/files')
        .expect(200);

      expect(response.text).toBe('Retrieve uploaded files logic not implemented yet.');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle internal server errors gracefully', async () => {
      // Mock service error
      (DataService.prototype.saveData as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      );

      const response = await request(app)
        .post('/api/data')
        .send({
          name: 'Test Entry',
          value: 'Test Value'
        })
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Server error: Database connection failed'
      });
    });

    it('should handle GET data errors gracefully', async () => {
      // Mock service error
      (DataService.prototype.getData as jest.Mock).mockRejectedValue(
        new Error('Network timeout')
      );

      const response = await request(app)
        .get('/api/data')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Server error: Network timeout'
      });
    });
  });
});
