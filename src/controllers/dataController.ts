import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { DataEntry } from '../types/index';

export class DataController {
    constructor(private dataService: DataService) {}

    async saveData(req: Request, res: Response): Promise<void> {
        try {
            const data: DataEntry = req.body;
            
            // Validate required fields
            if (!data.name || !data.value) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Name and value are required fields' 
                });
                return;
            }

            const result = await this.dataService.saveData(data);
            
            if (result.success) {
                res.status(201).json(result);
            } else {
                res.status(409).json(result); // 409 Conflict for duplicates
            }
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: `Server error: ${(error as Error).message}` 
            });
        }
    }

    async getData(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.dataService.getData();
            res.status(200).json({
                success: true,
                message: 'Data retrieved successfully',
                data: data
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: `Server error: ${(error as Error).message}` 
            });
        }
    }
}