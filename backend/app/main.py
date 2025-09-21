from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

# Load the .env file and get the key
load_dotenv()

# Initialize the Groq client with the API key
client = Groq(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(title="AI Chat Starter")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list

class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="API key not configured.")

    try:
        # Use Groq API with a current model
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # CHANGED TO CURRENT MODEL
            messages=request.messages,
            max_tokens=250
        )
        reply_text = completion.choices[0].message.content
        return ChatResponse(reply=reply_text)

    except Exception as error:
        print(f"API Error: {error}")
        raise HTTPException(status_code=500, detail="Failed to get response from the AI service.")