(function() {
    var style = document.createElement('style');
    style.textContent = '.termuxpert-chat-btn{position:fixed;bottom:20px;right:20px;z-index:9999;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:28px;cursor:pointer;box-shadow:0 4px 20px rgba(69,162,158,0.4);display:flex;align-items:center;justify-content:center}.termuxpert-chat-btn:hover{transform:scale(1.05)}.termuxpert-chat-box{position:fixed;bottom:90px;right:20px;z-index:9998;width:380px;height:500px;background:#15171E;border:1px solid #2A3340;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.5);display:none;flex-direction:column}.termuxpert-chat-box.open{display:flex}.termuxpert-chat-header{background:#1F2833;padding:12px 16px;border-bottom:1px solid #2A3340;display:flex;align-items:center;gap:10px}.termuxpert-chat-header .icon{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);display:flex;align-items:center;justify-content:center;font-size:18px;color:#0B0C10}.termuxpert-chat-header .title{color:#FFF;font-weight:700;font-size:16px}.termuxpert-chat-header .status{font-size:11px;color:#06D6A0}.termuxpert-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}.termuxpert-chat-messages .msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.6}.termuxpert-chat-messages .msg.user{align-self:flex-end;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10}.termuxpert-chat-messages .msg.bot{align-self:flex-start;background:#1F2833;color:#C5C6C7}.termuxpert-chat-input{display:flex;padding:12px;border-top:1px solid #2A3340;gap:8px;background:#15171E}.termuxpert-chat-input input{flex:1;padding:10px 14px;border-radius:20px;background:#1F2833;border:1px solid #2A3340;color:#FFF;font-family:Cairo,sans-serif;font-size:13px}.termuxpert-chat-input input:focus{border-color:#45A29E;outline:none}.termuxpert-chat-input button{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:18px;cursor:pointer}';
    document.head.appendChild(style);

    var html = '<button class="termuxpert-chat-btn">💬</button><div class="termuxpert-chat-box" id="chatBox"><div class="termuxpert-chat-header"><div class="icon">🤖</div><div><div class="title">TermuXpert AI</div><div class="status">🟢 متصل</div></div></div><div class="termuxpert-chat-messages" id="chatMessages"><div class="msg bot">👋 أهلًا! أنا TermuXpert، خبير أوامر Termux. اسألني أي شيء!</div></div><div class="termuxpert-chat-input"><input type="text" id="chatInput" placeholder="اكتب سؤالك..."><button id="sendBtn">➤</button></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);

    function sendMessage() {
        var input = document.getElementById('chatInput');
        var text = input.value.trim();
        if (!text) return;
        var msgs = document.getElementById('chatMessages');
        msgs.innerHTML += '<div class="msg user">' + text + '</div>';
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;
        fetch('https://termuxpert-termuxpert-chat.hf.space/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text }) })
            .then(r => r.json())
            .then(d => { msgs.innerHTML += '<div class="msg bot">' + d.answer + '</div>'; msgs.scrollTop = msgs.scrollHeight; })
            .catch(() => { msgs.innerHTML += '<div class="msg bot">⚠️ خطأ في الاتصال.</div>'; msgs.scrollTop = msgs.scrollHeight; });
    }

    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });
    document.querySelector('.termuxpert-chat-btn').addEventListener('click', function() { document.getElementById('chatBox').classList.toggle('open'); });
})();
