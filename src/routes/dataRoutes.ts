import { Router } from 'express';
import { DataController } from '../controllers/dataController';
import { DataService } from '../services/dataService';

const router = Router();
const dataService = new DataService();
const dataController = new DataController(dataService);

export function setDataRoutes(app: Router) {
    app.post('/data', dataController.saveData.bind(dataController));
    app.get('/data', dataController.getData.bind(dataController));
}