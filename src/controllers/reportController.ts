import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { DataService } from '../services/dataService';

export class ReportController {
    private reportService: ReportService;
    private dataService: DataService;

    constructor() {
        this.reportService = new ReportService();
        this.dataService = new DataService();
    }

    public generateReport = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.dataService.getData();
            const report = this.reportService.generateReport(data);
            res.status(200).json({ report });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate report' });
        }
    };

    public getSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this.dataService.getData();
            const summary = this.reportService.generateSummary(data);
            res.status(200).json(summary);
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate summary' });
        }
    };
}