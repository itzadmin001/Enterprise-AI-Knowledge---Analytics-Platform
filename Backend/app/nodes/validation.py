def validation(state):
    df = state["raw_df"]

    # Check for missing values
    missing_values = df.isnull().sum().to_dict()

    # Check for duplicate rows
    duplicate_rows = df.duplicated().sum()

    # Check for data types
    data_types = df.dtypes.apply(lambda x: x.name).to_dict()

    # Check Empty culumns
    empty_columns = [col for col in df.columns if df[col].isnull().all()]

    # Check Total null percentage
    total_cells = df.size
    total_missing = df.isnull().sum().sum()
    total_null_percentage = (total_missing / total_cells) * 100

    #Check Unique values in each column
    unique_values = {col: df[col].nunique() for col in df.columns}

     
   
    validation_report = {
        "missing_values": missing_values,
        "duplicate_rows": duplicate_rows,
        "data_types": data_types,
        "empty_columns": empty_columns,
        "total_null_percentage": total_null_percentage,
        "unique_values": unique_values
    }
    

    state["validation_report"] = validation_report
    return state

