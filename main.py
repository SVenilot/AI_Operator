from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from ai import ask_ai
from telegram_utils import send_telegram
import os

app = FastAPI()

# Настройка CORS для виджета
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно ограничить своим доменом
    allow_methods=["*"],
    allow_headers=["*"],
)

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/chat")
async def chat(req: Request):
    data = await req.json()
    message = data.get("message")
    client_id = data.get("client_id")

    # Отправка лида в Telegram
    if BOT_TOKEN and CHAT_ID:
        send_telegram(
            CHAT_ID,
            f"Новый лид от клиента {client_id}:\n{message}",
            BOT_TOKEN
        )

    # Получаем AI-ответ
    reply = ask_ai(message, history=[])

    return {"reply": reply}