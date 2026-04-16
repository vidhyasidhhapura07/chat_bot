async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const sendBtn = document.getElementById("send-btn");
    const micBtn = document.getElementById("mic-btn");
    const wavePanel = document.getElementById("wavePanel");

    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user-message');
    input.value = "";

    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    chatBox.innerHTML += `
        <div class="message bot-message" id="${typingId}">
            <div style="display: flex; gap: 4px; padding: 4px 0;">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    scrollToBottom();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Remove typing indicator
        const typingIndicator = document.getElementById(typingId);
        if (typingIndicator) typingIndicator.remove();

        // Add bot message
        if (data.reply.startsWith("Error:")) {
            addMessage(data.reply, 'error-message');
        } else {
            addMessage(data.reply, 'bot-message');
        }
    } catch (error) {
        const typingIndicator = document.getElementById(typingId);
        if (typingIndicator) typingIndicator.remove();
        addMessage("Connection error. Please try again.", 'error-message');
    }
}

function addMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${className}`;
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const chatBox = document.getElementById("chat-box");
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("user-input").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});


document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("mic-btn").addEventListener("click", sendMessage);

function updateStatus() {
  let dot = document.getElementById("statusDot");

  if (navigator.onLine) {
    dot.classList.add("online");
    dot.classList.remove("offline");
  } else {
    dot.classList.add("offline");
    dot.classList.remove("online");
  }
}

window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);

// Page load pe bhi check karo
updateStatus();



