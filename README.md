# TypeScript MongoDB Accounting App

A TypeScript and MongoDB-based accounting application that enables financial data management and file uploads.

## Features

- **Data Management**: Store and retrieve accounting data
- **File Upload**: Secure file upload and storage
- **Reports System**: Generate and manage financial reports
- **Duplicate Prevention**: Duplicate checking when saving data
- **RESTful API**: Complete and secure API interface
- **Comprehensive Testing**: Automated testing system with Jest
- **TypeScript**: Safe and reliable code with strong typing

## Project Structure

```
typescript-mongodb-app/
├── src/
│   ├── app.ts                 # Main entry point
│   ├── config/
│   │   └── database.ts        # Database connection configuration
│   ├── controllers/
│   │   ├── dataController.ts    # Data management controller
│   │   ├── fileController.ts    # File upload controller
│   │   └── reportController.ts  # Report management controller
│   ├── middleware/
│   │   └── upload.ts            # File upload middleware
│   ├── models/
│   │   └── index.ts             # MongoDB models
│   ├── routes/
│   │   ├── dataRoutes.ts        # Data API routes
│   │   ├── fileRoutes.ts        # File API routes
│   │   └── reportRoutes.ts      # Report API routes
│   ├── services/
│   │   ├── dataService.ts       # Data services
│   │   ├── fileService.ts       # File services
│   │   └── reportService.ts     # Report services
│   └── types/
│       └── index.ts           # General type definitions
├── tests/                     # Automated tests
├── uploads/                   # Uploaded files directory
├── nodejs-portable/           # Portable Node.js
└── package.json
```

## Installation and Setup

### Prerequisites
- Node.js 20.5.0+ (included in project)
- MongoDB (local or remote)

### Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Run in production mode**:
   ```bash
   npm start
   ```

## Testing

The project includes a comprehensive testing system with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

### Test Types:
- **Unit Tests**: Individual component testing
- **Integration Tests**: API integration testing
- **Mocking**: External module mocking
- **Coverage**: Complete coverage reporting

## API Endpoints

### Data
- `POST /api/data` - Save new data
- `GET /api/data` - Retrieve all data

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Retrieve file list

### Reports
- `GET /reports/generate` - Generate a report from current data
- `GET /reports/summary` - Get summary statistics of data

## Technologies

### Backend
- **Node.js** 20.5.0 - Runtime environment
- **TypeScript** 5.1.6 - Development language
- **Express.js** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 7.5.0 - MongoDB ODM

### Files
- **Multer** 1.4.5 - File upload handling

### Testing
- **Jest** 30.0.5 - Testing framework
- **Supertest** 7.1.4 - HTTP testing
- **ts-jest** 29.4.1 - Jest with TypeScript

## Security

- **Validation**: Input data validation
- **Error Handling**: Comprehensive error handling
- **Type Safety**: TypeScript for error prevention
- **Duplicate Prevention**: Data duplication prevention

## Usage Examples

### Saving Data
```javascript
const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'January Income',
    value: 15000
  })
});
```

### File Upload
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
});
```

### Generate Report
```javascript
// Get summary statistics
const summaryResponse = await fetch('/reports/summary');
const summary = await summaryResponse.json();

// Generate full report
const reportResponse = await fetch('/reports/generate');
const report = await reportResponse.json();
```

## Environment Variables

Create a `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/accounting-app
PORT=3000
```

## Development

### Adding New Features
1. Create Service in `src/services/`
2. Create Controller in `src/controllers/`
3. Create Routes in `src/routes/`
4. Add tests in `tests/`

### Running Tests in Development
```bash
npm run test:watch
```

## Quality Metrics

- **Code Coverage**: Comprehensive test coverage
- **Type Safety**: 100% TypeScript
- **Error Handling**: Comprehensive error handling
- **Testing**: Complete test suite with multiple test files

### Test Files:
```
Test Suites: 11 test files
├── app.test.ts                 # Application tests
├── database.test.ts            # Database connection tests
├── dataController.test.ts      # Data controller tests
├── dataService.test.ts         # Data service tests
├── fileController.test.ts      # File controller tests
├── fileService.test.ts         # File service tests
├── reportController.test.ts    # Report controller tests
├── reportService.test.ts       # Report service tests
├── integration.test.ts         # Integration tests
├── upload.test.ts              # Upload middleware tests
└── setup.ts                    # Test setup configuration
```

## Versions

- **v1.0.0**: Initial version with data management and file upload
- Future features: Reports, charts, data export

## License

MIT License - see LICENSE file for details.

## Contributing

1. Clone the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a Pull Request

---

**Developed in Israel**
