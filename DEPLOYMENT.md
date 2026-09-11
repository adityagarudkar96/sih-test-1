# Vercel Deployment Guide — GeM AI Compliance Platform

This repository is configured as a **pure frontend demonstration MVP** ready for **instant 1-click deployment on Vercel**.

- **No backend server or database setup required.**
- **Zero API Keys required** — no Gemini, OpenAI, or external API keys needed. Works 100% out of the box.
- All AI verification flows, bidder document extractions, compliance evaluations, and officer decisions run in a realistic simulation layer with `localStorage` persistence.
- Includes a **Quick Profile Switcher** on top so judges can switch between Officer and Bidders with 1 click.
- Features a **Reset Demo Data** button to return the platform to its factory state at any time.

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Commit and Push to GitHub

In your project directory terminal (PowerShell or Git Bash):

```bash
git add .
git commit -m "Prepare pure frontend MVP for Vercel deployment"
git push origin main
```

*(If you haven't created a GitHub repository yet, create one on [github.com/new](https://github.com/new), run `git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git`, and push).*

---

### Step 2: Deploy on Vercel

1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** → **"Project"**.
3. Under **Import Git Repository**, select your repository and click **Import**.
4. Configure Project:
   - **Framework Preset**: `Vite` *(auto-detected)*
   - **Build Command**: `npm run build --prefix frontend` *(already defined in `vercel.json`)*
   - **Output Directory**: `frontend/dist` *(already defined in `vercel.json`)*
5. Click **"Deploy"**.

Your application will build in ~20-30 seconds and provide a production HTTPS link, for example:
`https://gem-compliance-platform.vercel.app`

---

## 💻 Running Locally

### Option A: Standard Dev Server
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)**.

### Option B: From Repository Root
```bash
npm run dev
```

---

## 🎯 Demo Walkthrough for Evaluators & Judges

1. **Sign In**:
   - Click any demo credential button on the login screen (`Officer`, `XYZ Industries`, `ABC Tech`, `QuickSupply`).
   - Or use the top banner **Quick Switcher** (`👤 Officer`, `💻 ABC Tech`, `🏭 XYZ Ind`, `⚠️ QuickSupply`) to switch roles at any moment.

2. **Officer Dashboard Flow**:
   - View high-level statutory compliance statistics (Compliant, Review Required, High Risk).
   - Click into tender **GEM-2026-001 (Supply of Medical Diagnostic Equipment)**.
   - Click **"📄 View Tender Notice"** to view the full tender specification modal.
   - Click **"Run AI Verification"** or click on any bidder to inspect the **Hero Requirement Mapping Flow**.
   - Review statutory evidence: GSTIN Active status, PAN match, Udyam MSME classification, ITR filing, Class-I Local Content percentage, and Central Debarment check.
   - Click **"Make Decision"** to record an official decision (**QUALIFY**, **NOT QUALIFY**, or **MANUAL REVIEW**) with notes.
   - Review the tamper-evident **Audit Trail** tab recording every submission, verification check, and decision with exact timestamps.

3. **Bidder Portal Flow**:
   - Switch to **💻 ABC Tech** or **🏭 XYZ Ind**.
   - Browse available government tenders.
   - Apply to a tender, click **"Upload Demo Documents"** to simulate document upload with AI field extraction, and click **"Submit Bid"**.
   - Switch back to **👤 Officer** to watch the new application appear in real-time in the procurement officer queue!

4. **Reset Demo Anytime**:
   - Click **"🔄 Reset Demo Data"** in the top navigation bar to reset all bids, scores, and decisions back to the default state.
