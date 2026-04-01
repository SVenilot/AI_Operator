const serverUrl = "https://твоя-ссылка-на-railway.up.railway.app"; // <- замени на свой URL

// Кнопка чата
const chatButton = document.createElement("button");
chatButton.textContent = "Чат с менеджером";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.zIndex = 9999;
chatButton.style.padding = "10px 20px";
chatButton.style.background = "#007bff";
chatButton.style.color = "#fff";
chatButton.style.border = "none";
chatButton.style.borderRadius = "5px";
chatButton.style.cursor = "pointer";
document.body.appendChild(chatButton);

// Окно чата
const chatWindow = document.createElement("div");
chatWindow.style.position = "fixed";
chatWindow.style.bottom = "60px";
chatWindow.style.right = "20px";
chatWindow.style.width = "300px";
chatWindow.style.height = "400px";
chatWindow.style.background = "#fff";
chatWindow.style.border = "1px solid #ccc";
chatWindow.style.borderRadius = "5px";
chatWindow.style.display = "none";
chatWindow.style.flexDirection = "column";
chatWindow.style.zIndex = 9999;
document.body.appendChild(chatWindow);

const messagesDiv = document.createElement("div");
messagesDiv.style.flex = "1";
messagesDiv.style.padding = "10px";
messagesDiv.style.overflowY = "auto";
chatWindow.appendChild(messagesDiv);

const input = document.createElement("input");
input.type = "text";
input.placeholder = "Напишите сообщение...";
input.style.width = "100%";
input.style.boxSizing = "border-box";
chatWindow.appendChild(input);

// Показ/скрытие окна
chatButton.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
};

// Отправка сообщения
input.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const msg = input.value;
        if (!msg) return;
        input.value = "";

        const userMsg = document.createElement("div");
        userMsg.textContent = "Вы: " + msg;
        messagesDiv.appendChild(userMsg);

        try {
            const res = await fetch(`${serverUrl}/chat`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ client_id: "123", message: msg })
            });
            const data = await res.json();

            const aiMsg = document.createElement("div");
            aiMsg.textContent = "Менеджер: " + data.reply;
            messagesDiv.appendChild(aiMsg);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (err) {
            const errMsg = document.createElement("div");
            errMsg.textContent = "Ошибка отправки";
            messagesDiv.appendChild(errMsg);
        }
    }
});