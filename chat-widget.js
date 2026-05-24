(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════════
  //  ⚡ CONFIG
  // ══════════════════════════════════════════════════════════════
  var API = "https://termuxpert-termuxpert-chat.hf.space/ask";
  var MAX_HISTORY = 12;
  var PRELOAD_DELAY = 200;   // ms قبل أول ping
  var STREAM_CHUNK = 18;     // حروف تُكتب دفعة واحدة في تأثير الطباعة
  var STREAM_SPEED = 12;     // ms بين كل دفعة

  // ══════════════════════════════════════════════════════════════
  //  🗂 STATE
  // ══════════════════════════════════════════════════════════════
  var history   = [];
  var loading   = false;
  var lastQ     = "";
  var connected = true;
  // كاش الردود لتسريع نفس السؤال
  var cache     = {};

  // ══════════════════════════════════════════════════════════════
  //  🔥 AGGRESSIVE PRELOAD — 3 موجات للإيقاظ الكامل
  // ══════════════════════════════════════════════════════════════
  function warmUp(delay) {
    setTimeout(function () {
      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: "ping", history: [] }),
        keepalive: true,
      }).catch(function () {});
    }, delay);
  }

  warmUp(PRELOAD_DELAY);       // موجة 1 — أسرع ما يمكن
  warmUp(3000);                // موجة 2 — تأكيد
  warmUp(8000);                // موجة 3 — ضمان كامل

  // Prefetch DNS + TCP مسبقاً
  var preLink = document.createElement("link");
  preLink.rel  = "preconnect";
  preLink.href = "https://termuxpert-termuxpert-chat.hf.space";
  document.head.appendChild(preLink);

  var dnsPrefetch = document.createElement("link");
  dnsPrefetch.rel  = "dns-prefetch";
  dnsPrefetch.href = "https://termuxpert-termuxpert-chat.hf.space";
  document.head.appendChild(dnsPrefetch);

  // ══════════════════════════════════════════════════════════════
  //  🎨 STYLES — Dark Cyberpunk Premium
  // ══════════════════════════════════════════════════════════════
  var CSS = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Tajawal:wght@400;500;700;800&display=swap');

    :root {
      --tx-bg:       #080B12;
      --tx-surface:  #0E1520;
      --tx-border:   #1A2535;
      --tx-accent:   #00E5C3;
      --tx-accent2:  #0096FF;
      --tx-danger:   #FF4466;
      --tx-text:     #D8E0EC;
      --tx-muted:    #4A5568;
      --tx-user-bg:  linear-gradient(135deg,#00C9A7,#00E5C3);
      --tx-glow:     0 0 20px rgba(0,229,195,0.18);
      --tx-radius:   22px;
      --tx-font:     'Tajawal', sans-serif;
      --tx-mono:     'IBM Plex Mono', monospace;
    }

    /* ── توگل Button ──────────────────────── */
    .tx-fab {
      position: fixed; bottom: 26px; right: 26px; z-index: 99999;
      width: 64px; height: 64px; border-radius: 50%; border: none;
      background: var(--tx-bg);
      box-shadow: 0 0 0 2px var(--tx-accent), var(--tx-glow), 0 8px 32px rgba(0,0,0,.6);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s;
      overflow: hidden;
    }
    .tx-fab::before {
      content: ''; position: absolute; inset: 0; border-radius: 50%;
      background: conic-gradient(var(--tx-accent), var(--tx-accent2), var(--tx-accent));
      opacity: 0; transition: opacity .3s;
    }
    .tx-fab:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 0 0 3px var(--tx-accent), 0 0 40px rgba(0,229,195,0.35), 0 12px 40px rgba(0,0,0,.7); }
    .tx-fab:hover::before { opacity: .12; }
    .tx-fab svg { width: 28px; height: 28px; position: relative; z-index: 1; }
    .tx-fab .tx-unread {
      position: absolute; top: 8px; right: 8px; width: 10px; height: 10px;
      background: var(--tx-danger); border-radius: 50%; border: 2px solid var(--tx-bg);
      animation: tx-pulse 1.8s infinite;
    }
    @keyframes tx-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }

    /* ── Chat Box ─────────────────────────── */
    .tx-box {
      position: fixed; bottom: 106px; right: 26px; z-index: 99998;
      width: 420px; height: 600px;
      background: var(--tx-bg);
      border: 1px solid var(--tx-border);
      border-radius: var(--tx-radius);
      box-shadow: 0 0 0 1px rgba(0,229,195,.08), 0 32px 80px rgba(0,0,0,.8), var(--tx-glow);
      display: none; flex-direction: column; overflow: hidden;
      font-family: var(--tx-font);
    }
    .tx-box.open {
      display: flex;
      animation: tx-slide-in .3s cubic-bezier(.34,1.3,.64,1) both;
    }
    @keyframes tx-slide-in {
      from { opacity:0; transform:translateY(20px) scale(.96); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }

    /* ── شريط التحميل العلوي ─────────────── */
    .tx-progress {
      height: 2px; width: 0%; background: linear-gradient(90deg,var(--tx-accent),var(--tx-accent2));
      transition: width .15s linear; position: absolute; top: 0; left: 0; right: 0; z-index: 10;
      box-shadow: 0 0 8px var(--tx-accent);
    }

    /* ── Header ──────────────────────────── */
    .tx-header {
      background: linear-gradient(160deg,#0C1420,#080B12);
      border-bottom: 1px solid var(--tx-border);
      padding: 14px 16px;
      display: flex; align-items: center; gap: 10px;
      position: relative;
    }
    .tx-avatar {
      width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
      background: var(--tx-surface);
      border: 1.5px solid var(--tx-accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 12px rgba(0,229,195,.25);
      animation: tx-avatar-idle 4s ease-in-out infinite;
    }
    @keyframes tx-avatar-idle {
      0%,100% { box-shadow: 0 0 12px rgba(0,229,195,.25); }
      50%      { box-shadow: 0 0 20px rgba(0,229,195,.45); }
    }
    .tx-title { color: #fff; font-weight: 800; font-size: 15px; letter-spacing: .3px; }
    .tx-status {
      font-size: 11px; font-weight: 500; display: flex; align-items: center; gap: 5px;
      transition: color .3s;
    }
    .tx-status.online  { color: var(--tx-accent); }
    .tx-status.offline { color: var(--tx-danger); }
    .tx-status-dot {
      width: 7px; height: 7px; border-radius: 50%; background: currentColor;
      animation: tx-dot-blink 2s infinite;
    }
    @keyframes tx-dot-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    .tx-head-right { margin-left: auto; display: flex; gap: 6px; }
    .tx-icon-btn {
      background: rgba(255,255,255,.06); border: 1px solid var(--tx-border);
      color: var(--tx-muted); width: 32px; height: 32px; border-radius: 10px;
      cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
      transition: all .2s; font-family: var(--tx-font);
    }
    .tx-icon-btn:hover { background: rgba(0,229,195,.1); border-color: var(--tx-accent); color: var(--tx-accent); }
    .tx-icon-btn.danger:hover { background: rgba(255,68,102,.12); border-color: var(--tx-danger); color: var(--tx-danger); }

    /* ── Messages ────────────────────────── */
    .tx-msgs {
      flex: 1; overflow-y: auto; padding: 18px 16px;
      display: flex; flex-direction: column; gap: 16px;
      scroll-behavior: smooth;
    }
    .tx-msgs::-webkit-scrollbar { width: 4px; }
    .tx-msgs::-webkit-scrollbar-track { background: transparent; }
    .tx-msgs::-webkit-scrollbar-thumb { background: var(--tx-border); border-radius: 4px; }

    .tx-msg { max-width: 86%; animation: tx-msg-in .28s cubic-bezier(.34,1.4,.64,1) both; }
    @keyframes tx-msg-in {
      from { opacity:0; transform:translateY(12px) scale(.97); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }
    .tx-msg.user { align-self: flex-end; }
    .tx-msg.bot  { align-self: flex-start; }

    .tx-bubble {
      padding: 11px 15px; border-radius: 18px;
      font-size: 13.5px; line-height: 1.75; word-wrap: break-word;
    }
    .tx-msg.user .tx-bubble {
      background: var(--tx-user-bg);
      color: #051a16; font-weight: 600;
      border-bottom-right-radius: 5px;
      box-shadow: 0 4px 20px rgba(0,229,195,.2);
    }
    .tx-msg.bot .tx-bubble {
      background: var(--tx-surface);
      color: var(--tx-text);
      border: 1px solid var(--tx-border);
      border-bottom-left-radius: 5px;
      box-shadow: 0 4px 16px rgba(0,0,0,.3);
    }

    /* Code blocks */
    .tx-bubble pre {
      background: #040609; border: 1px solid #1e2d3d;
      border-radius: 10px; padding: 12px 14px; margin: 10px 0;
      overflow-x: auto; position: relative;
    }
    .tx-bubble pre code {
      font-family: var(--tx-mono); font-size: 12px; color: #00E5C3;
      line-height: 1.6; display: block;
    }
    .tx-bubble code {
      font-family: var(--tx-mono); background: #040609;
      color: #00E5C3; padding: 2px 7px; border-radius: 5px; font-size: 12px;
      border: 1px solid #1e2d3d;
    }
    .tx-copy-btn {
      position: absolute; top: 8px; right: 8px;
      background: rgba(0,229,195,.1); border: 1px solid rgba(0,229,195,.25);
      color: var(--tx-accent); padding: 3px 8px; border-radius: 6px;
      font-size: 10px; cursor: pointer; font-family: var(--tx-font);
      transition: all .2s; opacity: 0;
    }
    .tx-bubble pre:hover .tx-copy-btn { opacity: 1; }
    .tx-copy-btn:hover { background: rgba(0,229,195,.2); }

    .tx-meta {
      font-size: 10px; color: var(--tx-muted); margin-top: 5px;
      display: flex; align-items: center; gap: 6px;
    }
    .tx-msg.user .tx-meta { justify-content: flex-end; }
    .tx-retry-btn {
      color: var(--tx-danger); cursor: pointer; font-size: 10px; font-family: var(--tx-font);
      text-decoration: underline; background: none; border: none; padding: 0;
    }
    .tx-retry-btn:hover { opacity: .8; }

    /* ── Typing ──────────────────────────── */
    .tx-typing-wrap { align-self: flex-start; display: flex; align-items: center; gap: 10px; }
    .tx-typing {
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      border-radius: 18px; border-bottom-left-radius: 5px;
      padding: 13px 18px; display: flex; gap: 5px; align-items: center;
    }
    .tx-typing span {
      width: 7px; height: 7px; background: var(--tx-accent); border-radius: 50%;
      animation: tx-bounce 1.2s infinite ease-in-out both;
    }
    .tx-typing span:nth-child(1) { animation-delay: -.32s; }
    .tx-typing span:nth-child(2) { animation-delay: -.16s; }
    @keyframes tx-bounce {
      0%,80%,100% { transform:scale(.35); opacity:.4; }
      40%          { transform:scale(1);  opacity:1;   }
    }
    .tx-typing-label { font-size: 11px; color: var(--tx-muted); font-family: var(--tx-font); }

    /* ── Suggestions ─────────────────────── */
    .tx-chips {
      padding: 4px 14px 10px; display: flex; flex-wrap: wrap; gap: 6px;
    }
    .tx-chip {
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      color: #8A97AB; border-radius: 20px; padding: 5px 13px;
      font-size: 11.5px; cursor: pointer; font-family: var(--tx-font);
      transition: all .2s; white-space: nowrap; user-select: none;
    }
    .tx-chip:hover {
      border-color: var(--tx-accent); color: var(--tx-accent);
      background: rgba(0,229,195,.06);
      transform: translateY(-1px);
    }

    /* ── Input Bar ───────────────────────── */
    .tx-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 14px; border-top: 1px solid var(--tx-border);
      background: rgba(8,11,18,.9);
      backdrop-filter: blur(10px);
    }
    .tx-input {
      flex: 1; padding: 11px 16px; border-radius: 22px;
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      color: var(--tx-text); font-family: var(--tx-font); font-size: 13.5px;
      outline: none; transition: border-color .2s, box-shadow .2s;
      resize: none; height: 44px; max-height: 120px; overflow-y: hidden;
      line-height: 1.5;
    }
    .tx-input:focus {
      border-color: var(--tx-accent);
      box-shadow: 0 0 0 3px rgba(0,229,195,.08);
    }
    .tx-input::placeholder { color: var(--tx-muted); }
    .tx-send {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg,#00C9A7,#00E5C3);
      color: #051a16; border: none; font-size: 18px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .25s cubic-bezier(.34,1.56,.64,1);
      box-shadow: 0 4px 16px rgba(0,229,195,.3);
    }
    .tx-send:hover:not(:disabled) { transform: scale(1.1); box-shadow: 0 6px 24px rgba(0,229,195,.45); }
    .tx-send:disabled { opacity:.4; cursor:not-allowed; transform:none; }

    /* ── Responsive ──────────────────────── */
    @media(max-width:480px){
      .tx-box { width:100vw; height:100dvh; bottom:0; right:0; border-radius:0; }
      .tx-fab { bottom:18px; right:18px; }
    }
  `;

  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ══════════════════════════════════════════════════════════════
  //  🏗 HTML
  // ══════════════════════════════════════════════════════════════
  var HTML = `
    <button class="tx-fab" id="txFab" aria-label="TermuXpert Chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5C3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="tx-unread" id="txUnread" style="display:none"></span>
    </button>

    <div class="tx-box" id="txBox">
      <div class="tx-progress" id="txProgress"></div>

      <div class="tx-header">
        <div class="tx-avatar">🤖</div>
        <div>
          <div class="tx-title">TermuXpert AI</div>
          <div class="tx-status online" id="txStatus">
            <span class="tx-status-dot"></span>
            <span id="txStatusText">متصل</span>
          </div>
        </div>
        <div class="tx-head-right">
          <button class="tx-icon-btn" id="txClear" title="مسح المحادثة">🗑</button>
          <button class="tx-icon-btn danger" id="txClose" title="إغلاق">✕</button>
        </div>
      </div>

      <div class="tx-msgs" id="txMsgs">
        <div class="tx-msg bot">
          <div class="tx-bubble">
            👋 مرحباً! أنا <b>TermuXpert</b> — خبيرك في Termux.<br>
            اسألني عن أي أمر، حزمة، سكريبت، أو مشكلة! ⚡
          </div>
          <div class="tx-meta"><span>الآن</span></div>
        </div>
      </div>

      <div class="tx-chips" id="txChips">
        <button class="tx-chip">pkg update</button>
        <button class="tx-chip">تثبيت Python</button>
        <button class="tx-chip">إعداد SSH</button>
        <button class="tx-chip">حل مشكلة pkg</button>
        <button class="tx-chip">Termux API</button>
        <button class="tx-chip">نصائح للمبتدئين</button>
      </div>

      <div class="tx-bar">
        <textarea class="tx-input" id="txInput" placeholder="اكتب سؤالك..." rows="1" maxlength="600"></textarea>
        <button class="tx-send" id="txSend">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", HTML);

  // ══════════════════════════════════════════════════════════════
  //  🎮 ELEMENTS
  // ══════════════════════════════════════════════════════════════
  var fab        = document.getElementById("txFab");
  var box        = document.getElementById("txBox");
  var msgs       = document.getElementById("txMsgs");
  var input      = document.getElementById("txInput");
  var sendBtn    = document.getElementById("txSend");
  var statusEl   = document.getElementById("txStatus");
  var statusText = document.getElementById("txStatusText");
  var progress   = document.getElementById("txProgress");
  var unread     = document.getElementById("txUnread");

  // ══════════════════════════════════════════════════════════════
  //  🔧 UTILS
  // ══════════════════════════════════════════════════════════════
  function getTime() {
    var d = new Date();
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  }

  function setProgress(pct) {
    progress.style.width = pct + "%";
    if (pct >= 100) setTimeout(function(){ progress.style.width = "0%"; }, 400);
  }

  function setConnected(ok) {
    connected = ok;
    statusEl.className = "tx-status " + (ok ? "online" : "offline");
    statusText.textContent = ok ? "متصل" : "غير متصل";
  }

  // ── تنسيق النص (Markdown خفيف) ──────────────────────────────
  function fmt(text) {
    // Code blocks
    text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
      return '<pre><button class="tx-copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)">نسخ</button><code>' + escHtml(code.trim()) + '</code></pre>';
    });
    // Inline code
    text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    // Bullet
    text = text.replace(/^[\s]*[-•]\s+(.+)$/gm, "• $1");
    // Newlines
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  function escHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ── Auto-resize textarea ─────────────────────────────────────
  input.addEventListener("input", function () {
    this.style.height = "44px";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });

  // ══════════════════════════════════════════════════════════════
  //  📝 MESSAGES
  // ══════════════════════════════════════════════════════════════
  function addMsg(text, type, withRetry, skipStream) {
    var wrap = document.createElement("div");
    wrap.className = "tx-msg " + type;

    var bubble = document.createElement("div");
    bubble.className = "tx-bubble";
    wrap.appendChild(bubble);

    var meta = document.createElement("div");
    meta.className = "tx-meta";
    meta.innerHTML = "<span>" + getTime() + "</span>";
    if (withRetry) {
      var rb = document.createElement("button");
      rb.className = "tx-retry-btn";
      rb.textContent = "↺ أعد المحاولة";
      rb.onclick = function() { input.value = lastQ; sendMessage(); };
      meta.appendChild(rb);
    }
    wrap.appendChild(meta);
    msgs.appendChild(wrap);

    if (type === "bot" && !skipStream) {
      // تأثير الطباعة التدريجية (typewriter)
      typeWrite(bubble, fmt(text));
    } else {
      bubble.innerHTML = fmt(text);
    }

    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  function typeWrite(el, html) {
    // نكتب الـ HTML مباشرةً ولكن نظهره حرفاً حرفاً
    var full = html;
    var i = 0;
    var temp = document.createElement("div");
    temp.innerHTML = full;
    var plainText = temp.textContent;

    // نُظهر الـ HTML الكامل ثم نُغطيه بـ overlay شفاف يتراجع
    el.innerHTML = full;
    el.style.opacity = "0";

    // Fade in سريع + تسرب الكتابة
    requestAnimationFrame(function() {
      el.style.transition = "opacity .15s";
      el.style.opacity = "1";
    });
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "tx-typing-wrap";
    div.id = "txTyping";
    div.innerHTML = '<div class="tx-typing"><span></span><span></span><span></span></div><span class="tx-typing-label">يفكر...</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("txTyping");
    if (el) el.remove();
  }

  // ══════════════════════════════════════════════════════════════
  //  🚀 SEND — مع كاش + retry + سياق
  // ══════════════════════════════════════════════════════════════
  async function sendMessage() {
    var text = input.value.trim();
    if (!text || loading) return;

    // إخفاء الاقتراحات بعد أول رسالة
    var chips = document.getElementById("txChips");
    if (chips) { chips.style.display = "none"; }

    // كاش سريع
    var cacheKey = text.toLowerCase().trim();
    if (cache[cacheKey]) {
      addMsg(text, "user", false, true);
      input.value = ""; input.style.height = "44px";
      addMsg(cache[cacheKey], "bot");
      unread.style.display = "none";
      return;
    }

    lastQ   = text;
    loading = true;
    sendBtn.disabled = true;
    input.value = ""; input.style.height = "44px";

    history.push({ role: "user", content: text });
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

    addMsg(text, "user", false, true);
    showTyping();
    setProgress(20);

    // Simulate progress bar growth
    var pInterval = setInterval(function() {
      var cur = parseFloat(progress.style.width) || 20;
      if (cur < 85) progress.style.width = (cur + 3) + "%";
    }, 300);

    var attempts = 0;
    var success  = false;

    while (attempts < 2 && !success) {
      attempts++;
      try {
        var ctrl    = new AbortController();
        var timer   = setTimeout(function(){ ctrl.abort(); }, 18000);

        var resp = await fetch(API, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text,
            history:  history.slice(0, -1),
          }),
          signal:   ctrl.signal,
          keepalive: true,
        });

        clearTimeout(timer);
        clearInterval(pInterval);
        setProgress(100);

        if (!resp.ok) throw new Error("HTTP " + resp.status);

        var data   = await resp.json();
        var answer = data.answer || "⚠️ لم أستطع الإجابة على هذا السؤال.";

        hideTyping();
        addMsg(answer, "bot");

        // حفظ في الكاش
        cache[cacheKey] = answer;

        history.push({ role: "assistant", content: answer });
        if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

        setConnected(true);
        success = true;

        // أظهر إشعار إذا الصندوق مغلق
        if (!box.classList.contains("open")) {
          unread.style.display = "block";
        }

      } catch (e) {
        clearInterval(pInterval);
        setProgress(0);
        if (attempts >= 2) {
          hideTyping();
          var msg = e.name === "AbortError"
            ? "⏱️ انتهت مهلة الاتصال. تحقق من اتصالك."
            : "⚠️ تعذّر الاتصال بالخادم.";
          addMsg(msg, "bot", true, true);
          setConnected(false);
        } else {
          await new Promise(function(r){ setTimeout(r, 1200); });
        }
      }
    }

    loading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ══════════════════════════════════════════════════════════════
  //  🎛 EVENTS
  // ══════════════════════════════════════════════════════════════
  fab.addEventListener("click", function () {
    box.classList.toggle("open");
    if (box.classList.contains("open")) {
      unread.style.display = "none";
      input.focus();
    }
  });

  document.getElementById("txClose").addEventListener("click", function () {
    box.classList.remove("open");
  });

  document.getElementById("txClear").addEventListener("click", function () {
    history = [];
    cache   = {};
    msgs.innerHTML = `
      <div class="tx-msg bot">
        <div class="tx-bubble">🔄 تمت إعادة المحادثة. كيف يمكنني مساعدتك؟</div>
        <div class="tx-meta"><span>${getTime()}</span></div>
      </div>`;
    var chips = document.getElementById("txChips");
    if (chips) chips.style.display = "flex";
  });

  document.getElementById("txChips").addEventListener("click", function (e) {
    if (e.target.classList.contains("tx-chip")) {
      input.value = e.target.textContent;
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  });

  // Shift+Enter = سطر جديد — تلقائياً من خلال textarea

})();
