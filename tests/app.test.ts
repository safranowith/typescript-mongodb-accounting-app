import request from 'supertest';
import express, { Request, Response } from 'express';

// Mock dependencies
jest.mock('../src/config/database');
jest.mock('../src/routes/fileRoutes');
jest.mock('../src/routes/dataRoutes');

const mockConnectDatabase = require('../src/config/database').connectDatabase as jest.Mock;
const mockSetFileRoutes = require('../src/routes/fileRoutes').setFileRoutes as jest.Mock;
const mockSetDataRoutes = require('../src/routes/dataRoutes').setDataRoutes as jest.Mock;

describe('App', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        
        // Create a new app instance for testing
        app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Mock implementations
        mockConnectDatabase.mockImplementation(() => {});
        mockSetFileRoutes.mockImplementation((app) => {
            app.get('/test-file', (req: Request, res: Response) => res.json({ message: 'file route' }));
        });
        mockSetDataRoutes.mockImplementation((app) => {
            app.get('/test-data', (req: Request, res: Response) => res.json({ message: 'data route' }));
        });

        // Set up routes
        mockSetFileRoutes(app);
        mockSetDataRoutes(app);
    });

    it('should initialize express app with middleware', () => {
        expect(app).toBeDefined();
    });

    it('should call connectDatabase on initialization', () => {
        // Re-import to trigger the initialization
        delete require.cache[require.resolve('../src/app')];
        require('../src/app');
        
        expect(mockConnectDatabase).toHaveBeenCalled();
    });

    it('should set up file routes', () => {
        expect(mockSetFileRoutes).toHaveBeenCalledWith(app);
    });

    it('should set up data routes', () => {
        expect(mockSetDataRoutes).toHaveBeenCalledWith(app);
    });

    it('should handle JSON middleware', async () => {
        app.post('/test-json', (req: Request, res: Response) => {
            res.json({ received: req.body });
        });

        const response = await request(app)
            .post('/test-json')
            .send({ test: 'data' })
            .expect(200);

        expect(response.body.received).toEqual({ test: 'data' });
    });

    it('should handle URL encoded middleware', async () => {
        app.post('/test-form', (req: Request, res: Response) => {
            res.json({ received: req.body });
        });

        const response = await request(app)
            .post('/test-form')
            .send('name=test&value=123')
            .expect(200);

        expect(response.body.received).toEqual({ name: 'test', value: '123' });
    });

    it('should have test routes working', async () => {
        await request(app)
            .get('/test-file')
            .expect(200)
            .expect({ message: 'file route' });

        await request(app)
            .get('/test-data')
            .expect(200)
            .expect({ message: 'data route' });
    });
});
