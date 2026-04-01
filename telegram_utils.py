import requests

def send_telegram(chat_id: str, text: str, bot_token: str):
    """
    Отправляет сообщение в Telegram.
    """
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    data = {"chat_id": chat_id, "text": text}
    resp = requests.post(url, data=data)
    return resp.json()