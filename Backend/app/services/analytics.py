import pandas as pd


def CalculateAnalytics(state):
    df = state.get("cleaned_df", state.get("raw_df", pd.DataFrame()))

    sales_col = next(
        (col for col in df.columns if col.lower() in {"sales", "amount", "revenue", "total sales"}),
        None,
    )
    date_col = next(
        (col for col in df.columns if col.lower() in {"date", "order date", "transaction date", "created at"}),
        None,
    )
    product_col = next(
        (col for col in df.columns if col.lower() in {"product", "item", "product name", "sku"}),
        None,
    )
    region_col = next(
        (col for col in df.columns if col.lower() in {"region", "state", "city", "country"}),
        None,
    )
    category_col = next(
        (col for col in df.columns if col.lower() in {"category", "department", "segment"}),
        None,
    )

    sales_series = pd.to_numeric(df[sales_col], errors="coerce") if sales_col else pd.Series([0], index=df.index)

    Total_rows = len(df)
    Total_sales = float(sales_series.sum()) if not sales_series.empty else 0
    Average_sales = float(sales_series.mean()) if not sales_series.empty else 0
    Max_sales = float(sales_series.max()) if not sales_series.empty else 0
    Min_sales = float(sales_series.min()) if not sales_series.empty else 0
    Total_columns = len(df.columns)
    Total_Numeric_columns_count = len(df.select_dtypes(include=['number']).columns)
    Category_columns_count = len(df.select_dtypes(include=['object']).columns)
    Missing_values_count = int(df.isnull().sum().sum())
    Duplicate_rows_count = int(df.duplicated().sum())

    metrics = {
        "Total_rows": Total_rows,
        "Total_sales": Total_sales,
        "Average_sales": Average_sales,
        "Max_sales": Max_sales,
        "Min_sales": Min_sales,
        "Total_columns": Total_columns,
        "Total_Numeric_columns_count": Total_Numeric_columns_count,
        "Category_columns_count": Category_columns_count,
        "Missing_values_count": Missing_values_count,
        "Duplicate_rows_count": Duplicate_rows_count,
        "sales_column": sales_col,
        "date_column": date_col,
        "product_column": product_col,
        "region_column": region_col,
        "category_column": category_col,
    }

    state["metrics"] = metrics

    return state