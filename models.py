from sqlalchemy import Column, Integer, String
from db import Base

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Unknown")
    phone = Column(String)
    message = Column(String)
    client_id = Column(String)


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, unique=True)
    telegram_chat_id = Column(String)