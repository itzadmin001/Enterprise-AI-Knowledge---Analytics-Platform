import pandas as pd


def _find_column(columns, aliases):
    lookup = {col.lower(): col for col in columns}
    for alias in aliases:
        if alias in lookup:
            return lookup[alias]
    return None


def VisualizeData(state):
    df = state["cleaned_df"].copy()
    charts = {}

    sales_col = _find_column(df.columns, ["sales", "amount", "revenue", "total sales"])
    date_col = _find_column(df.columns, ["date", "order date", "transaction date", "created at"])
    product_col = _find_column(df.columns, ["product", "item", "product name", "sku"])
    region_col = _find_column(df.columns, ["region", "state", "city", "country"])
    category_col = _find_column(df.columns, ["category", "department", "segment"])

    if sales_col and date_col:
        sales = pd.to_numeric(df[sales_col], errors="coerce")
        date = pd.to_datetime(df[date_col], errors="coerce")
        plot_df = pd.DataFrame({"Date": date, "Sales": sales}).dropna()
        if not plot_df.empty:
            trend = plot_df.groupby("Date")["Sales"].sum().reset_index()
            charts["sales_trend"] = {
                "type": "line",
                "labels": trend["Date"].astype(str).tolist(),
                "datasets": [{
                    "label": "Sales",
                    "data": trend["Sales"].tolist(),
                }],
            }

    if sales_col and product_col:
        sales = pd.to_numeric(df[sales_col], errors="coerce")
        plot_df = pd.DataFrame({"Product": df[product_col], "Sales": sales}).dropna()
        if not plot_df.empty:
            top_products = plot_df.groupby("Product")["Sales"].sum().nlargest(10).reset_index()
            charts["top_products"] = {
                "type": "bar",
                "labels": top_products["Product"].astype(str).tolist(),
                "datasets": [{
                    "label": "Sales",
                    "data": top_products["Sales"].tolist(),
                }],
            }

    if region_col and sales_col:
        sales = pd.to_numeric(df[sales_col], errors="coerce")
        plot_df = pd.DataFrame({"Region": df[region_col], "Sales": sales}).dropna()
        if not plot_df.empty:
            sales_by_region = plot_df.groupby("Region")["Sales"].sum().reset_index()
            charts["sales_by_region"] = {
                "type": "bar",
                "labels": sales_by_region["Region"].astype(str).tolist(),
                "datasets": [{
                    "label": "Sales",
                    "data": sales_by_region["Sales"].tolist(),
                }],
            }

    if category_col:
        category_counts = df[category_col].value_counts(dropna=False)
        if not category_counts.empty:
            charts["category_distribution"] = {
                "type": "pie",
                "labels": category_counts.index.astype(str).tolist(),
                "datasets": [{
                    "data": category_counts.values.tolist(),
                }],
            }

    numeric_df = df.select_dtypes(include=["number"])
    if numeric_df.shape[1] >= 2:
        correlation_matrix = numeric_df.corr()
        charts["correlation_heatmap"] = {
            "type": "heatmap",
            "labels": correlation_matrix.columns.tolist(),
            "matrix": correlation_matrix.round(3).values.tolist(),
        }

    state["charts"] = charts
    return state
