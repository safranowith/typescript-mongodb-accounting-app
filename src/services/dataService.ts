import mongoose from 'mongoose';
import { DataModel } from '../models/index';
import { DataEntry, DatabaseResponse } from '../types/index';

export class DataService {
    private static isConnected = false;

    constructor() {
        if (!DataService.isConnected) {
            this.connect();
        }
    }

    private async connect(): Promise<void> {
        try {
            if (mongoose.connection.readyState === 0) {
                await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting-app');
                DataService.isConnected = true;
                console.log('Connected to MongoDB');
            }
        } catch (error) {
            console.error('MongoDB connection error:', error);
            console.log('Running without MongoDB - data will not be persisted');
        }
    }

    public async saveData(data: DataEntry): Promise<DatabaseResponse> {
        try {
            // Check for duplicates based on name field
            const existingData = await DataModel.findOne({ name: data.name });
            
            if (!existingData) {
                const newData = new DataModel(data);
                const savedData = await newData.save();
                return { 
                    success: true, 
                    message: 'Data saved successfully',
                    data: {
                        id: savedData._id.toString(),
                        name: savedData.name,
                        value: savedData.value
                    }
                };
            } else {
                return { 
                    success: false, 
                    message: 'Duplicate data found - item with this name already exists' 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: `Error saving data: ${(error as Error).message}` 
            };
        }
    }

    public async getData(): Promise<DataEntry[]> {
        try {
            const data = await DataModel.find();
            return data.map((item: any) => ({
                id: item._id.toString(),
                name: item.name,
                value: item.value
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
}