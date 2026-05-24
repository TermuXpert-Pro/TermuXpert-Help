(function() {
    var style = document.createElement('style');
    style.textContent = `
        .termuxpert-chat-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 999999 !important;
            width: 60px; height: 60px; border-radius: 50%;
            background: linear-gradient(135deg, #45A29E, #66FCF1);
            color: #0B0C10; border: none; font-size: 28px; cursor: pointer;
            box-shadow: 0 4px 20px rgba(69,162,158,0.4);
            display: flex !important; align-items: center; justify-content: center;
            transition: transform 0.2s ease;
        }
        .termuxpert-chat-btn:hover { transform: translateY(-3px) scale(1.05); }
        .termuxpert-chat-box {
            position: fixed; bottom: 90px; right: 20px; z-index: 999998 !important;
            width: 350px; height: 450px; background: #15171E;
            border: 1px solid #2A3340; border-radius: 16px; display: none;
            flex-direction: column; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .termuxpert-chat-box.open { display: flex !important; }
        .termuxpert-chat-header { background: #1F2833; padding: 12px; display: flex; align-items: center; gap: 10px; }
        .termuxpert-chat-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
        .termuxpert-chat-input { padding: 12px; border-top: 1px solid #2A3340; display: flex; gap: 5px; }
        .termuxpert-chat-input input { flex: 1; padding: 8px; border-radius: 15px; background: #1F2833; border: 1px solid #2A3340; color: #fff; }
    `;
    document.head.appendChild(style);

    var html = '<button class="termuxpert-chat-btn">💬</button><div class="termuxpert-chat-box" id="chatBox"><div class="termuxpert-chat-header">🤖 TermuXpert AI</div><div class="termuxpert-chat-messages" id="chatMessages"><div class="msg">أهلاً! كيف أساعدك؟</div></div><div class="termuxpert-chat-input"><input type="text" id="chatInput" placeholder="اكتب..."> <button id="sendBtn">➤</button></div></div>';
    document.body.insertAdjacentHTML("beforeend", html);

    document.querySelector('.termuxpert-chat-btn').addEventListener('click', () => {
        document.getElementById('chatBox').classList.toggle('open');
    });
})();
