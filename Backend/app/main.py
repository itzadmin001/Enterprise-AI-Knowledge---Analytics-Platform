import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.graph import graph
from app.utils.file_loader import load_uploaded_file

load_dotenv()

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")


print("FRONTEND_URL =", frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _make_serializable(value):
    if isinstance(value, dict):
        return {str(k): _make_serializable(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_make_serializable(v) for v in value]
    if hasattr(value, "item"):
        try:
            return value.item()
        except Exception:
            return value
    if hasattr(value, "tolist"):
        try:
            return value.tolist()
        except Exception:
            return value
    if value.__class__.__name__ in {"Figure", "Axes", "AxesSubplot"}:
        return "chart_generated"
    return value


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/run-analysis")
async def run_analysis(file: UploadFile = File(...)) -> dict:
    print("hello")
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="File name is required.")

        contents = await file.read()
        df = load_uploaded_file(file.filename, contents)

        state = {
            "file_path": file.filename,
            "raw_df": df,
            "cleaned_df": None,
            "schema": {},
            "validation_report": {},
            "metrics": {},
            "charts": {},
            "insights": "",
            "recommendations": "",
            "report_path": "",
        }

        result = graph.invoke(state)

        return {
            "message": f"File {file.filename} processed successfully.",
            "schema": _make_serializable(result.get("schema", {})),
            "validation_report": _make_serializable(result.get("validation_report", {})),
            "metrics": _make_serializable(result.get("metrics", {})),
            "insights": _make_serializable(result.get("insights", "")),
            "charts": _make_serializable(result.get("charts", {})),
            "recommendations": _make_serializable(result.get("recommendations", "")),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to process uploaded file: {str(e)}")
