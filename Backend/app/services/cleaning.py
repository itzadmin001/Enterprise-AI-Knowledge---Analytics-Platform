import pandas as pd


def Cleaning(state):
    df = state["raw_df"].copy()

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Convert numeric-like strings safely to numeric values.
    for col in df.columns:
        if pd.api.types.is_object_dtype(df[col]):
            converted = pd.to_numeric(df[col], errors="coerce")
            if converted.notna().sum() > 0:
                df[col] = converted

    # Convert date-like columns to datetime when possible.
    for col in df.columns:
        if pd.api.types.is_object_dtype(df[col]):
            try:
                df[col] = pd.to_datetime(df[col], errors="coerce")
            except Exception:
                pass

    # Normalize string columns and fill missing values safely.
    for col in df.select_dtypes(include=['object']).columns:
        df[col] = df[col].astype(str).str.strip()
        df[col] = df[col].replace({'nan': 'Unknown', 'None': 'Unknown', '': 'Unknown'})

    df = df.fillna("Unknown")

    state["cleaned_df"] = df
    return state