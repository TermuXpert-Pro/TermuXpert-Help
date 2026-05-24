(function () {
  // ─── سجل المحادثة لإرسال السياق مع كل سؤال ───────────────────────────────
  var conversationHistory = [];
  var MAX_HISTORY = 10; // نحتفظ بآخر 10 رسائل فقط لتجنّب ثقل الطلب

  // ─── Preload: نوقظ الخادم فور فتح الصفحة ────────────────────────────────
  setTimeout(function () {
    fetch("https://termuxpert-termuxpert-chat.hf.space/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "ping", history: [] }),
    }).catch(function () {});
  }, 500); // أسرع من قبل (500ms بدلاً من 2000ms)

  // ─── CSS ──────────────────────────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = `
    .termuxpert-chat-btn{position:fixed;bottom:24px;right:24px;z-index:9999;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:26px;cursor:pointer;box-shadow:0 8px 32px rgba(69,162,158,0.4);display:flex;align-items:center;justify-content:center;transition:all 0.3s}
    .termuxpert-chat-btn:hover{transform:scale(1.08)}
    .termuxpert-chat-box{position:fixed;bottom:100px;right:24px;z-index:9998;width:400px;height:560px;background:#15171E;border:1px solid #2A3340;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.6);display:none;flex-direction:column;overflow:hidden;transition:opacity 0.2s,transform 0.2s}
    .termuxpert-chat-box.open{display:flex;animation:slideUp 0.25s ease}
    @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    .termuxpert-chat-header{background:linear-gradient(135deg,#1F2833,#1a1f2b);padding:14px 18px;border-bottom:1px solid #2A3340;display:flex;align-items:center;gap:12px}
    .termuxpert-chat-header .icon{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);display:flex;align-items:center;justify-content:center;font-size:20px;color:#0B0C10;flex-shrink:0}
    .termuxpert-chat-header .title{color:#FFF;font-weight:700;font-size:15px}
    .termuxpert-chat-header .status{font-size:11px;color:#06D6A0}
    .termuxpert-chat-header .header-actions{margin-left:auto;display:flex;gap:8px;align-items:center}
    .termuxpert-chat-header .clear-btn{background:rgba(255,255,255,0.08);border:none;color:#8A8D93;padding:4px 10px;border-radius:12px;cursor:pointer;font-size:11px;font-family:Cairo,sans-serif}
    .termuxpert-chat-header .clear-btn:hover{background:rgba(255,255,255,0.15);color:#FFF}
    .termuxpert-chat-header .close-btn{background:rgba(255,255,255,0.1);border:none;color:#8A8D93;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center}
    .termuxpert-chat-header .close-btn:hover{background:rgba(239,71,111,0.3);color:#EF476F}
    .termuxpert-chat-messages{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
    .termuxpert-msg{max-width:88%;animation:msgIn 0.25s ease}
    @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .termuxpert-msg.user{align-self:flex-end}
    .termuxpert-msg.bot{align-self:flex-start}
    .termuxpert-msg .bubble{padding:12px 16px;border-radius:18px;font-size:13.5px;line-height:1.75;word-wrap:break-word;white-space:pre-wrap}
    .termuxpert-msg.user .bubble{background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border-bottom-right-radius:4px}
    .termuxpert-msg.bot .bubble{background:#1F2833;color:#E0E0E0;border-bottom-left-radius:4px;border:1px solid #2A3340}
    .termuxpert-msg .time{font-size:10px;color:#8A8D93;margin-top:4px}
    .termuxpert-msg.user .time{text-align:right}
    /* كود مميَّز */
    .termuxpert-msg .bubble code{background:#0B0C10;color:#66FCF1;padding:2px 6px;border-radius:5px;font-family:monospace;font-size:12.5px}
    .termuxpert-msg .bubble pre{background:#0B0C10;border:1px solid #2A3340;border-radius:10px;padding:12px;overflow-x:auto;margin:8px 0}
    .termuxpert-msg .bubble pre code{background:none;padding:0;color:#66FCF1}
    /* Typing */
    .termuxpert-typing{display:flex;gap:4px;padding:4px 0}
    .termuxpert-typing span{width:7px;height:7px;background:#45A29E;border-radius:50%;animation:bounce 1.4s infinite ease-in-out both}
    .termuxpert-typing span:nth-child(1){animation-delay:-0.32s}
    .termuxpert-typing span:nth-child(2){animation-delay:-0.16s}
    @keyframes bounce{0%,80%,100%{transform:scale(0.4)}40%{transform:scale(1)}}
    /* شريط الإدخال */
    .termuxpert-chat-input{display:flex;padding:14px;border-top:1px solid #2A3340;gap:8px;background:#15171E;align-items:center}
    .termuxpert-chat-input input{flex:1;padding:12px 16px;border-radius:25px;background:#1F2833;border:1px solid #2A3340;color:#FFF;font-family:Cairo,sans-serif;font-size:13px;transition:border-color 0.2s}
    .termuxpert-chat-input input:focus{border-color:#45A29E;outline:none}
    .termuxpert-chat-input input::placeholder{color:#555}
    .termuxpert-chat-input button{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#45A29E,#66FCF1);color:#0B0C10;border:none;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.25s;flex-shrink:0}
    .termuxpert-chat-input button:hover{transform:scale(1.07)}
    .termuxpert-chat-input button:disabled{opacity:0.45;cursor:not-allowed;transform:none}
    /* Quick suggestions */
    .termuxpert-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px 12px}
    .termuxpert-suggestions button{background:#1F2833;border:1px solid #2A3340;color:#C5C6C7;border-radius:20px;padding:5px 12px;font-size:11.5px;cursor:pointer;font-family:Cairo,sans-serif;transition:all 0.2s;white-space:nowrap}
    .termuxpert-suggestions button:hover{border-color:#45A29E;color:#66FCF1}
    /* Retry */
    .termuxpert-retry{font-size:11px;color:#EF476F;cursor:pointer;margin-top:4px;text-decoration:underline}
    @media(max-width:480px){
      .termuxpert-chat-box{width:100vw;height:100dvh;bottom:0;right:0;border-radius:0}
      .termuxpert-chat-btn{bottom:16px;right:16px;width:56px;height:56px;font-size:24px}
    }
  `;
  document.head.appendChild(style);

  // ─── HTML ─────────────────────────────────────────────────────────────────
  var html = `
    <button class="termuxpert-chat-btn" title="TermuXpert">💬</button>
    <div class="termuxpert-chat-box" id="termuxpertBox">
      <div class="termuxpert-chat-header">
        <div class="icon">🤖</div>
        <div class="info">
          <div class="title">TermuXpert AI</div>
          <div class="status" id="termuxpertStatus">متصل ✓</div>
        </div>
        <div class="header-actions">
          <button class="clear-btn" id="termuxpertClear">🗑 مسح</button>
          <button class="close-btn" id="termuxpertClose">✕</button>
        </div>
      </div>
      <div class="termuxpert-chat-messages" id="termuxpertMessages">
        <div class="termuxpert-msg bot">
          <div class="bubble">👋 أهلًا! أنا <b>TermuXpert</b>، خبير أوامر Termux.<br>اسألني عن أي أمر، حزمة، أو مشكلة وسأساعدك! 🚀</div>
          <div class="time">الآن</div>
        </div>
      </div>
      <div class="termuxpert-suggestions" id="termuxpertSuggestions">
        <button>كيف أحدّث الحزم؟</button>
        <button>تثبيت Python</button>
        <button>أوامر Git الأساسية</button>
        <button>إصلاح خطأ في pkg</button>
      </div>
      <div class="termuxpert-chat-input">
        <input type="text" id="termuxpertInput" placeholder="اكتب سؤالك..." autocomplete="off" maxlength="500">
        <button id="termuxpertSend">➤</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  // ─── عناصر DOM ────────────────────────────────────────────────────────────
  var box      = document.getElementById("termuxpertBox");
  var msgs     = document.getElementById("termuxpertMessages");
  var input    = document.getElementById("termuxpertInput");
  var sendBtn  = document.getElementById("termuxpertSend");
  var statusEl = document.getElementById("termuxpertStatus");
  var isLoading = false;
  var lastQuestion = "";

  // ─── فتح / إغلاق ──────────────────────────────────────────────────────────
  document.querySelector(".termuxpert-chat-btn").addEventListener("click", function () {
    box.classList.toggle("open");
    if (box.classList.contains("open")) input.focus();
  });
  document.getElementById("termuxpertClose").addEventListener("click", function () {
    box.classList.remove("open");
  });

  // ─── مسح المحادثة ─────────────────────────────────────────────────────────
  document.getElementById("termuxpertClear").addEventListener("click", function () {
    conversationHistory = [];
    msgs.innerHTML = `
      <div class="termuxpert-msg bot">
        <div class="bubble">🔄 تمت إعادة المحادثة. كيف يمكنني مساعدتك؟</div>
        <div class="time">${getTime()}</div>
      </div>`;
  });

  // ─── الاقتراحات السريعة ────────────────────────────────────────────────────
  document.getElementById("termuxpertSuggestions").addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      input.value = e.target.textContent;
      sendMessage();
    }
  });

  // ─── إرسال ────────────────────────────────────────────────────────────────
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !isLoading) sendMessage();
  });

  // ─── دوال مساعدة ──────────────────────────────────────────────────────────
  function getTime() {
    var now = new Date();
    return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  }

  function formatText(text) {
    // تنسيق الكود بين backticks
    text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    // نقاط bullet
    text = text.replace(/^\s*[-•]\s+(.+)$/gm, "• $1");
    // سطر جديد
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  function addMessage(text, type, withRetry) {
    var div = document.createElement("div");
    div.className = "termuxpert-msg " + type;

    var bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = formatText(text);
    div.appendChild(bubble);

    if (withRetry) {
      var retry = document.createElement("div");
      retry.className = "termuxpert-retry";
      retry.textContent = "🔄 أعد المحاولة";
      retry.addEventListener("click", function () {
        input.value = lastQuestion;
        sendMessage();
      });
      div.appendChild(retry);
    }

    var time = document.createElement("div");
    time.className = "time";
    time.textContent = getTime();
    div.appendChild(time);

    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "termuxpert-msg bot";
    div.id = "typingIndicator";
    div.innerHTML = '<div class="bubble"><div class="termuxpert-typing"><span></span><span></span><span></span></div></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("typingIndicator");
    if (el) el.remove();
  }

  function setStatus(online) {
    statusEl.textContent = online ? "متصل ✓" : "غير متصل ✗";
    statusEl.style.color = online ? "#06D6A0" : "#EF476F";
  }

  // ─── الإرسال الرئيسي مع دعم السياق + retry ────────────────────────────────
  async function sendMessage() {
    var text = input.value.trim();
    if (!text || isLoading) return;

    lastQuestion = text;
    isLoading = true;
    sendBtn.disabled = true;
    input.value = "";

    // إضافة رسالة المستخدم للسجل
    conversationHistory.push({ role: "user", content: text });
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }

    addMessage(text, "user");
    showTyping();

    // محاولتان في حالة الفشل
    var attempts = 0;
    var success = false;

    while (attempts < 2 && !success) {
      attempts++;
      try {
        var controller = new AbortController();
        var timeout = setTimeout(function () { controller.abort(); }, 15000); // 15 ثانية حد أقصى

        var resp = await fetch("https://termuxpert-termuxpert-chat.hf.space/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text,
            history: conversationHistory.slice(0, -1), // أرسل السياق بدون السؤال الحالي
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!resp.ok) throw new Error("HTTP " + resp.status);

        var data = await resp.json();
        var answer = data.answer || "⚠️ لم أستطع الإجابة على هذا السؤال.";

        hideTyping();
        addMessage(answer, "bot");

        // أضف رد البوت للسجل
        conversationHistory.push({ role: "assistant", content: answer });
        if (conversationHistory.length > MAX_HISTORY) {
          conversationHistory = conversationHistory.slice(-MAX_HISTORY);
        }

        setStatus(true);
        success = true;
      } catch (e) {
        if (attempts >= 2) {
          hideTyping();
          var errMsg = e.name === "AbortError"
            ? "⏱️ انتهت مهلة الاتصال. تأكد من اتصالك بالإنترنت."
            : "⚠️ خطأ في الاتصال بالخادم.";
          addMessage(errMsg, "bot", true);
          setStatus(false);
        } else {
          // انتظر قليلاً قبل المحاولة الثانية
          await new Promise(function (r) { setTimeout(r, 1000); });
        }
      }
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }
})();
