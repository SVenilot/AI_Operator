from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from ai import ask_ai
from db import SessionLocal, engine
from models import Base, Lead, Client
from email_utils import send_telegram

import re

load_dotenv()

# создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()

# ====== РАЗДАЧА СТАТИКИ (ВАЖНО) ======
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# ====== CORS ======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== МОДЕЛЬ ======
class ChatRequest(BaseModel):
    message: str
    history: list = []
    client_id: str


# ====== ПОИСК ТЕЛЕФОНА ======
def extract_phone(text: str):
    phone_pattern = r'(\+?\d[\d\s\-]{7,})'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None


# ====== API ======
@app.post("/chat")
async def chat(req: ChatRequest):
    user_message = req.message

    # AI ответ
    reply = ask_ai(user_message, req.history)

    # проверка телефона
    phone = extract_phone(user_message)

    if phone:
        db = SessionLocal()

        # сохраняем лид
        lead = Lead(
            name="Unknown",
            phone=phone,
            message=user_message,
            client_id=req.client_id
        )
        db.add(lead)

        # ищем клиента
        client = db.query(Client).filter_by(client_id=req.client_id).first()

        # если найден — отправляем в Telegram
        if client and client.telegram_chat_id:
            send_telegram(
                name="Unknown",
                phone=phone,
                message=user_message,
                chat_id=client.telegram_chat_id
            )

        db.commit()
        db.close()

    return {"reply": reply}


# ====== ПРОВЕРКА ======
@app.get("/health")
def health():
    return {"status": "ok"}