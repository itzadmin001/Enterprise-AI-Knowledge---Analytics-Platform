from typing import TypedDict
import pandas as pd

class State(TypedDict):
    file_path: str
    raw_df: pd.DataFrame
    cleaned_df: pd.DataFrame
    schema: dict
    validation_report: dict
    metrics: dict
    charts: list
    insights: list
    recommendations: list
    report_path: str