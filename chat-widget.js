(function() {
    var style = document.createElement('style');
    style.textContent = '.termuxpert-chat-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:26px;cursor:pointer;box-shadow:0 8px 32px rgba(69,162,158,0.4);display:flex;align-items:center;justify-content:center;transition:all 0.3s}.termuxpert-chat-btn:hover{transform:scale(1.08);box-shadow:0 12px 40px rgba(69,162,158,0.6)}.termuxpert-chat-box{position:fixed;bottom:100px;right:24px;z-index:9998;width:400px;height:560px;background:#15171E;border:1px solid #2A3340;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.6);display:none;flex-direction:column;overflow:hidden}.termuxpert-chat-box.open{display:flex}.termuxpert-chat-header{background:linear-gradient(135deg,#1F2833,#1a1f2b);padding:14px 18px;border-bottom:1px solid #2A3340;display:flex;align-items:center;gap:12px}.termuxpert-chat-header .icon{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);display:flex;align-items:center;justify-content:center;font-size:20px;color:#0B0C10;flex-shrink:0}.termuxpert-chat-header .info{flex:1}.termuxpert-chat-header .title{color:#FFF;font-weight:700;font-size:15px}.termuxpert-chat-header .status{font-size:11px;color:#06D6A0;display:flex;align-items:center;gap:4px}.termuxpert-chat-header .status::before{content:"";width:8px;height:8px;background:#06D6A0;border-radius:50%;display:inline-block;animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.termuxpert-chat-header .close-btn{background:rgba(255,255,255,.1);border:none;color:#8A8D93;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}.termuxpert-chat-header .close-btn:hover{background:rgba(239,71,111,.3);color:#EF476F}.termuxpert-chat-messages{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}.termuxpert-chat-messages::-webkit-scrollbar{width:4px}.termuxpert-chat-messages::-webkit-scrollbar-thumb{background:#2A3340;border-radius:4px}.termuxpert-msg{max-width:88%;animation:msgIn .3s ease}@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.termuxpert-msg.user{align-self:flex-end}.termuxpert-msg.bot{align-self:flex-start}.termuxpert-msg .bubble{padding:12px 16px;border-radius:18px;font-size:13.5px;line-height:1.7;word-wrap:break-word}.termuxpert-msg.user .bubble{background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border-bottom-right-radius:4px}.termuxpert-msg.bot .bubble{background:#1F2833;color:#E0E0E0;border-bottom-left-radius:4px;border:1px solid #2A3340}.termuxpert-msg .time{font-size:10px;color:#8A8D93;margin-top:4px;padding:0 4px}.termuxpert-msg.user .time{text-align:left}.termuxpert-msg.bot .time{text-align:right}.termuxpert-msg .bubble pre{background:#0B0C10;border:1px solid #45A29E40;border-radius:10px;padding:12px;margin:8px 0;overflow-x:auto;font-family:"JetBrains Mono",monospace;color:#66FCF1;font-size:12px;direction:ltr;text-align:left;position:relative}.termuxpert-msg .bubble pre .copy-btn{position:absolute;top:6px;right:6px;background:#45A29E;color:#0B0C10;border:none;padding:4px 10px;border-radius:6px;font-size:10px;cursor:pointer;font-family:"Cairo",sans-serif;opacity:0;transition:opacity .2s}.termuxpert-msg .bubble pre:hover .copy-btn{opacity:1}.termuxpert-msg .bubble code{background:rgba(69,162,158,.15);color:#66FCF1;padding:2px 7px;border-radius:5px;font-family:"JetBrains Mono",monospace;font-size:12px;direction:ltr;display:inline-block}.termuxpert-msg .bubble pre code{background:none;padding:0;display:block}.termuxpert-typing{display:flex;gap:4px;padding:12px 16px;align-items:center}.termuxpert-typing span{width:7px;height:7px;background:#45A29E;border-radius:50%;animation:bounce 1.4s infinite ease-in-out both}.termuxpert-typing span:nth-child(1){animation-delay:-.32s}.termuxpert-typing span:nth-child(2){animation-delay:-.16s}@keyframes bounce{0%,80%,100%{transform:scale(.4)}40%{transform:scale(1)}}.termuxpert-chat-input{display:flex;padding:14px;border-top:1px solid #2A3340;gap:8px;background:#15171E}.termuxpert-chat-input input{flex:1;padding:12px 16px;border-radius:25px;background:#1F2833;border:1px solid #2A3340;color:#FFF;font-family:"Cairo",sans-serif;font-size:13px;transition:border .3s}.termuxpert-chat-input input:focus{border-color:#45A29E;outline:none}.termuxpert-chat-input input::placeholder{color:#5A5D63}.termuxpert-chat-input button{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;flex-shrink:0}.termuxpert-chat-input button:hover{transform:scale(1.05);box-shadow:0 4px 20px rgba(69,162,158,.5)}.termuxpert-chat-input button:disabled{opacity:.5;cursor:not-allowed;transform:none}@media(max-width:480px){.termuxpert-chat-box{width:100vw;height:100dvh;bottom:0;right:0;border-radius:0}.termuxpert-chat-btn{bottom:16px;right:16px;width:56px;height:56px;font-size:24px}}';
    document.head.appendChild(style);

    var html = '<button class="termuxpert-chat-btn" title="محادثة TermuXpert">💬</button><div class="termuxpert-chat-box" id="termuxpertBox"><div class="termuxpert-chat-header"><div class="icon">🤖</div><div class="info"><div class="title">TermuXpert AI</div><div class="status">متصل</div></div><button class="close-btn" title="إغلاق">✕</button></div><div class="termuxpert-chat-messages" id="termuxpertMessages"><div class="termuxpert-msg bot"><div class="bubble">👋 أهلًا! أنا <b>TermuXpert</b>، خبير أوامر Termux. اسألني أي شيء!</div><div class="time">الآن</div></div></div><div class="termuxpert-chat-input"><input type="text" id="termuxpertInput" placeholder="اكتب سؤالك عن Termux..." autocomplete="off"><button id="termuxpertSend" title="إرسال">➤</button></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);

    var box = document.getElementById('termuxpertBox');
    var msgs = document.getElementById('termuxpertMessages');
    var input = document.getElementById('termuxpertInput');
    var sendBtn = document.getElementById('termuxpertSend');
    var isLoading = false;

    document.querySelector('.termuxpert-chat-btn').addEventListener('click', function() {
        box.classList.toggle('open');
        if (box.classList.contains('open')) input.focus();
    });
    document.querySelector('.close-btn').addEventListener('click', function() { box.classList.remove('open'); });
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function(e) { if (e.key === 'Enter' && !isLoading) sendMessage(); });

    function getTime() {
        var now = new Date();
        return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
    }

    function addMessage(text, type) {
        var div = document.createElement('div');
        div.className = 'termuxpert-msg ' + type;
        var bubble = document.createElement('div');
        bubble.className = 'bubble';
        var safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        safe = safe.replace(/```(\w*)\n?([\s\S]*?)```/g, function(match, lang, code) {
            return '<pre><button class="copy-btn" onclick="navigator.clipboard.writeText(\'' + code.trim().replace(/'/g, "\\'") + '\')">نسخ</button><code>' + code.trim() + '</code></pre>';
        });
        safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
        safe = safe.replace(/\n/g, '<br>');
        bubble.innerHTML = safe;
        div.appendChild(bubble);
        var time = document.createElement('div');
        time.className = 'time';
        time.textContent = getTime();
        div.appendChild(time);
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
        var div = document.createElement('div');
        div.className = 'termuxpert-msg bot';
        div.id = 'typingIndicator';
        div.innerHTML = '<div class="bubble"><div class="termuxpert-typing"><span></span><span></span><span></span></div></div>';
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function hideTyping() {
        var el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    async function sendMessage() {
        var text = input.value.trim();
        if (!text || isLoading) return;
        isLoading = true;
        sendBtn.disabled = true;
        addMessage(text, 'user');
        input.value = '';
        showTyping();
        try {
            var resp = await fetch('https://termuxpert-termuxpert-chat.hf.space/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: text }) });
            var data = await resp.json();
            hideTyping();
            addMessage(data.answer || '⚠️ لم أستطع الإجابة.', 'bot');
        } catch(e) {
            hideTyping();
            addMessage('⚠️ خطأ في الاتصال.', 'bot');
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            input.focus();
        }
    }
})();