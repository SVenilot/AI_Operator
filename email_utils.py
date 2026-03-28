import os
import requests
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")


def send_telegram(name, phone, message, chat_id):
    text = f"""
🔥 Новый лид!

👤 Имя: {name}
📞 Телефон: {phone}
💬 Сообщение: {message}
"""

    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"

    response = requests.post(url, json={
        "chat_id": chat_id,
        "text": text
    })

    return response.status_code