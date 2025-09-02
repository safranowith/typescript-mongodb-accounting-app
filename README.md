# TypeScript MongoDB Accounting App

אפליקציית הנהלת חשבונות מבוססת TypeScript ו-MongoDB שמאפשרת ניהול נתונים כלכליים והעלאת קבצים.

## תכונות

- **ניהול נתונים**: שמירה ושליפה של נתוני הנהלת חשבונות
- **העלאת קבצים**: העלאה ושמירה של קבצים בטוחה
- **מניעת כפילויות**: בדיקת כפילויות בשמירת נתונים
- **API RESTful**: ממשק API מלא ומאובטח
- **בדיקות מקיפות**: מערכת בדיקות אוטומטית עם Jest
- **TypeScript**: קוד בטוח ומהימן עם טיפוסים חזקים

## מבנה הפרויקט

```
typescript-mongodb-app/
├── src/
│   ├── app.ts                 # נקודת כניסה ראשית
│   ├── config/
│   │   └── database.ts        # הגדרות חיבור לבסיס נתונים
│   ├── controllers/
│   │   ├── dataController.ts  # בקר לניהול נתונים
│   │   └── fileController.ts  # בקר להעלאת קבצים
│   ├── middleware/
│   │   └── upload.ts          # Middleware להעלאת קבצים
│   ├── models/
│   │   └── index.ts           # מודלי MongoDB
│   ├── routes/
│   │   ├── dataRoutes.ts      # נתיבי API לנתונים
│   │   └── fileRoutes.ts      # נתיבי API לקבצים
│   ├── services/
│   │   ├── dataService.ts     # שירותי נתונים
│   │   └── fileService.ts     # שירותי קבצים
│   └── types/
│       ├── index.ts           # הגדרות טיפוסים כלליות
│       └── reports.ts         # טיפוסים לדוחות
├── tests/                     # בדיקות אוטומטיות
├── uploads/                   # תיקיית קבצים שהועלו
├── nodejs-portable/           # Node.js נייד
└── package.json
```

## התקנה והפעלה

### דרישות מקדימות
- Node.js 20.5.0+ (כלול בפרויקט)
- MongoDB (מקומי או מרוחק)

### הפעלת האפליקציה

1. **התקנת dependencies**:
   ```bash
   npm install
   ```

2. **בנייה**:
   ```bash
   npm run build
   ```

3. **הפעלה בסביבת פיתוח**:
   ```bash
   npm run dev
   ```

4. **הפעלה בסביבת ייצור**:
   ```bash
   npm start
   ```

## בדיקות

הפרויקט כולל מערכת בדיקות מקיפה עם Jest:

```bash
# הרצת כל הבדיקות
npm test

# הרצת בדיקות במצב Watch
npm run test:watch

# דוח כיסוי בדיקות
npm run test:coverage

# בדיקות עם פרטים מלאים
npm run test:verbose
```

### סוגי בדיקות:
- **Unit Tests**: בדיקות יחידה לכל component
- **Integration Tests**: בדיקות אינטגרציה לAPI
- **Mocking**: Mocks למודולים חיצוניים
- **Coverage**: דוח כיסוי מלא

## API Endpoints

### נתונים (Data)
- `POST /api/data` - שמירת נתונים חדשים
- `GET /api/data` - שליפת כל הנתונים

### קבצים (Files)
- `POST /api/files/upload` - העלאת קובץ
- `GET /api/files` - שליפת רשימת קבצים

## טכנולוגיות

### Backend
- **Node.js** 20.5.0 - סביבת ריצה
- **TypeScript** 5.1.6 - שפת פיתוח
- **Express.js** 4.18.2 - מסגרת web
- **MongoDB** - בסיס נתונים
- **Mongoose** 7.5.0 - ODM למונגו

### קבצים
- **Multer** 1.4.5 - העלאת קבצים

### בדיקות
- **Jest** 30.0.5 - מסגרת בדיקות
- **Supertest** 7.1.4 - בדיקות HTTP
- **ts-jest** 29.4.1 - Jest עם TypeScript

## אבטחה

- **Validation**: בדיקת נתונים בכניסה
- **Error Handling**: טיפול בשגיאות מקיף
- **Type Safety**: TypeScript למניעת שגיאות
- **Duplicate Prevention**: מניעת כפילויות בנתונים

## דוגמאות שימוש

### שמירת נתונים
```javascript
const response = await fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'הכנסה מחודש ינואר',
    value: 15000
  })
});
```

### העלאת קובץ
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
});
```

## משתנים סביבתיים

יצירת קובץ `.env`:
```
MONGODB_URI=mongodb://localhost:27017/accounting-app
PORT=3000
```

## פיתוח

### הוספת תכונות חדשות
1. יצירת Service ב-`src/services/`
2. יצירת Controller ב-`src/controllers/`
3. יצירת Routes ב-`src/routes/`
4. הוספת בדיקות ב-`tests/`

### הרצת בדיקות בפיתוח
```bash
npm run test:watch
```

## מדדי איכות

- **Code Coverage**: 43.69% (Controllers: 100%)
- **Type Safety**: 100% TypeScript
- **Error Handling**: טיפול מקיף בשגיאות
- **Testing**: 33 בדיקות עוברות ✅ (100% success rate)

### תוצאות בדיקות:
```
Test Suites: 5 passed, 5 total
Tests: 33 passed, 33 total
Controllers: 100% Coverage
Services: 67.56% Coverage
```

## גרסאות

- **v1.0.0**: גרסה ראשונית עם ניהול נתונים והעלאת קבצים
- תכונות עתידיות: דוחות, גרפים, ייצוא נתונים

## רישיון

MIT License - ראה קובץ LICENSE לפרטים.

## תרומה

1. Fork הפרויקט
2. יצירת feature branch
3. הוספת בדיקות לתכונות חדשות  
4. שליחת Pull Request

---

**פותח בישראל**
