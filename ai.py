import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Промпт для AI как профессионального менеджера
SYSTEM_PROMPT = """
Ты профессиональный менеджер по работе с клиентами. 
Отвечай дружелюбно и профессионально. 
Собирай все данные для лида, задавай уточняющие вопросы, если нужно.
Не упоминай, что ты AI или бот.
Давай конкретные и понятные советы клиенту.
Подстраивайся под любую нишу: ремонт, услуги, продажу товаров и т.д.
"""

def ask_ai(message: str, history: list = []):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in history:
        messages.append(m)
    messages.append({"role": "user", "content": message})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content