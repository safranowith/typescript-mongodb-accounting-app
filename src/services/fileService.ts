import fs from 'fs';
import path from 'path';

export class FileService {
    public saveFile(file: Express.Multer.File): string {
        // Since we're using diskStorage, the file is already saved to disk
        // We just return the path where it was saved
        return file.path;
    }

    public async getFile(filename: string): Promise<string | null> {
        const filePath = path.join('uploads', filename);
        
        return new Promise((resolve, reject) => {
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    resolve(null); // File doesn't exist
                } else {
                    resolve(filePath);
                }
            });
        });
    }
}