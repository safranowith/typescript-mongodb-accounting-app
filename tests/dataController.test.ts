import { Request, Response } from 'express';
import { DataController } from '../src/controllers/dataController';
import { DataService } from '../src/services/dataService';
import { DataEntry } from '../src/types/index';

// Mock DataService
const mockDataService = {
  saveData: jest.fn(),
  getData: jest.fn()
};

describe('DataController', () => {
  let dataController: DataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    dataController = new DataController(mockDataService as unknown as DataService);
    
    mockRequest = {
      body: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('saveData', () => {
    it('should save data successfully', async () => {
      const testData: DataEntry = {
        name: 'Test Entry',
        value: 'Test Value'
      };

      mockRequest.body = testData;
      mockDataService.saveData.mockResolvedValue({
        success: true,
        message: 'Data saved successfully',
        data: { id: 'test-id', ...testData }
      });

      await dataController.saveData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.saveData).toHaveBeenCalledWith(testData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data saved successfully',
        data: { id: 'test-id', ...testData }
      });
    });

    it('should return 400 for missing name field', async () => {
      mockRequest.body = { value: 'Test Value' }; // Missing name

      await dataController.saveData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.saveData).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name and value are required fields'
      });
    });

    it('should return 400 for missing value field', async () => {
      mockRequest.body = { name: 'Test Name' }; // Missing value

      await dataController.saveData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.saveData).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Name and value are required fields'
      });
    });

    it('should return 409 for duplicate data', async () => {
      const testData: DataEntry = {
        name: 'Duplicate Entry',
        value: 'Test Value'
      };

      mockRequest.body = testData;
      mockDataService.saveData.mockResolvedValue({
        success: false,
        message: 'Duplicate data found - item with this name already exists'
      });

      await dataController.saveData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.saveData).toHaveBeenCalledWith(testData);
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Duplicate data found - item with this name already exists'
      });
    });

    it('should handle service errors', async () => {
      const testData: DataEntry = {
        name: 'Error Test',
        value: 'Test Value'
      };

      mockRequest.body = testData;
      mockDataService.saveData.mockRejectedValue(new Error('Service error'));

      await dataController.saveData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.saveData).toHaveBeenCalledWith(testData);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error: Service error'
      });
    });
  });

  describe('getData', () => {
    it('should retrieve data successfully', async () => {
      const mockData = [
        { id: 'id1', name: 'Entry 1', value: 'Value 1' },
        { id: 'id2', name: 'Entry 2', value: 'Value 2' }
      ];

      mockDataService.getData.mockResolvedValue(mockData);

      await dataController.getData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.getData).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data retrieved successfully',
        data: mockData
      });
    });

    it('should handle service errors when retrieving data', async () => {
      mockDataService.getData.mockRejectedValue(new Error('Database connection failed'));

      await dataController.getData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.getData).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error: Database connection failed'
      });
    });

    it('should return empty data array successfully', async () => {
      mockDataService.getData.mockResolvedValue([]);

      await dataController.getData(mockRequest as Request, mockResponse as Response);

      expect(mockDataService.getData).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Data retrieved successfully',
        data: []
      });
    });
  });
});
