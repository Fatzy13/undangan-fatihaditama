@echo off
title Server Undangan Digital (PHP Built-in Server)
color 0b

echo =========================================================
echo    SERVER UNDANGAN DIGITAL - WIRA ^& NEERA
echo    Teknologi: PHP Native Web Server (Zero Node.js)
echo =========================================================
echo.

:: 1. Cek apakah PHP ada di System PATH
where php >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "PHP_CMD=php"
    goto START_SERVER
)

:: 2. Cek apakah PHP ada di direktori Laragon H:
for /d %%D in ("H:\laragon\bin\php\php-*") do (
    if exist "%%D\php.exe" (
        set "PHP_CMD=%%D\php.exe"
        goto START_SERVER
    )
)

:: 3. Cek apakah PHP ada di direktori Laragon C:
for /d %%D in ("C:\laragon\bin\php\php-*") do (
    if exist "%%D\php.exe" (
        set "PHP_CMD=%%D\php.exe"
        goto START_SERVER
    )
)

:: 4. Cek XAMPP sebagai cadangan
if exist "C:\xampp\php\php.exe" (
    set "PHP_CMD=C:\xampp\php\php.exe"
    goto START_SERVER
)

echo [ERROR] Program PHP tidak ditemukan di sistem Anda!
echo Silakan pastikan Laragon / XAMPP sudah terpasang.
echo.
pause
exit /b 1

:START_SERVER
echo [OK] Menggunakan PHP: %PHP_CMD%
echo [INFO] Menjalankan server di http://localhost:3000
echo.
echo Tekan CTRL + C untuk menghentikan server.
echo =========================================================
echo.

:: Jalankan server bawaan PHP
"%PHP_CMD%" -S localhost:3000
