(function() {
    var style = document.createElement('style');
    style.textContent = `
        .termuxpert-chat-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 999999 !important;
            width: 60px; height: 60px; border-radius: 50%;
            background: var(--gradient, linear-gradient(135deg, #45A29E, #66FCF1));
            color: var(--bg-primary, #0B0C10); border: none; font-size: 28px;
            cursor: pointer; box-shadow: 0 8px 30px rgba(69,162,158,0.25);
            display: flex !important; align-items: center; justify-content: center;
            transition: all 0.3s ease;
        }
            position: fixed; bottom: 20px; right: 20px; z-index: 999999 !important;
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, #45A29E, #66FCF1);
            color: #0B0C10; border: none; font-size: 28px;
            cursor: pointer; box-shadow: 0 4px 20px rgba(69,162,158,0.4);
            display: flex !important; align-items: center; justify-content: center;
            transition: transform 0.2s ease;
        }
        .termuxpert-chat-btn:hover { transform: translateY(-3px) scale(1.05); box-shadow: 0 12px 40px rgba(69,162,158,0.4); }
        .termuxpert-chat-box {
            position: fixed; bottom: 90px; right: 20px; z-index: 999998 !important;
            width: 380px; height: 500px; background: #15171E;
            border: 1px solid #2A3340; border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: none; flex-direction: column;
            overflow: hidden;
        }
        .termuxpert-chat-box.open { display: flex !important; }
        .termuxpert-chat-header {
            background: #1F2833; padding: 12px 16px; border-bottom: 1px solid #2A3340;
            display: flex !important; align-items: center; gap: 10px;
        }
        .termuxpert-chat-header .icon {
            width: 36px; height: 36px; border-radius: 50%;
            background: linear-gradient(135deg, #45A29E, #66FCF1);
            display: flex !important; align-items: center; justify-content: center;
            font-size: 18px; color: #0B0C10;
        }
        .termuxpert-chat-header .title { color: #FFFFFF; font-weight: 700; font-size: 16px; }
        .termuxpert-chat-header .status { font-size: 11px; color: #06D6A0; }
        .termuxpert-chat-messages {
            flex: 1; overflow-y: auto; padding: 16px;
            display: flex !important; flex-direction: column; gap: 12px;
        }
        .termuxpert-chat-messages .msg {
            max-width: 85%; padding: 10px 14px; border-radius: 14px;
            font-size: 14px; line-height: 1.6; word-wrap: break-word;
        }
        .termuxpert-chat-messages .msg.user {
            align-self: flex-end; background: linear-gradient(135deg, #45A29E, #66FCF1);
            color: #0B0C10; border-bottom-right-radius: 2px;
        }
        .termuxpert-chat-messages .msg.bot {
            align-self: flex-start; background: #1F2833; color: #C5C6C7;
            border-bottom-left-radius: 2px;
        }
        .termuxpert-chat-messages pre {
            background: #0B0C10; border: 1px solid #2A3340;
            border-radius: 8px; padding: 8px; margin: 6px 0;
            overflow-x: auto; font-family: 'JetBrains Mono', monospace;
            color: #66FCF1; font-size: 12px; direction: ltr; text-align: left;
        }
        .termuxpert-chat-messages code {
            background: rgba(69, 162, 158, 0.15); color: #66FCF1;
            padding: 2px 6px; border-radius: 4px; font-family: 'JetBrains Mono', monospace;
            font-size: 12px; direction: ltr; display: inline-block;
        }
        .termuxpert-chat-messages pre code { background: none; padding: 0; display: block; }
        .termuxpert-chat-input {
            display: flex !important; padding: 12px; border-top: 1px solid #2A3340; gap: 8px; background: #15171E;
        }
        .termuxpert-chat-input input {
            flex: 1; padding: 10px 14px; border-radius: 20px;
            background: #1F2833; border: 1px solid #2A3340;
            color: #FFFFFF; font-family: 'Cairo', sans-serif; font-size: 13px;
        }
        .termuxpert-chat-input input:focus { border-color: #45A29E; outline: none; }
        .termuxpert-chat-input button {
            width: 40px; height: 40px; border-radius: 50%;
            background: linear-gradient(135deg, #45A29E, #66FCF1);
            color: #0B0C10; border: none; font-size: 18px; cursor: pointer;
            display: flex !important; align-items: center; justify-content: center;
        }
        .termuxpert-loading {
            display: inline-flex; gap: 4px; align-items: center; padding: 10px 14px;
        }
        .termuxpert-loading span {
            width: 6px; height: 6px; background: #66FCF1; border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .termuxpert-loading span:nth-child(1) { animation-delay: -0.32s; }
        .termuxpert-loading span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
    `;
    document.head.appendChild(style);

    var html = '<button class="termuxpert-chat-btn">💬</button><div class="termuxpert-chat-box" id="chatBox"><div class="termuxpert-chat-header"><div class="icon">🤖</div><div><div class="title">TermuXpert AI</div><div class="status">🟢 متصل</div></div></div><div class="termuxpert-chat-messages" id="chatMessages"><div class="msg bot">👋 أهلًا! أنا TermuXpert، خبير أوامر Termux. اسألني أي شيء!</div></div><div class="termuxpert-chat-input"><input type="text" id="chatInput" placeholder="اكتب سؤالك..."><button id="sendBtn">➤</button></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);

    var inputEl = document.getElementById('chatInput');
    var sendBtnEl = document.getElementById('sendBtn');
    var chatBtnEl = document.querySelector('.termuxpert-chat-btn');

    inputEl.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });
    sendBtnEl.addEventListener('click', sendMessage);
    chatBtnEl.addEventListener('click', toggleChat);
    
    function toggleChat() { document.getElementById('chatBox').classList.toggle('open'); }

    function formatBotResponse(text) {
        var safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var blockPattern = new RegExp('\\x60{3}(?:bash|sh|json)?([\\s\\S]*?)\\x60{3}', 'g');
        safeText = safeText.replace(blockPattern, function(match, code) {
            return '<pre><code>' + code.trim() + '</code></pre>';
        });
        var inlinePattern = new RegExp('\\x60([^\\x60]+)\\x60', 'g');
        safeText = safeText.replace(inlinePattern, '<code>$1</code>');
        safeText = safeText.replace(/\n/g, '<br>');
        return safeText;
    }

    async function sendMessage() {
        var text = inputEl.value.trim();
        if (!text) return;
        
        var msgs = document.getElementById('chatMessages');
        var userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg user';
        userMsgDiv.innerText = text;
        msgs.appendChild(userMsgDiv);
        
        inputEl.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        var loadingDiv = document.createElement('div');
        loadingDiv.className = 'msg bot termuxpert-loading';
        loadingDiv.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(loadingDiv);
        msgs.scrollTop = msgs.scrollHeight;

        try {
            var resp = await fetch('https://termuxpert-termuxpert-chat.hf.space/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: text })
            });
            var data = await resp.json();
            loadingDiv.remove();
            
            var botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'msg bot';
            botMsgDiv.innerHTML = formatBotResponse(data.answer);
            msgs.appendChild(botMsgDiv);
        } catch(e) {
            loadingDiv.remove();
            var errorDiv = document.createElement('div');
            errorDiv.className = 'msg bot';
            errorDiv.innerText = '⚠️ تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل الـ Space وإعادة المحاولة.';
            msgs.appendChild(errorDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    }
})();
rDiv);
        }
        msgs.scrollTop = msgs.scrollHeight;
    }
})();

```
