import { DataService } from '../src/services/dataService';
import { DataEntry } from '../src/types/index';
import mongoose from 'mongoose';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    readyState: 1,
    collections: {}
  }
}));

// Mock DataModel functions
const mockSave = jest.fn();
const mockFindOne = jest.fn();
const mockFind = jest.fn();

jest.mock('../src/models/index', () => ({
  DataModel: jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mock-id-123',
    save: mockSave
  }))
}));

// After the mock, we need to get a reference to the mocked constructor
const { DataModel } = require('../src/models/index');
DataModel.findOne = mockFindOne;
DataModel.find = mockFind;

describe('DataService', () => {
  let dataService: DataService;

  beforeEach(() => {
    jest.clearAllMocks();
    dataService = new DataService();
  });

  describe('saveData', () => {
    it('should save new data successfully', async () => {
      const testData: DataEntry = {
        name: 'Test Entry',
        value: 'Test Value'
      };

      // Mock no existing data (new entry)
      mockFindOne.mockResolvedValue(null);
      mockSave.mockResolvedValue({
        _id: 'mock-id-123',
        name: testData.name,
        value: testData.value
      });

      const result = await dataService.saveData(testData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Data saved successfully');
      expect(result.data).toEqual({
        id: 'mock-id-123',
        name: testData.name,
        value: testData.value
      });
    });

    it('should reject duplicate data', async () => {
      const testData: DataEntry = {
        name: 'Duplicate Entry',
        value: 'Test Value'
      };

      // Mock existing data (duplicate)
      mockFindOne.mockResolvedValue({
        _id: 'existing-id',
        name: testData.name,
        value: 'existing value'
      });

      const result = await dataService.saveData(testData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Duplicate data found - item with this name already exists');
      expect(mockSave).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const testData: DataEntry = {
        name: 'Error Test',
        value: 'Test Value'
      };

      // Mock database error
      mockFindOne.mockRejectedValue(new Error('Database connection failed'));

      const result = await dataService.saveData(testData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error saving data:');
      expect(result.message).toContain('Database connection failed');
    });
  });

  describe('getData', () => {
    it('should retrieve all data successfully', async () => {
      const mockData = [
        { _id: 'id1', name: 'Entry 1', value: 'Value 1' },
        { _id: 'id2', name: 'Entry 2', value: 'Value 2' }
      ];

      mockFind.mockResolvedValue(mockData);

      const result = await dataService.getData();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'id1',
        name: 'Entry 1',
        value: 'Value 1'
      });
      expect(result[1]).toEqual({
        id: 'id2',
        name: 'Entry 2',
        value: 'Value 2'
      });
    });

    it('should return empty array when no data exists', async () => {
      mockFind.mockResolvedValue([]);

      const result = await dataService.getData();

      expect(result).toEqual([]);
    });

    it('should handle database errors and return empty array', async () => {
      mockFind.mockRejectedValue(new Error('Database error'));

      const result = await dataService.getData();

      expect(result).toEqual([]);
    });
  });
});
