import { Router } from 'express';
import { ReportController } from '../controllers/reportController';

const router = Router();
const reportController = new ReportController();

export function setReportRoutes(app: Router) {
    app.get('/reports/generate', reportController.generateReport.bind(reportController));
    app.get('/reports/summary', reportController.getSummary.bind(reportController));
}
