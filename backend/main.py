from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io

app = FastAPI(title="Emotion Beyond Words API", description="API for detecting emotions in text")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from ml_engine import ml_engine

class TextRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Emotion Beyond Words API"}

@app.post("/analyze/text")
def analyze_text(request: TextRequest):
    result = ml_engine.analyze_text(request.text)
    return {
        "text": request.text,
        "emotion": result["emotion"],
        "scores": result["scores"]
    }

@app.post("/analyze/csv")
async def analyze_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # Handle various encodings common in CSVs
        try:
            text_data = contents.decode('utf-8-sig') # Handles BOM
        except UnicodeDecodeError:
            text_data = contents.decode('latin-1')
            
        df = pd.read_csv(io.StringIO(text_data))
        
        if df.empty:
            return {"results": [], "error": "CSV file is empty"}

        # Analyze all texts
        column_to_analyze = 'text' if 'text' in df.columns else df.columns[0]
        texts = df[column_to_analyze].astype(str).tolist()
        
        analysis_results = ml_engine.analyze_batch(texts)
        
        results = []
        for index, row in df.iterrows():
            results.append({
                "id": row.get('id', index),
                "text": texts[index],
                "emotion": analysis_results[index]["emotion"],
                "scores": analysis_results[index]["scores"]
            })
            
        return {"results": results}
    except Exception as e:
        print(f"CSV Analysis Error: {e}")
        return {"results": [], "error": str(e)}
