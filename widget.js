// widget.js
(function() {
    // ==== Настройки ====
    const clientId = "123"; // <-- замените на ID вашего клиента
    const serverUrl = "https://your-app.up.railway.app"; // <-- ваш URL Railway

    // ==== Создаём кнопку чата ====
    const chatButton = document.createElement("button");
    chatButton.innerText = "Чат с менеджером";
    chatButton.style.position = "fixed";
    chatButton.style.bottom = "20px";
    chatButton.style.right = "20px";
    chatButton.style.backgroundColor = "#007bff";
    chatButton.style.color = "white";
    chatButton.style.border = "none";
    chatButton.style.borderRadius = "5px";
    chatButton.style.padding = "10px 15px";
    chatButton.style.cursor = "pointer";
    chatButton.style.zIndex = "9999";
    document.body.appendChild(chatButton);

    // ==== Создаём окно чата ====
    const chatWindow = document.createElement("div");
    chatWindow.style.position = "fixed";
    chatWindow.style.bottom = "70px";
    chatWindow.style.right = "20px";
    chatWindow.style.width = "300px";
    chatWindow.style.height = "400px";
    chatWindow.style.backgroundColor = "white";
    chatWindow.style.border = "1px solid #ccc";
    chatWindow.style.borderRadius = "5px";
    chatWindow.style.display = "none";
    chatWindow.style.flexDirection = "column";
    chatWindow.style.zIndex = "9999";
    chatWindow.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    document.body.appendChild(chatWindow);

    // ==== Верх окна (Close) ====
    const header = document.createElement("div");
    header.style.padding = "10px";
    header.style.backgroundColor = "#007bff";
    header.style.color = "white";
    header.style.fontWeight = "bold";
    header.innerText = "Чат с менеджером";
    const closeBtn = document.createElement("span");
    closeBtn.innerText = "×";
    closeBtn.style.float = "right";
    closeBtn.style.cursor = "pointer";
    header.appendChild(closeBtn);
    chatWindow.appendChild(header);

    closeBtn.onclick = () => chatWindow.style.display = "none";

    // ==== Основное окно сообщений ====
    const messagesDiv = document.createElement("div");
    messagesDiv.style.flex = "1";
    messagesDiv.style.padding = "10px";
    messagesDiv.style.overflowY = "auto";
    chatWindow.appendChild(messagesDiv);

    // ==== Поле ввода ====
    const inputDiv = document.createElement("div");
    inputDiv.style.display = "flex";
    inputDiv.style.padding = "10px";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Введите сообщение...";
    input.style.flex = "1";
    input.style.padding = "5px";
    const sendBtn = document.createElement("button");
    sendBtn.innerText = "Отправить";
    sendBtn.style.marginLeft = "5px";
    inputDiv.appendChild(input);
    inputDiv.appendChild(sendBtn);
    chatWindow.appendChild(inputDiv);

    // ==== Открываем окно по клику ====
    chatButton.onclick = () => {
        chatWindow.style.display = "flex";
    };

    // ==== Функция добавления сообщения в окно ====
    function addMessage(text, isClient = false) {
        const msg = document.createElement("div");
        msg.innerText = text;
        msg.style.marginBottom = "5px";
        msg.style.padding = "5px";
        msg.style.borderRadius = "5px";
        msg.style.backgroundColor = isClient ? "#007bff" : "#f1f1f1";
        msg.style.color = isClient ? "white" : "black";
        msg.style.alignSelf = isClient ? "flex-end" : "flex-start";
        messagesDiv.appendChild(msg);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // ==== Отправка сообщения на сервер ====
    async function sendMessage(text) {
        if (!text) return;
        addMessage(text, true);
        input.value = "";
        try {
            const response = await fetch(`${serverUrl}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: clientId,
                    message: text
                })
            });
            const data = await response.json();
            if (data.reply) {
                addMessage(data.reply, false);
            }
        } catch (err) {
            console.error("Ошибка отправки на сервер:", err);
            addMessage("Ошибка отправки сообщения", false);
        }
    }

    // ==== Событие кнопки отправки ====
    sendBtn.onclick = () => sendMessage(input.value);
    input.addEventListener("keypress", e => {
        if (e.key === "Enter") sendMessage(input.value);
    });

})();