# Emotion Beyond Words

A modern web application for multidimensional emotion analysis.

## Features
- **Real-time Detection**: Classify text into Joy, Anger, Fear, Sadness, Trust, and Anticipation.
- **Batch Processing**: Upload CSV files for large-scale dataset analysis.
- **Visual Dashboard**: Interactive charts (Pie/Bar) and detailed probability breakdowns.
- **Modern UI**: Dark/Light mode, responsive design, and smooth animations.

## Setup Instructions

### 1. Backend (Python)
- Install dependencies: `pip install -r backend/requirements.txt`
- Run the backend: `python run.py` (alternatively, `uvicorn backend.main:app --reload`)

### 2. Frontend (React)
- Navigate to frontend: `cd frontend`
- Install packages: `npm install`
- Run dev server: `npm run dev`

## Dataset Format
For CSV uploads, ensure your file contains a `text` column. The system will automatically detect and process it.

## Tech Stack
- **ML**: HuggingFace Transformers (BERT/DistilRoBERTa)
- **Backend**: FastAPI
- **Frontend**: React (Vite) + Tailwind CSS
- **Visualization**: Recharts
