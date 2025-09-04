(function () {
  // Inject HTML structure
  const container = document.createElement("div");
  container.innerHTML = `
    <!-- Chat toggle button -->
    <button id="chatToggle">💬</button>

    <!-- Chat popup -->
    <div id="chatPopup">
      <div id="chatHeader">
        MediBot 🤖
        <button id="closeChat">×</button>
      </div>
      <div id="chat"></div>
      <div id="chatInput">
        <input type="text" id="message" placeholder="Type your message..." />
        <button id="sendBtn">Send</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Elements
  const chatToggle = document.getElementById("chatToggle");
  const chatPopup = document.getElementById("chatPopup");
  const closeChat = document.getElementById("closeChat");
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("message");
  const chat = document.getElementById("chat");

  // Toggle popup
  chatToggle.onclick = () => (chatPopup.style.display = "flex");
  closeChat.onclick = () => (chatPopup.style.display = "none");

  // Send message
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    input.value = "";

    chat.innerHTML += `<div class="user"><b>You:</b> ${message}</div>`;
    chat.scrollTop = chat.scrollHeight;

    const botDiv = document.createElement("div");
    botDiv.classList.add("bot");
    botDiv.innerHTML = `<b>MediBot:</b> ...typing`;
    chat.appendChild(botDiv);
    chat.scrollTop = chat.scrollHeight;

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await res.json();

      botDiv.innerHTML = `<b>MediBot:</b> ${data.reply}`;
      chat.scrollTop = chat.scrollHeight;
    } catch (err) {
      botDiv.innerHTML = `<b>MediBot:</b> ⚠️ Error connecting to chatbot`;
      console.error(err);
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
