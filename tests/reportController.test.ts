import { Request, Response } from 'express';
import { ReportController } from '../src/controllers/reportController';
import { ReportService } from '../src/services/reportService';
import { DataService } from '../src/services/dataService';

// Mock services
jest.mock('../src/services/reportService');
jest.mock('../src/services/dataService');

const mockReportService = ReportService as jest.MockedClass<typeof ReportService>;
const mockDataService = DataService as jest.MockedClass<typeof DataService>;

describe('ReportController', () => {
    let reportController: ReportController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        
        mockResponse = {
            status: mockStatus,
            json: mockJson
        };
        
        mockRequest = {};

        // Clear all mocks
        jest.clearAllMocks();
        
        reportController = new ReportController();
    });

    describe('generateReport', () => {
        it('should generate report successfully', async () => {
            const mockData = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 200 }
            ];
            const mockReport = 'Total entries: 2, Total value: 300, Average: 150';

            const mockDataServiceInstance = {
                getData: jest.fn().mockResolvedValue(mockData)
            };
            const mockReportServiceInstance = {
                generateReport: jest.fn().mockReturnValue(mockReport),
                generateSummary: jest.fn(),
                filterByValue: jest.fn()
            };

            mockDataService.mockImplementation(() => mockDataServiceInstance as any);
            mockReportService.mockImplementation(() => mockReportServiceInstance as any);

            reportController = new ReportController();

            await reportController.generateReport(mockRequest as Request, mockResponse as Response);

            expect(mockDataServiceInstance.getData).toHaveBeenCalled();
            expect(mockReportServiceInstance.generateReport).toHaveBeenCalledWith(mockData);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ report: mockReport });
        });

        it('should handle errors when generating report', async () => {
            const mockDataServiceInstance = {
                getData: jest.fn().mockRejectedValue(new Error('Database error'))
            };
            const mockReportServiceInstance = {
                generateReport: jest.fn(),
                generateSummary: jest.fn(),
                filterByValue: jest.fn()
            };

            mockDataService.mockImplementation(() => mockDataServiceInstance as any);
            mockReportService.mockImplementation(() => mockReportServiceInstance as any);

            reportController = new ReportController();

            await reportController.generateReport(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to generate report' });
        });
    });

    describe('getSummary', () => {
        it('should get summary successfully', async () => {
            const mockData = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 200 }
            ];
            const mockSummary = { total: 300, count: 2, average: 150 };

            const mockDataServiceInstance = {
                getData: jest.fn().mockResolvedValue(mockData)
            };
            const mockReportServiceInstance = {
                generateReport: jest.fn(),
                generateSummary: jest.fn().mockReturnValue(mockSummary),
                filterByValue: jest.fn()
            };

            mockDataService.mockImplementation(() => mockDataServiceInstance as any);
            mockReportService.mockImplementation(() => mockReportServiceInstance as any);

            reportController = new ReportController();

            await reportController.getSummary(mockRequest as Request, mockResponse as Response);

            expect(mockDataServiceInstance.getData).toHaveBeenCalled();
            expect(mockReportServiceInstance.generateSummary).toHaveBeenCalledWith(mockData);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockSummary);
        });

        it('should handle errors when getting summary', async () => {
            const mockDataServiceInstance = {
                getData: jest.fn().mockRejectedValue(new Error('Database error'))
            };
            const mockReportServiceInstance = {
                generateReport: jest.fn(),
                generateSummary: jest.fn(),
                filterByValue: jest.fn()
            };

            mockDataService.mockImplementation(() => mockDataServiceInstance as any);
            mockReportService.mockImplementation(() => mockReportServiceInstance as any);

            reportController = new ReportController();

            await reportController.getSummary(mockRequest as Request, mockResponse as Response);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Failed to generate summary' });
        });
    });
});
