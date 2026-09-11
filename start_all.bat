@echo off
echo ============================================================
echo   GeM AI-Powered Bid Compliance Verification Platform
echo   Frontend Demo MVP (Vercel-Ready)
echo ============================================================
echo.
echo Launching frontend server on http://localhost:5173 ...
echo.
echo Demo Accounts:
echo   1. Officer:      officer@gem-demo.gov.in / officer123
echo   2. ABC Tech:     abc@bidder.com / bidder123 (97.5%% Low Risk)
echo   3. XYZ Ind:      xyz@bidder.com / bidder123
echo   4. QuickSupply:  quick@bidder.com / bidder123 (High Risk)
echo.
echo ============================================================
cd /d "%~dp0frontend"
npm run dev
