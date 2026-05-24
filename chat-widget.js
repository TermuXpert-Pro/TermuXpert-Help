(function () {
  "use strict";

  var API          = "https://termuxpert-termuxpert-chat.hf.space/ask";
  var PING_URL     = "https://termuxpert-termuxpert-chat.hf.space/";
  var MAX_HISTORY  = 12;
  var TIMEOUT_MS   = 90000;
  var MAX_RETRIES  = 3;

  var history  = [];
  var loading  = false;
  var lastQ    = "";
  var cache    = {};

  var spaceReady = false;

  function ping() {
    return fetch(PING_URL, {
      method: "GET",
      keepalive: true,
      cache: "no-store",
    }).then(function(r) {
      if (r.ok) spaceReady = true;
    }).catch(function(){});
  }

  ping();
  setTimeout(ping, 4000);
  setTimeout(ping, 10000);
  setInterval(ping, 240000);

  ["preconnect","dns-prefetch"].forEach(function(rel) {
    var l = document.createElement("link");
    l.rel  = rel;
    l.href = "https://termuxpert-termuxpert-chat.hf.space";
    document.head.appendChild(l);
  });

  var CSS = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Tajawal:wght@400;500;700;800&display=swap');
    :root {
      --tx-bg:#080B12; --tx-surface:#0E1520; --tx-border:#1A2535;
      --tx-accent:#00E5C3; --tx-accent2:#0096FF; --tx-danger:#FF4466;
      --tx-text:#D8E0EC; --tx-muted:#4A5568;
      --tx-user-bg:linear-gradient(135deg,#00C9A7,#00E5C3);
      --tx-glow:0 0 20px rgba(0,229,195,0.18);
      --tx-radius:22px; --tx-font:'Tajawal',sans-serif;
      --tx-mono:'IBM Plex Mono',monospace;
    }
    .tx-fab {
      position:fixed; bottom:26px; right:26px; z-index:99999;
      width:64px; height:64px; border-radius:50%; border:none;
      background:var(--tx-bg);
      box-shadow:0 0 0 2px var(--tx-accent),var(--tx-glow),0 8px 32px rgba(0,0,0,.6);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s; overflow:hidden;
    }
    .tx-fab:hover { transform:scale(1.1) rotate(5deg); box-shadow:0 0 0 3px var(--tx-accent),0 0 40px rgba(0,229,195,.35),0 12px 40px rgba(0,0,0,.7); }
    .tx-fab svg { width:28px; height:28px; position:relative; z-index:1; }
    .tx-fab .tx-unread {
      position:absolute; top:8px; right:8px; width:10px; height:10px;
      background:var(--tx-danger); border-radius:50%; border:2px solid var(--tx-bg);
      animation:tx-pulse 1.8s infinite;
    }
    @keyframes tx-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.7} }

    .tx-box {
      position:fixed; bottom:106px; right:26px; z-index:99998;
      width:420px; height:600px; background:var(--tx-bg);
      border:1px solid var(--tx-border); border-radius:var(--tx-radius);
      box-shadow:0 0 0 1px rgba(0,229,195,.08),0 32px 80px rgba(0,0,0,.8),var(--tx-glow);
      display:none; flex-direction:column; overflow:hidden; font-family:var(--tx-font);
    }
    .tx-box.open { display:flex; animation:tx-slide-in .3s cubic-bezier(.34,1.3,.64,1) both; }
    @keyframes tx-slide-in { from{opacity:0;transform:translateY(20px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }

    .tx-progress {
      height:2px; width:0%; background:linear-gradient(90deg,var(--tx-accent),var(--tx-accent2));
      transition:width .2s linear; position:absolute; top:0; left:0; right:0; z-index:10;
      box-shadow:0 0 8px var(--tx-accent);
    }
    .tx-header {
      background:linear-gradient(160deg,#0C1420,#080B12);
      border-bottom:1px solid var(--tx-border); padding:14px 16px;
      display:flex; align-items:center; gap:10px; position:relative;
    }
    .tx-avatar {
      width:42px; height:42px; border-radius:50%; flex-shrink:0;
      background:var(--tx-surface); border:1.5px solid var(--tx-accent);
      display:flex; align-items:center; justify-content:center; font-size:22px;
      box-shadow:0 0 12px rgba(0,229,195,.25); animation:tx-avatar-idle 4s ease-in-out infinite;
    }
    @keyframes tx-avatar-idle { 0%,100%{box-shadow:0 0 12px rgba(0,229,195,.25)} 50%{box-shadow:0 0 20px rgba(0,229,195,.45)} }
    .tx-title { color:#fff; font-weight:800; font-size:15px; letter-spacing:.3px; }
    .tx-status { font-size:11px; font-weight:500; display:flex; align-items:center; gap:5px; transition:color .3s; }
    .tx-status.online  { color:var(--tx-accent); }
    .tx-status.offline { color:var(--tx-danger); }
    .tx-status.waiting { color:#FFD166; }
    .tx-status-dot { width:7px; height:7px; border-radius:50%; background:currentColor; animation:tx-dot-blink 2s infinite; }
    @keyframes tx-dot-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
    .tx-head-right { margin-left:auto; display:flex; gap:6px; }
    .tx-icon-btn {
      background:rgba(255,255,255,.06); border:1px solid var(--tx-border);
      color:var(--tx-muted); width:32px; height:32px; border-radius:10px;
      cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center;
      transition:all .2s; font-family:var(--tx-font);
    }
    .tx-icon-btn:hover { background:rgba(0,229,195,.1); border-color:var(--tx-accent); color:var(--tx-accent); }
    .tx-icon-btn.danger:hover { background:rgba(255,68,102,.12); border-color:var(--tx-danger); color:var(--tx-danger); }

    .tx-msgs {
      flex:1; overflow-y:auto; padding:18px 16px;
      display:flex; flex-direction:column; gap:16px; scroll-behavior:smooth;
    }
    .tx-msgs::-webkit-scrollbar { width:4px; }
    .tx-msgs::-webkit-scrollbar-track { background:transparent; }
    .tx-msgs::-webkit-scrollbar-thumb { background:var(--tx-border); border-radius:4px; }
    .tx-msg { max-width:86%; animation:tx-msg-in .28s cubic-bezier(.34,1.4,.64,1) both; }
    @keyframes tx-msg-in { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    .tx-msg.user { align-self:flex-end; }
    .tx-msg.bot  { align-self:flex-start; }
    .tx-bubble { padding:11px 15px; border-radius:18px; font-size:13.5px; line-height:1.75; word-wrap:break-word; }
    .tx-msg.user .tx-bubble {
      background:var(--tx-user-bg); color:#051a16; font-weight:600;
      border-bottom-right-radius:5px; box-shadow:0 4px 20px rgba(0,229,195,.2);
    }
    .tx-msg.bot .tx-bubble {
      background:var(--tx-surface); color:var(--tx-text);
      border:1px solid var(--tx-border); border-bottom-left-radius:5px;
      box-shadow:0 4px 16px rgba(0,0,0,.3);
    }
    .tx-bubble pre {
      background:#040609; border:1px solid #1e2d3d;
      border-radius:10px; padding:12px 14px; margin:10px 0;
      overflow-x:auto; position:relative;
    }
    .tx-bubble pre code { font-family:var(--tx-mono); font-size:12px; color:#00E5C3; line-height:1.6; display:block; }
    .tx-bubble code { font-family:var(--tx-mono); background:#040609; color:#00E5C3; padding:2px 7px; border-radius:5px; font-size:12px; border:1px solid #1e2d3d; }
    .tx-copy-btn {
      position:absolute; top:8px; right:8px;
      background:rgba(0,229,195,.1); border:1px solid rgba(0,229,195,.25);
      color:var(--tx-accent); padding:3px 8px; border-radius:6px;
      font-size:10px; cursor:pointer; font-family:var(--tx-font); transition:all .2s; opacity:0;
    }
    .tx-bubble pre:hover .tx-copy-btn { opacity:1; }
    .tx-copy-btn:hover { background:rgba(0,229,195,.2); }
    .tx-meta { font-size:10px; color:var(--tx-muted); margin-top:5px; display:flex; align-items:center; gap:6px; }
    .tx-msg.user .tx-meta { justify-content:flex-end; }
    .tx-retry-btn { color:var(--tx-danger); cursor:pointer; font-size:10px; font-family:var(--tx-font); text-decoration:underline; background:none; border:none; padding:0; }

    .tx-typing-wrap { align-self:flex-start; display:flex; align-items:center; gap:10px; }
    .tx-typing {
      background:var(--tx-surface); border:1px solid var(--tx-border);
      border-radius:18px; border-bottom-left-radius:5px;
      padding:13px 18px; display:flex; gap:5px; align-items:center;
    }
    .tx-typing span { width:7px; height:7px; background:var(--tx-accent); border-radius:50%; animation:tx-bounce 1.2s infinite ease-in-out both; }
    .tx-typing span:nth-child(1){animation-delay:-.32s} .tx-typing span:nth-child(2){animation-delay:-.16s}
    @keyframes tx-bounce { 0%,80%,100%{transform:scale(.35);opacity:.4} 40%{transform:scale(1);opacity:1} }
    .tx-typing-label { font-size:11px; color:var(--tx-muted); font-family:var(--tx-font); }

    .tx-wait-bar {
      align-self:flex-start; background:var(--tx-surface);
      border:1px solid var(--tx-border); border-radius:12px; padding:8px 14px;
      font-size:11px; color:var(--tx-muted); display:flex; align-items:center; gap:8px;
    }
    .tx-wait-fill {
      height:3px; background:linear-gradient(90deg,var(--tx-accent),var(--tx-accent2));
      border-radius:3px; transition:width 1s linear;
      box-shadow:0 0 6px var(--tx-accent);
    }
    .tx-wait-track { width:100px; height:3px; background:var(--tx-border); border-radius:3px; overflow:hidden; }

    .tx-chips { padding:4px 14px 10px; display:flex; flex-wrap:wrap; gap:6px; }
    .tx-chip {
      background:var(--tx-surface); border:1px solid var(--tx-border); color:#8A97AB;
      border-radius:20px; padding:5px 13px; font-size:11.5px; cursor:pointer;
      font-family:var(--tx-font); transition:all .2s; white-space:nowrap; user-select:none;
    }
    .tx-chip:hover { border-color:var(--tx-accent); color:var(--tx-accent); background:rgba(0,229,195,.06); transform:translateY(-1px); }

    .tx-bar {
      display:flex; align-items:center; gap:8px;
      padding:12px 14px; border-top:1px solid var(--tx-border);
      background:rgba(8,11,18,.9); backdrop-filter:blur(10px);
    }
    .tx-input {
      flex:1; padding:11px 16px; border-radius:22px;
      background:var(--tx-surface); border:1px solid var(--tx-border);
      color:var(--tx-text); font-family:var(--tx-font); font-size:13.5px;
      outline:none; transition:border-color .2s,box-shadow .2s;
      resize:none; height:44px; max-height:120px; overflow-y:hidden; line-height:1.5;
    }
    .tx-input:focus { border-color:var(--tx-accent); box-shadow:0 0 0 3px rgba(0,229,195,.08); }
    .tx-input::placeholder { color:var(--tx-muted); }
    .tx-send {
      width:44px; height:44px; border-radius:50%; flex-shrink:0;
      background:linear-gradient(135deg,#00C9A7,#00E5C3); color:#051a16;
      border:none; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:all .25s cubic-bezier(.34,1.56,.64,1); box-shadow:0 4px 16px rgba(0,229,195,.3);
    }
    .tx-send:hover:not(:disabled) { transform:scale(1.1); box-shadow:0 6px 24px rgba(0,229,195,.45); }
    .tx-send:disabled { opacity:.4; cursor:not-allowed; transform:none; }
    @media(max-width:480px){
      .tx-box{width:100vw;height:100dvh;bottom:0;right:0;border-radius:0;}
      .tx-fab{bottom:18px;right:18px;}
    }
  `;
  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

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

  var fab        = document.getElementById("txFab");
  var box        = document.getElementById("txBox");
  var msgs       = document.getElementById("txMsgs");
  var input      = document.getElementById("txInput");
  var sendBtn    = document.getElementById("txSend");
  var statusEl   = document.getElementById("txStatus");
  var statusText = document.getElementById("txStatusText");
  var progress   = document.getElementById("txProgress");
  var unread     = document.getElementById("txUnread");

  function getTime() {
    var d = new Date();
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  }

  function setProgress(pct) {
    progress.style.width = pct + "%";
    if (pct >= 100) setTimeout(function(){ progress.style.width = "0%"; }, 400);
  }

  function setStatus(state) {
    var labels = { online:"متصل", offline:"غير متصل", waiting:"جاري الإيقاظ..." };
    statusEl.className = "tx-status " + state;
    statusText.textContent = labels[state] || state;
  }

  function fmt(text) {
    text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, function(_, lang, code) {
      return '<pre><button class="tx-copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)">نسخ</button><code>' + escHtml(code.trim()) + '</code></pre>';
    });
    text = text.replace(/`([^`\n]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    text = text.replace(/^[\s]*[-•]\s+(.+)$/gm, "• $1");
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

  function addMsg(text, type, withRetry, skipAnim) {
    var wrap   = document.createElement("div");
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
      rb.className  = "tx-retry-btn";
      rb.textContent = "↺ أعد المحاولة";
      rb.onclick = function() { input.value = lastQ; sendMessage(); };
      meta.appendChild(rb);
    }
    wrap.appendChild(meta);
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  function showTyping(label) {
    var div = document.createElement("div");
    div.className = "tx-typing-wrap";
    div.id = "txTyping";
    div.innerHTML = '<div class="tx-typing"><span></span><span></span><span></span></div>'
      + '<span class="tx-typing-label">' + (label || "يفكر...") + '</span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("txTyping");
    if (el) el.remove();
  }

  var waitTimer = null;

  function showWaitBar(seconds) {
    hideWaitBar();
    var bar = document.createElement("div");
    bar.id = "txWaitBar";
    bar.className = "tx-wait-bar";
    bar.innerHTML = '<span id="txWaitSec">⏳ ' + seconds + 'ث</span>'
      + '<div class="tx-wait-track"><div class="tx-wait-fill" id="txWaitFill" style="width:0%"></div></div>';
    msgs.appendChild(bar);
    msgs.scrollTop = msgs.scrollHeight;

    var elapsed = 0;
    var fill = document.getElementById("txWaitFill");
    var secEl = document.getElementById("txWaitSec");
    waitTimer = setInterval(function() {
      elapsed++;
      var pct = Math.min((elapsed / seconds) * 100, 100);
      if (fill)  fill.style.width = pct + "%";
      if (secEl) secEl.textContent = "⏳ " + Math.max(seconds - elapsed, 0) + "ث";
    }, 1000);
  }

  function hideWaitBar() {
    if (waitTimer) { clearInterval(waitTimer); waitTimer = null; }
    var el = document.getElementById("txWaitBar");
    if (el) el.remove();
  }

  async function sendMessage() {
    var text = input.value.trim();
    if (!text || loading) return;

    var chips = document.getElementById("txChips");
    if (chips) chips.style.display = "none";

    var cacheKey = text.toLowerCase().trim();
    if (cache[cacheKey]) {
      addMsg(text, "user", false, true);
      input.value = ""; input.style.height = "44px";
      addMsg(cache[cacheKey], "bot");
      return;
    }

    lastQ   = text;
    loading = true;
    sendBtn.disabled = true;
    input.value = ""; input.style.height = "44px";

    history.push({ role:"user", content:text });
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

    addMsg(text, "user", false, true);
    showTyping("يفكر...");
    setProgress(15);

    var pct = 15;
    var pInterval = setInterval(function() {
      if (pct < 80) { pct += 1.5; progress.style.width = pct + "%"; }
    }, 600);

    var success = false;

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

        var resp = await fetch(API, {
          method:  "POST",
          headers: { "Content-Type":"application/json" },
          body:    JSON.stringify({ question:text, history:history.slice(0,-1) }),
          signal:  ctrl.signal,
          keepalive: true,
        });

        clearTimeout(timer);
        if (!resp.ok) throw new Error("HTTP " + resp.status);

        var data   = await resp.json();
        var answer = (data.answer || "").trim() || "⚠️ لم أستطع الإجابة، حاول مرة أخرى.";

        clearInterval(pInterval);
        hideTyping();
        hideWaitBar();
        setProgress(100);

        addMsg(answer, "bot");
        cache[cacheKey] = answer;
        history.push({ role:"assistant", content:answer });
        if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);

        spaceReady = true;
        setStatus("online");
        success = true;

        if (!box.classList.contains("open")) unread.style.display = "block";
        break;

      } catch (e) {
        if (attempt < MAX_RETRIES) {
          hideTyping();
          hideWaitBar();
          var waitSec = attempt * 8;
          showWaitBar(waitSec);
          showTyping("محاولة " + (attempt+1) + "/" + MAX_RETRIES + " خلال " + waitSec + "ث...");
          await new Promise(function(r){ setTimeout(r, waitSec * 1000); });
        } else {
          clearInterval(pInterval);
          hideTyping();
          hideWaitBar();
          setProgress(0);
          var errMsg = e.name === "AbortError"
            ? "⏱️ انتهت المهلة (" + (TIMEOUT_MS/1000) + "ث). النموذج مشغول — حاول بعد لحظة."
            : "⚠️ تعذّر الاتصال بالخادم. تحقق من اتصالك.";
          addMsg(errMsg, "bot", true, true);
          setStatus("offline");
        }
      }
    }

    loading = false;
    sendBtn.disabled = false;
    input.focus();
  }

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
    history = []; cache = {};
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

})();
