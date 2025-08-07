import { Router } from 'express';
import FileController from '../controllers/fileController';

const router = Router();
const fileController = new FileController();

export function setFileRoutes(app: Router) {
    app.post('/upload', fileController.uploadFile.bind(fileController));
    app.get('/files/:filename', fileController.getFile.bind(fileController));
}