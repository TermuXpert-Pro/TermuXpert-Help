(function () {
  "use strict";

  var API       = "https://termuxpert-termuxpert-chat.hf.space/ask";
  var PING_URL  = "https://termuxpert-termuxpert-chat.hf.space/";
  var TIMEOUT_MS = 90000;
  var MAX_RETRIES = 3;

  var loading    = false;
  var lastQ      = "";
  var cache      = {};
  var spaceReady = false;

  // 🧠 المتغيرات الجديدة للذاكرة والذكاء
  var conversationHistory = []; // تخزين آخر 10 رسائل للسياق
  var SYSTEM_PROMPT = `أنت TermuXpert، خبير أوامر Termux حصراً. تجيب بالعربية الفصحى أو العامية المفهومة. تقدم الأوامر الجاهزة للنسخ داخل علامات \` ... \`. أنت لطيف ومفيد ومباشر.`;
  
  // 🎯 اقتراحات ذكية (تظهر تحت الرد)
  var SMART_SUGGESTIONS = {
    "default": ["كيف أثبت بايثون؟", "ما هي أوامر الملفات؟", "كيف أحل مشكلة pkg؟"],
    "تثبيت|pkg install|apt|حزمة|packages": ["كيف أحدث الحزم؟", "كيف أبحث عن حزمة؟", "كيف أحذف حزمة؟"],
    "خطأ|مشكلة|error|failed|لا يعمل|issue": ["كيف أصلح مشكلة pkg؟", "كيف أتحقق من الاتصال؟", "كيف أشخص خطأ؟"],
    "ssh|اتصال|خادم|server": ["كيف أعد SSH؟", "كيف أتصل بخادم؟", "كيف أولد مفتاح SSH؟"],
    "git|مستودع|clone|commit": ["كيف أرفع لمستودع؟", "كيف أحل تعارض؟", "كيف أنشئ فرعاً؟"],
    "python|pip|بايثون": ["كيف أثبت pip؟", "كيف أنشئ بيئة افتراضية؟", "كيف أثبت مكتبة؟"]
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Keep-alive (دون تغيير)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function ping() {
    return fetch(PING_URL, { method: "GET", keepalive: true, cache: "no-store" })
      .then(function(r) { if (r.ok) spaceReady = true; })
      .catch(function(){});
  }
  ping();
  setTimeout(ping, 4000);
  setTimeout(ping, 10000);
  setInterval(ping, 240000);

  ["preconnect","dns-prefetch"].forEach(function(rel) {
    var l = document.createElement("link");
    l.rel = rel; l.href = "https://termuxpert-termuxpert-chat.hf.space";
    document.head.appendChild(l);
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CSS (مضافاً إليه أنماط العناصر الجديدة)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  var CSS = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Cairo:wght@400;500;600;700;800&display=swap');
    :root {
      --tx-bg: #07090F;
      --tx-surface: #0D1117;
      --tx-surface2: #111822;
      --tx-border: #1C2433;
      --tx-border2: #243040;
      --tx-accent: #00E5C3;
      --tx-accent2: #3B82F6;
      --tx-accent3: #8B5CF6;
      --tx-danger: #F43F5E;
      --tx-warn: #F59E0B;
      --tx-text: #C9D5E8;
      --tx-text2: #8896AB;
      --tx-muted: #3D4F63;
      --tx-user-bg: linear-gradient(135deg, #00C9A7 0%, #00E5C3 50%, #06B6D4 100%);
      --tx-glow: 0 0 30px rgba(0,229,195,0.12);
      --tx-glow2: 0 0 20px rgba(59,130,246,0.10);
      --tx-radius: 20px;
      --tx-font: 'Cairo', sans-serif;
      --tx-mono: 'IBM Plex Mono', monospace;
      --tx-shadow: 0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,229,195,0.06);
    }

    /* ═══ FAB (دون تغيير) ═══ */
    .tx-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 99999;
      width: 62px; height: 62px; border-radius: 50%; border: none;
      background: var(--tx-bg);
      box-shadow: 0 0 0 1.5px var(--tx-accent), var(--tx-glow), 0 10px 40px rgba(0,0,0,0.7);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
    }
    .tx-fab::before {
      content: ''; position: absolute; inset: -4px; border-radius: 50%;
      background: conic-gradient(from 0deg, var(--tx-accent), var(--tx-accent2), var(--tx-accent3), var(--tx-accent));
      opacity: 0; transition: opacity .3s; z-index: -1;
      animation: tx-spin 3s linear infinite;
    }
    .tx-fab:hover::before { opacity: 0.6; }
    .tx-fab:hover { transform: scale(1.08); box-shadow: 0 0 0 2px var(--tx-accent), 0 0 50px rgba(0,229,195,0.3), 0 16px 50px rgba(0,0,0,0.8); }
    @keyframes tx-spin { to { transform: rotate(360deg); } }
    .tx-fab svg { width: 26px; height: 26px; position: relative; z-index: 1; }
    .tx-fab .tx-unread {
      position: absolute; top: 6px; right: 6px;
      width: 12px; height: 12px; background: var(--tx-danger);
      border-radius: 50%; border: 2px solid var(--tx-bg);
      animation: tx-pulse 2s infinite;
    }
    @keyframes tx-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.6} }

    /* ═══ BOX (دون تغيير) ═══ */
    .tx-box {
      position: fixed; bottom: 108px; right: 28px; z-index: 99998;
      width: 430px; height: 620px;
      background: var(--tx-bg);
      border: 1px solid var(--tx-border);
      border-radius: var(--tx-radius);
      box-shadow: var(--tx-shadow);
      display: none; flex-direction: column; overflow: hidden;
      font-family: var(--tx-font);
    }
    .tx-box.open {
      display: flex;
      animation: tx-slide-in .35s cubic-bezier(.34,1.3,.64,1) both;
    }
    @keyframes tx-slide-in {
      from { opacity:0; transform: translateY(24px) scale(.94); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }

    /* شريط التقدم */
    .tx-progress {
      height: 2px; width: 0%; position: absolute; top: 0; left: 0; z-index: 20;
      background: linear-gradient(90deg, var(--tx-accent), var(--tx-accent2), var(--tx-accent3));
      transition: width .25s linear;
      box-shadow: 0 0 10px var(--tx-accent);
    }

    /* ═══ HEADER (دون تغيير) ═══ */
    .tx-header {
      background: linear-gradient(180deg, #0A0E18 0%, var(--tx-bg) 100%);
      border-bottom: 1px solid var(--tx-border);
      padding: 15px 16px; display: flex; align-items: center; gap: 12px;
      position: relative; flex-shrink: 0;
    }
    .tx-header::after {
      content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--tx-accent), transparent);
      opacity: 0.3;
    }
    .tx-avatar {
      width: 44px; height: 44px; border-radius: 14px; flex-shrink: 0;
      background: linear-gradient(135deg, #0D1A2A, #0D2020);
      border: 1.5px solid rgba(0,229,195,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 20px rgba(0,229,195,0.15), inset 0 1px 0 rgba(255,255,255,0.05);
      position: relative; overflow: hidden;
    }
    .tx-avatar::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(circle at 30% 30%, rgba(0,229,195,0.1), transparent 70%);
    }
    .tx-title-wrap { flex: 1; min-width: 0; }
    .tx-title { color: #fff; font-weight: 800; font-size: 15px; letter-spacing: -.2px; }
    .tx-subtitle { font-size: 11px; color: var(--tx-muted); font-weight: 500; margin-top: 1px; }
    .tx-status {
      font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 5px;
      transition: color .3s; margin-top: 3px;
    }
    .tx-status.online  { color: var(--tx-accent); }
    .tx-status.offline { color: var(--tx-danger); }
    .tx-status.waiting { color: var(--tx-warn); }
    .tx-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .tx-status.online .tx-status-dot { animation: tx-dot-blink 2.5s infinite; }
    @keyframes tx-dot-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
    .tx-head-right { display: flex; gap: 6px; margin-left: auto; }
    .tx-icon-btn {
      background: rgba(255,255,255,0.04); border: 1px solid var(--tx-border);
      color: var(--tx-muted); width: 32px; height: 32px; border-radius: 10px;
      cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center;
      transition: all .2s; font-family: var(--tx-font);
    }
    .tx-icon-btn:hover { background: rgba(0,229,195,0.08); border-color: rgba(0,229,195,0.4); color: var(--tx-accent); }
    .tx-icon-btn.danger:hover { background: rgba(244,63,94,0.1); border-color: rgba(244,63,94,0.4); color: var(--tx-danger); }

    /* ═══ MESSAGES (دون تغيير) ═══ */
    .tx-msgs {
      flex: 1; overflow-y: auto; padding: 18px 16px;
      display: flex; flex-direction: column; gap: 14px;
      scroll-behavior: smooth;
    }
    .tx-msgs::-webkit-scrollbar { width: 3px; }
    .tx-msgs::-webkit-scrollbar-track { background: transparent; }
    .tx-msgs::-webkit-scrollbar-thumb { background: var(--tx-border2); border-radius: 3px; }

    .tx-msg { max-width: 88%; animation: tx-msg-in .3s cubic-bezier(.34,1.4,.64,1) both; }
    @keyframes tx-msg-in { from{opacity:0;transform:translateY(14px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .tx-msg.user { align-self: flex-end; }
    .tx-msg.bot  { align-self: flex-start; }

    .tx-bubble {
      padding: 11px 15px; font-size: 13.5px; line-height: 1.8;
      word-wrap: break-word; border-radius: 18px;
    }
    .tx-msg.user .tx-bubble {
      background: var(--tx-user-bg); color: #021a14; font-weight: 600;
      border-bottom-right-radius: 5px;
      box-shadow: 0 6px 24px rgba(0,229,195,0.22);
    }
    .tx-msg.bot .tx-bubble {
      background: var(--tx-surface);
      color: var(--tx-text);
      border: 1px solid var(--tx-border);
      border-bottom-left-radius: 5px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }

    /* كود */
    .tx-bubble pre {
      background: #030507; border: 1px solid #1A2535;
      border-radius: 12px; padding: 14px 16px; margin: 10px 0;
      overflow-x: auto; position: relative;
    }
    .tx-bubble pre code {
      font-family: var(--tx-mono); font-size: 12px; color: #00E5C3;
      line-height: 1.65; display: block;
    }
    .tx-bubble code {
      font-family: var(--tx-mono); background: #030507; color: #00E5C3;
      padding: 2px 7px; border-radius: 6px; font-size: 12px;
      border: 1px solid #1A2535;
    }
    .tx-copy-btn {
      position: absolute; top: 9px; right: 9px;
      background: rgba(0,229,195,0.08); border: 1px solid rgba(0,229,195,0.2);
      color: var(--tx-accent); padding: 3px 10px; border-radius: 6px;
      font-size: 10px; cursor: pointer; opacity: 0; transition: opacity .2s;
      font-family: var(--tx-font);
    }
    .tx-bubble pre:hover .tx-copy-btn { opacity: 1; }
    .tx-copy-btn:hover { background: rgba(0,229,195,0.15); }

    .tx-meta {
      font-size: 10px; color: var(--tx-muted); margin-top: 5px;
      display: flex; align-items: center; gap: 6px;
    }
    .tx-msg.user .tx-meta { justify-content: flex-end; }
    .tx-retry-btn {
      color: var(--tx-danger); cursor: pointer; font-size: 10px;
      text-decoration: none; background: none; border: none; padding: 0;
      font-family: var(--tx-font); display: flex; align-items: center; gap: 3px;
    }
    .tx-retry-btn:hover { text-decoration: underline; }

    /* شريط الانتظار */
    .tx-wait-bar {
      align-self: flex-start; background: var(--tx-surface);
      border: 1px solid var(--tx-border); border-radius: 12px;
      padding: 9px 14px; font-size: 11px; color: var(--tx-text2);
      display: flex; align-items: center; gap: 10px;
    }
    .tx-wait-track { width: 90px; height: 3px; background: var(--tx-border); border-radius: 3px; overflow: hidden; }
    .tx-wait-fill {
      height: 3px; border-radius: 3px;
      background: linear-gradient(90deg, var(--tx-accent), var(--tx-accent2));
      transition: width 1s linear;
    }

    /* مؤشر الكتابة */
    .tx-typing-wrap { align-self: flex-start; display: flex; align-items: center; gap: 10px; }
    .tx-typing {
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      border-radius: 18px; border-bottom-left-radius: 5px;
      padding: 13px 18px; display: flex; gap: 5px;
    }
    .tx-typing span {
      width: 7px; height: 7px; background: var(--tx-accent);
      border-radius: 50%; animation: tx-bounce 1.3s infinite ease-in-out both;
    }
    .tx-typing span:nth-child(1){animation-delay:-.32s}
    .tx-typing span:nth-child(2){animation-delay:-.16s}
    @keyframes tx-bounce {
      0%,80%,100%{transform:scale(.3);opacity:.3}
      40%{transform:scale(1);opacity:1}
    }
    .tx-typing-label { font-size: 11px; color: var(--tx-muted); }

    /* ═══ CHIPS (دون تغيير) ═══ */
    .tx-chips {
      padding: 4px 14px 10px;
      display: flex; flex-wrap: wrap; gap: 6px;
      flex-shrink: 0;
    }
    .tx-chip, .tx-suggest-btn {
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      color: var(--tx-text2); border-radius: 20px;
      padding: 5px 13px; font-size: 11.5px; cursor: pointer;
      font-family: var(--tx-font); transition: all .2s;
      white-space: nowrap;
    }
    .tx-chip:hover, .tx-suggest-btn:hover {
      border-color: rgba(0,229,195,0.5); color: var(--tx-accent);
      background: rgba(0,229,195,0.05); transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,229,195,0.1);
    }

    /* ✨ اقتراحات ذكية */
    .tx-suggestions {
      align-self: flex-start; display: flex; flex-wrap: wrap; gap: 6px;
      margin-top: -8px; padding-left: 16px;
    }

    /* ✨ أزرار التقييم */
    .tx-feedback {
      display: flex; gap: 4px; margin-top: 6px;
    }
    .tx-fb-btn {
      background: none; border: 1px solid var(--tx-border);
      border-radius: 6px; padding: 2px 6px; cursor: pointer;
      font-size: 12px; opacity: 0.5; transition: opacity .2s;
    }
    .tx-fb-btn:hover { opacity: 1; }

    /* ═══ INPUT BAR (دون تغيير) ═══ */
    .tx-bar {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 14px; border-top: 1px solid var(--tx-border);
      background: rgba(7,9,15,0.95); backdrop-filter: blur(12px);
      flex-shrink: 0;
    }
    .tx-input {
      flex: 1; padding: 11px 16px; border-radius: 22px;
      background: var(--tx-surface); border: 1px solid var(--tx-border);
      color: var(--tx-text); font-family: var(--tx-font); font-size: 13.5px;
      outline: none; transition: border-color .2s, box-shadow .2s;
      resize: none; height: 44px; max-height: 120px;
      overflow-y: hidden; line-height: 1.5;
    }
    .tx-input:focus {
      border-color: rgba(0,229,195,0.5);
      box-shadow: 0 0 0 3px rgba(0,229,195,0.07);
    }
    .tx-input::placeholder { color: var(--tx-muted); }
    .tx-send {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #00C9A7, #00E5C3);
      color: #021a14; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .25s cubic-bezier(.34,1.56,.64,1);
      box-shadow: 0 4px 18px rgba(0,229,195,0.28);
    }
    .tx-send:hover:not(:disabled) {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(0,229,195,0.45);
    }
    .tx-send:disabled { opacity: .35; cursor: not-allowed; transform: none; }

    /* ═══ RESPONSIVE (دون تغيير) ═══ */
    @media(max-width:480px) {
      .tx-box { width:100vw; height:100dvh; bottom:0; right:0; border-radius:0; }
      .tx-fab { bottom:20px; right:20px; }
    }
  `;

  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HTML (دون تغيير)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  var HTML = `
    <button class="tx-fab" id="txFab" aria-label="TermuXpert Chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="#00E5C3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
      </svg>
      <span class="tx-unread" id="txUnread" style="display:none"></span>
    </button>

    <div class="tx-box" id="txBox">
      <div class="tx-progress" id="txProgress"></div>

      <div class="tx-header">
        <div class="tx-avatar">🤖</div>
        <div class="tx-title-wrap">
          <div class="tx-title">TermuXpert AI</div>
          <div class="tx-subtitle">مساعد Termux الذكي</div>
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
            👋 مرحباً! أنا <b>TermuXpert</b> — مساعدك الذكي لـ Termux.<br>
            اسألني عن أي أمر، حزمة، أو مشكلة تقنية! ⚡
          </div>
          <div class="tx-meta"><span>الآن</span></div>
        </div>
      </div>

      <div class="tx-chips" id="txChips">
        <button class="tx-chip">pkg update</button>
        <button class="tx-chip">تثبيت Python</button>
        <button class="tx-chip">إعداد SSH</button>
        <button class="tx-chip">حل مشكلة pkg</button>
        <button class="tx-chip">من صنعك؟</button>
      </div>

      <div class="tx-bar">
        <textarea
          class="tx-input" id="txInput"
          placeholder="اسألني عن Termux..." rows="1" maxlength="500"
        ></textarea>
        <button class="tx-send" id="txSend">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
               stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", HTML);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // عناصر الواجهة (دون تغيير)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  var fab        = document.getElementById("txFab");
  var box        = document.getElementById("txBox");
  var msgs       = document.getElementById("txMsgs");
  var input      = document.getElementById("txInput");
  var sendBtn    = document.getElementById("txSend");
  var statusEl   = document.getElementById("txStatus");
  var statusText = document.getElementById("txStatusText");
  var progress   = document.getElementById("txProgress");
  var unread     = document.getElementById("txUnread");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✨ دوال ذكية جديدة
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 1. تحليل نية المستخدم
  function detectIntent(text) {
    var intents = {
      "تثبيت|pkg install|apt|حزمة|packages|نصب|ثبت": "install",
      "خطأ|مشكلة|error|failed|لا يعمل|issue|علّق|عطلان": "problem",
      "شكراً|ممتاز|رائع|يعطيك العافية": "positive",
      "مرحبا|السلام|هاي|أهلاً": "greeting"
    };
    for (var pattern in intents) {
      if (new RegExp(pattern).test(text)) {
        return intents[pattern];
      }
    }
    return "general";
  }

  // 2. إظهار اقتراحات ذكية تحت الرد
  function showSuggestions(botMessageText) {
    var suggestions = SMART_SUGGESTIONS["default"];
    Object.keys(SMART_SUGGESTIONS).forEach(function(keyword) {
      if (keyword !== "default" && new RegExp(keyword).test(botMessageText)) {
        suggestions = SMART_SUGGESTIONS[keyword];
      }
    });
    var suggestDiv = document.createElement("div");
    suggestDiv.className = "tx-suggestions";
    suggestDiv.innerHTML = suggestions.map(function(s) {
      return '<button class="tx-suggest-btn" onclick="window._txQuickSend(\'' + s + '\')">' + s + '</button>';
    }).join("");
    msgs.appendChild(suggestDiv);
    msgs.scrollTop = msgs.scrollHeight;
  }

  // 3. إضافة أزرار تقييم لرسالة البوت
  function addFeedbackButtons(botMsgDiv) {
    var fb = document.createElement("div");
    fb.className = "tx-feedback";
    fb.innerHTML = '<button class="tx-fb-btn" data-vote="up">👍</button><button class="tx-fb-btn" data-vote="down">👎</button>';
    fb.querySelector(".tx-fb-btn[data-vote='up']").onclick = function() {
      this.style.opacity = "1"; fb.querySelector(".tx-fb-btn[data-vote='down']").style.opacity = "0.5";
    };
    fb.querySelector(".tx-fb-btn[data-vote='down']").onclick = function() {
      this.style.opacity = "1"; fb.querySelector(".tx-fb-btn[data-vote='up']").style.opacity = "0.5";
    };
    botMsgDiv.querySelector(".tx-bubble").appendChild(fb);
  }

  // 4. حفظ آخر المحادثات في Local Storage
  function saveToHistory(userMsg, botMsg) {
    try {
      var history = JSON.parse(localStorage.getItem("tx_history") || "[]");
      history.push({ user: userMsg, bot: botMsg, time: getTime() });
      if (history.length > 5) history.shift();
      localStorage.setItem("tx_history", JSON.stringify(history));
    } catch(e) {}
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // أدوات مساعدة (دون تغيير)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function getTime() {
    var d = new Date();
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  }

  function setStatus(state) {
    var labels = { online:"متصل", offline:"غير متصل", waiting:"جاري الإيقاظ..." };
    statusEl.className = "tx-status " + state;
    statusText.textContent = labels[state] || state;
  }

  function setProgress(pct) {
    progress.style.width = pct + "%";
    if (pct >= 100) setTimeout(function(){ progress.style.width = "0%"; }, 450);
  }

  function fmt(text) {
    text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
      return '<pre><button class="tx-copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)">نسخ</button><code>' + escHtml(code.trim()) + '</code></pre>';
    });
    text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    text = text.replace(/\n/g, "<br>");
    return text;
  }

  function escHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  input.addEventListener("input", function () {
    this.style.height = "44px";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // إضافة رسائل (مُحسَّنة)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function addMsg(text, type, withRetry) {
    var wrap = document.createElement("div");
    wrap.className = "tx-msg " + type;
    var bubble = document.createElement("div");
    bubble.className = "tx-bubble";
    bubble.innerHTML = fmt(text);
    wrap.appendChild(bubble);
    var meta = document.createElement("div");
    meta.className = "tx-meta";
    meta.innerHTML = "<span>" + getTime() + "</span>";
    if (withRetry) {
      var rb = document.createElement("button");
      rb.className = "tx-retry-btn";
      rb.innerHTML = "↺ أعد المحاولة";
      rb.onclick = function() { input.value = lastQ; sendMessage(); };
      meta.appendChild(rb);
    }
    wrap.appendChild(meta);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    return wrap; // نرجع العنصر لإضافة أزرار التقييم
  }

  function showTyping(label) {
    var div = document.createElement("div");
    div.className = "tx-typing-wrap"; div.id = "txTyping";
    div.innerHTML = '<div class="tx-typing"><span></span><span></span><span></span></div>'
      + '<span class="tx-typing-label">' + (label || "يفكر...") + '</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("txTyping");
    if (el) el.remove();
  }

  // (دوال showWaitBar و hideWaitBar دون تغيير)
  var waitTimer = null;
  function showWaitBar(seconds) {
    hideWaitBar();
    var bar = document.createElement("div");
    bar.id = "txWaitBar"; bar.className = "tx-wait-bar";
    bar.innerHTML = '<span id="txWaitSec">⏳ ' + seconds + 'ث</span>'
      + '<div class="tx-wait-track"><div class="tx-wait-fill" id="txWaitFill" style="width:0%"></div></div>';
    msgs.appendChild(bar); msgs.scrollTop = msgs.scrollHeight;
    var elapsed = 0;
    waitTimer = setInterval(function() {
      elapsed++;
      var fill = document.getElementById("txWaitFill");
      var sec  = document.getElementById("txWaitSec");
      if (fill) fill.style.width = Math.min((elapsed/seconds)*100, 100) + "%";
      if (sec)  sec.textContent  = "⏳ " + Math.max(seconds-elapsed, 0) + "ث";
    }, 1000);
  }
  function hideWaitBar() {
    if (waitTimer) { clearInterval(waitTimer); waitTimer = null; }
    var el = document.getElementById("txWaitBar");
    if (el) el.remove();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✨ إرسال السؤال (مُحسَّن بالذاكرة والاقتراحات)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  async function sendMessage() {
    var text = input.value.trim();
    if (!text || loading) return;

    if (text.length > 500) {
      addMsg("⚠️ السؤال طويل جداً، اختصره من فضلك (أقصى 500 حرف).", "bot");
      return;
    }

    var chips = document.getElementById("txChips");
    if (chips) chips.style.display = "none";

    lastQ = text;
    loading = true;
    sendBtn.disabled = true;
    input.value = ""; input.style.height = "44px";

    addMsg(text, "user");
    showTyping("يفكر...");
    setProgress(15);

    var pct = 15;
    var pInterval = setInterval(function() {
      if (pct < 80) { pct += 1.5; progress.style.width = pct + "%"; }
    }, 600);

    // 1. تحديث ذاكرة المحادثة
    conversationHistory.push({ role: "user", content: text });
    if (conversationHistory.length > 10) conversationHistory = conversationHistory.slice(-10);

    for (var attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (!spaceReady && attempt === 1) {
          setStatus("waiting");
          hideTyping();
          showWaitBar(30);
          showTyping("جاري إيقاظ الخادم...");
          await ping();
          await new Promise(function(r){ setTimeout(r, 2000); });
        }

        var ctrl  = new AbortController();
        var timer = setTimeout(function(){ ctrl.abort(); }, TIMEOUT_MS);

        // 2. إرسال السياق والنظام برومبت مع السؤال
        var resp = await fetch(API, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({
            question: text,
            messages: conversationHistory, // التاريخ
            system: SYSTEM_PROMPT,         // النظام برومبت
            consistency: text.length > 50
          }),
          signal:  ctrl.signal,
          keepalive: true,
        });

        clearTimeout(timer);
        if (!resp.ok) throw new Error("HTTP " + resp.status);

        var data   = await resp.json();
        var answer = (data.answer || "").trim() || "⚠️ لم أستطع الإجابة، حاول مرة أخرى.";

        clearInterval(pInterval);
        hideTyping(); hideWaitBar();
        setProgress(100);
        var botDiv = addMsg(answer, "bot");
        cache[lastQ.toLowerCase().trim()] = answer;
        spaceReady = true;
        setStatus("online");

        // 3. إضافة الرد للذاكرة
        conversationHistory.push({ role: "assistant", content: answer });
        if (conversationHistory.length > 10) conversationHistory = conversationHistory.slice(-10);

        // 4. تفعيل الميزات الذكية
        addFeedbackButtons(botDiv);
        showSuggestions(answer);
        saveToHistory(text, answer);

        if (!box.classList.contains("open")) unread.style.display = "block";
        break;

      } catch (e) {
        if (attempt < MAX_RETRIES) {
          hideTyping(); hideWaitBar();
          var waitSec = attempt * 8;
          showWaitBar(waitSec);
          showTyping("محاولة " + (attempt+1) + "/" + MAX_RETRIES + " خلال " + waitSec + "ث...");
          await new Promise(function(r){ setTimeout(r, waitSec * 1000); });
        } else {
          clearInterval(pInterval);
          hideTyping(); hideWaitBar(); setProgress(0);
          var errMsg = e.name === "AbortError"
            ? "⏱️ انتهت المهلة. النموذج مشغول — حاول بعد لحظة."
            : "⚠️ تعذّر الاتصال. تحقق من اتصالك بالإنترنت.";
          addMsg(errMsg, "bot", true);
          setStatus("offline");
        }
      }
    }

    loading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // 5. دالة عامة للإرسال السريع من الاقتراحات
  window._txQuickSend = function(question) {
    input.value = question;
    sendMessage();
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // أحداث الواجهة (مُضافة إليها الاختصارات)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
    cache = {};
    conversationHistory = []; // مسح الذاكرة أيضاً
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

  // ✨ اختصار Ctrl+K لفتح/إغلاق النافذة
  document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      box.classList.toggle("open");
      if (box.classList.contains("open")) {
        unread.style.display = "none";
        input.focus();
      }
    }
  });

})();