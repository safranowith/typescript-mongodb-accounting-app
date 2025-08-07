import { Request, Response } from 'express';
import { FileService } from '../services/fileService';
import { DataService } from '../services/dataService';

export default class FileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    public uploadFile = (req: Request, res: Response): void => {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
        const filePath = this.fileService.saveFile(req.file);
        res.status(200).send({ message: 'File uploaded successfully', path: filePath });
    };

    public getFile = (req: Request, res: Response): void => {
        // Logic to retrieve uploaded files can be implemented here
        res.status(200).send('Retrieve uploaded files logic not implemented yet.');
    };
}