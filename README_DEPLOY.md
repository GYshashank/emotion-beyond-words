# 🚀 How to Deploy Emotion Beyond Words

This guide explains how to deploy the **Emotion Beyond Words** application using **GitHub Pages** (Frontend) and **Render** (Backend).

## 1. Prepare Your GitHub Repository
1. Create a new repository on GitHub (e.g., `emotion-beyond-words`).
2. Initialize and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initialize project"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy the Backend (Render.com)
1. Sign up/Login to [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following:
   - **Name**: `emotion-beyond-words-api`
   - **Runtime**: `Python 3` (or `Docker` if you prefer using the provided `Dockerfile`).
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
5. Click **Deploy Web Service**.
6. **Copy the URL** provided by Render (e.g., `https://emotion-beyond-words-api.onrender.com`).

## 3. Configure Frontend & GitHub Pages
1. Go to your **GitHub Repository Settings** > **Secrets and variables** > **Actions**.
2. Create a **New repository secret**:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-app.onrender.com` (The URL you copied above).
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.

## 4. Trigger Deployment
1. Push any change to the `main` branch, or go to the **Actions** tab and manually run the **Deploy Frontend to GitHub Pages** workflow.
2. Once finished, your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

---

### 🛠 Troubleshooting
- **CORS Errors**: Ensure Render's URL is allowed in `backend/main.py`. The current configuration uses `allow_origins=["*"]`, which is fine for testing.
- **Port Issues**: Render automatically assigns a port; FastAPI is configured to listen on `0.0.0.0` which is required.
