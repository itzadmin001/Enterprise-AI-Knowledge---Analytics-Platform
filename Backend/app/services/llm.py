from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

import os

load_dotenv()  # Load environment variables from .env file

Google_API_KEY = os.getenv("GOOGLE_API_KEY")


def llm_model(state):
    metrics = state.get("metrics", {})

    if not Google_API_KEY:
        state["insights"] = "Insights are unavailable because the Google API key is not configured."
        return state

    prompt = f"""
    You are a Senior Business Data Analyst.

    Analyze the following business metrics and generate:

    1. Executive Summary
    2. Key Insights
    3. Business Recommendations

    Business Metrics:
    {metrics}
    """.strip()

    model = ChatGoogleGenerativeAI(
        temperature=0,
        model="gemini-2.5-flash",
        api_key=Google_API_KEY,
    )

    response = model.invoke(prompt)
    state["insights"] = response.content if hasattr(response, "content") else str(response)
    return state