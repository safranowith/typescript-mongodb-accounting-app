import { ReportService } from '../src/services/reportService';
import { DataEntry } from '../src/types/index';

describe('ReportService', () => {
    let reportService: ReportService;

    beforeEach(() => {
        reportService = new ReportService();
    });

    describe('generateSummary', () => {
        it('should generate summary for valid data', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 200 },
                { name: 'Test3', value: 300 }
            ];

            const result = reportService.generateSummary(data);

            expect(result).toEqual({
                total: 600,
                count: 3,
                average: 200
            });
        });

        it('should handle empty data array', () => {
            const data: DataEntry[] = [];

            const result = reportService.generateSummary(data);

            expect(result).toEqual({
                total: 0,
                count: 0,
                average: 0
            });
        });

        it('should handle null data', () => {
            const result = reportService.generateSummary(null as any);

            expect(result).toEqual({
                total: 0,
                count: 0,
                average: 0
            });
        });

        it('should handle non-numeric values', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 'invalid' },
                { name: 'Test3', value: 200 }
            ];

            const result = reportService.generateSummary(data);

            expect(result).toEqual({
                total: 300,
                count: 3,
                average: 100
            });
        });

        it('should round average to 2 decimal places', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 200 },
                { name: 'Test3', value: 250 }
            ];

            const result = reportService.generateSummary(data);

            expect(result.average).toBe(183.33);
        });
    });

    describe('generateReport', () => {
        it('should generate text report', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 200 }
            ];

            const result = reportService.generateReport(data);

            expect(result).toBe('Total entries: 2, Total value: 300, Average: 150');
        });

        it('should generate report for empty data', () => {
            const data: DataEntry[] = [];

            const result = reportService.generateReport(data);

            expect(result).toBe('Total entries: 0, Total value: 0, Average: 0');
        });
    });

    describe('filterByValue', () => {
        it('should filter data by minimum value', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 50 },
                { name: 'Test2', value: 150 },
                { name: 'Test3', value: 250 }
            ];

            const result = reportService.filterByValue(data, 100);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Test2');
            expect(result[1].name).toBe('Test3');
        });

        it('should handle non-numeric values in filter', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 100 },
                { name: 'Test2', value: 'invalid' },
                { name: 'Test3', value: 200 }
            ];

            const result = reportService.filterByValue(data, 50);

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Test1');
            expect(result[1].name).toBe('Test3');
        });

        it('should return empty array when no values meet criteria', () => {
            const data: DataEntry[] = [
                { name: 'Test1', value: 10 },
                { name: 'Test2', value: 20 }
            ];

            const result = reportService.filterByValue(data, 100);

            expect(result).toHaveLength(0);
        });
    });
});
