
import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def generate_debate(topic: str):
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is missing from backend/.env")

    client = genai.Client(api_key=API_KEY)

    prompt = f"""
    You are an expert AI Debate Coach.

    Analyze the following classroom debate topic:
    "{topic}"

    Generate a balanced debate analysis.

    Return valid JSON with exactly these sections:

    {{
        "topic": "Debate topic",
        "overview": "Short introduction",
        "for_arguments": [
            {{
                "argument": "Supporting argument",
                "explanation": "Detailed explanation"
            }}
        ],
        "against_arguments": [
            {{
                "argument": "Opposing argument",
                "explanation": "Detailed explanation"
            }}
        ],
        "counterarguments": [
            {{
                "original_argument": "An argument",
                "opposing_response": "Its counterargument"
            }}
        ],
        "evidence_scorecard": {{
            "source_credibility": {{
                "score": 0,
                "reason": "Explanation"
            }},
            "relevance": {{
                "score": 0,
                "reason": "Explanation"
            }},
            "recency": {{
                "score": 0,
                "reason": "Explanation"
            }},
            "bias": {{
                "score": 0,
                "reason": "Explanation"
            }},
            "overall_score": 0,
            "limitations": "Explain what evidence is missing"
        }},
        "conclusion": "Balanced conclusion"
    }}

    Requirements:
    - Give at least 3 arguments for each side.
    - Give at least 3 counterarguments.
    - Keep both sides equally strong.
    - Scores must be between 0 and 10.
    - Do not invent research papers, URLs or citations.
    - Clearly disclose when evidence has not been verified.
    - Treat generated evidence assessments as preliminary.
    """

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.4
        )
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    return json.loads(response.text)
