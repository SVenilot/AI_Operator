from db import SessionLocal
from models import Client

db = SessionLocal()

client = Client(
    client_id="123",
    telegram_chat_id="ТВОЙ_CHAT_ID"
)

db.add(client)
db.commit()
db.close()

print("Client created!")