(function () {
  const apiUrl = "http://127.0.0.1:8000/chat";

  // 🔥 получаем client_id из URL
  const script = document.currentScript;
  const urlParams = new URLSearchParams(script.src.split("?")[1]);
  const clientId = urlParams.get("client_id");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.width = "300px";
  container.style.height = "400px";
  container.style.background = "#fff";
  container.style.border = "1px solid #ccc";
  container.style.borderRadius = "10px";
  container.style.display = "flex";
  container.style.flexDirection = "column";

  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";

  const input = document.createElement("input");
  input.placeholder = "Введите сообщение...";
  input.style.padding = "10px";

  const button = document.createElement("button");
  button.innerText = "Отправить";

  container.appendChild(messages);
  container.appendChild(input);
  container.appendChild(button);
  document.body.appendChild(container);

  let history = [];

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  addMessage("Здравствуйте! Чем могу помочь?", "AI");

  async function sendMessage() {
    const text = input.value;
    if (!text) return;

    addMessage(text, "Вы");

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        history: history,
        client_id: clientId
      })
    });

    const data = await res.json();

    addMessage(data.reply, "AI");

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: data.reply });

    if (history.length > 10) {
      history = history.slice(-10);
    }

    input.value = "";
  }

  button.onclick = sendMessage;

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
})();