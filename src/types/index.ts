export interface FileUpload {
    filename: string;
    path: string;
}

export interface DataEntry {
    id?: string;
    name: string;
    value: any;
}

export interface DatabaseResponse {
    success: boolean;
    message: string;
    data?: DataEntry | DataEntry[];
}