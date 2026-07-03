from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json

app = FastAPI()

# Streamlined production CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.youtube.com"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FramePayload(BaseModel):
    image: str
    api_key: str

@app.post("/analyze-frame")
async def analyze_frame(payload: FramePayload):
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={payload.api_key}"
    
    prompt = """
    Look closely at the provided cricket video frame. 
    1. Scan the broadcast scoreboard overlay at the bottom/top of the screen.
    2. Identify the active batsman currently on strike (e.g., Abhishek Sharma, Sanju Samson) and the current active bowler. Do not confuse historical player data with the active names printed on the match scoreboard graphics.
    3. Formulate a strategic career matchup overview based on their playstyles.
    4. Provide the exact bowling strategy and recommended field placement to restrict the striker.
    
    Return ONLY a valid JSON object matching this schema perfectly. No markdown formatting, backticks, or extra text:
    {
        "batsman1": {"name": "Identified Striker Name", "weakness": "Career tactical weakness description"},
        "bowler": {"name": "Identified Bowler Name", "strategy": "What line/length this specific bowler should use"},
        "field_placement": "Ideal explicit fielding layout configuration for this matchup situation"
    }
    """
    
    llm_payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inlineData": {
                        "mimeType": "image/jpeg",
                        "data": payload.image
                    }
                }
            ]
        }],
        "generationConfig": {"response_mime_type": "application/json"}
    }
    
    try:
        res = requests.post(endpoint, json=llm_payload)
        res.raise_for_status()
        
        raw_text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
        structured_data = json.loads(raw_text)
        return structured_data
    except Exception as e:
        return {"error": str(e)}