@echo off
echo Installing npm dependencies...
npm install

echo.
echo Building the project...
npm run build

echo.
echo Starting the development server...
npm run dev
