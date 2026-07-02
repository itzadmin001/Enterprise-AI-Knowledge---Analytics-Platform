def schema_detection_node(state):
    df = state["raw_df"]

    total_rows = df.shape[0]
    total_columns = df.shape[1]
    culumns_names = df.columns.tolist()
    data_types = df.dtypes.apply(lambda x: x.name).to_dict()
    
    missing_values = df.isnull().sum().to_dict()
    memory_usage = df.memory_usage(deep=True).sum()

    schema = {
        "total_rows": total_rows,
        "total_columns": total_columns,
        "columns_names": culumns_names,
        "data_types": data_types,
        "missing_values": missing_values,
        "memory_usage": memory_usage
    }

    state["schema"] = schema
    return state

