import { DataEntry } from '../types/index';

interface MonthlyReport {
    [key: string]: {
        total: number;
        count: number;
    };
}

export class ReportService {
    public generateSummary(data: DataEntry[]): any {
        if (!data || data.length === 0) {
            return { total: 0, count: 0, average: 0 };
        }

        const total = data.reduce((sum, entry) => {
            const value = typeof entry.value === 'number' ? entry.value : 0;
            return sum + value;
        }, 0);
        const count = data.length;
        const average = total / count;

        return {
            total,
            count,
            average: Math.round(average * 100) / 100
        };
    }

    public generateReport(data: DataEntry[]): string {
        const summary = this.generateSummary(data);
        return `Total entries: ${summary.count}, Total value: ${summary.total}, Average: ${summary.average}`;
    }

    public filterByValue(data: DataEntry[], minValue: number): DataEntry[] {
        return data.filter(entry => {
            const value = typeof entry.value === 'number' ? entry.value : 0;
            return value >= minValue;
        });
    }
}