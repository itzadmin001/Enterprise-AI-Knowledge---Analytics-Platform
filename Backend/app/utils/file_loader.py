from io import BytesIO
from pathlib import Path

import pandas as pd


def load_uploaded_file(file_name: str, file_content: bytes) -> pd.DataFrame:
    suffix = Path(file_name).suffix.lower()

    if suffix == ".csv":
        return pd.read_csv(BytesIO(file_content), low_memory=False)
    if suffix in {".xls", ".xlsx"}:
        return pd.read_excel(BytesIO(file_content))

    raise ValueError("Only CSV and Excel files are supported.")
