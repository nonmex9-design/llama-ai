const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

let conversation = [];

function addMessage(content, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = content;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  conversation.push({ role: 'user', content: text });
  input.value = '';

  const loading = document.createElement('div');
  loading.className = 'message bot';
  loading.textContent = 'Thinking...';
  messagesDiv.appendChild(loading);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation })
    });

    const data = await res.json();
    messagesDiv.removeChild(loading);
    addMessage(data.reply, 'bot');
    conversation.push({ role: 'assistant', content: data.reply });
  } catch (err) {
    messagesDiv.removeChild(loading);
    addMessage('Error: Could not reach Llama 4 server', 'bot');
  }
}

sendBtn.onclick = sendMessage;
input.onkeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// Auto-resize textarea
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = (input.scrollHeight) + 'px';
});
