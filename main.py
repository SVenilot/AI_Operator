from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
INDEX_FILE = STATIC_DIR / "index.html"

# Подключаем папку со статикой
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    if INDEX_FILE.exists():
        return FileResponse(str(INDEX_FILE))
    return JSONResponse(
        {
            "error": "index.html not found",
            "message": "Положи файл index.html в папку static"
        },
        status_code=500,
    )


@app.post("/chat")
async def chat(request: Request):
    try:
        data = await request.json()
        text = data.get("message", "").strip()

        if not text:
            return JSONResponse(
                {"error": "Пустое сообщение"},
                status_code=400
            )

        # ВРЕМЕННЫЙ ОТВЕТ
        # Здесь потом можно вернуть твою логику:
        # - отправку в Telegram
        # - OpenAI
        # - любую другую обработку
        return {"reply": f"Ты написал: {text}"}

    except Exception as e:
        return JSONResponse(
            {"error": f"Ошибка сервера: {str(e)}"},
            status_code=500
        )