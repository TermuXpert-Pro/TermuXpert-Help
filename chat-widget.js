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
    .tx-box {
      position:fixed; bottom:106px; right:26px; z-index:99998;
      width:420px; height:600px; background:var(--tx-bg);
      border:1px solid var(--tx-border); border-radius:var(--tx-radius);
      box-shadow:0 0 0 1px rgba(0,229,195,.08),0 32px 80px rgba(0,0,0,.8),var(--tx-glow);
      display:none; flex-direction:column; overflow:hidden; font-family:var(--tx-font);
    }
    .tx-box.open { display:flex; animation:tx-slide-in .3s cubic-bezier(.34,1.3,.64,1) both; }
    @keyframes tx-slide-in { from{opacity:0;transform:translateY(20px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .tx-header {
      background:linear-gradient(160deg,#0C1420,#080B12);
      border-bottom:1px solid var(--tx-border); padding:14px 16px;
      display:flex; align-items:center; gap:10px;
    }
    .tx-avatar {
      width:42px; height:42px; border-radius:50%; flex-shrink:0;
      background:var(--tx-surface); border:1.5px solid var(--tx-accent);
      display:flex; align-items:center; justify-content:center; font-size:22px;
    }
    .tx-title { color:#fff; font-weight:800; font-size:15px; }
    .tx-status { font-size:11px; font-weight:500; display:flex; align-items:center; gap:5px; }
    .tx-status.online { color:var(--tx-accent); }
    .tx-msgs {
      flex:1; overflow-y:auto; padding:18px 16px;
      display:flex; flex-direction:column; gap:16px; scroll-behavior:smooth;
    }
    .tx-msg { max-width:86%; animation:tx-msg-in .28s ease both; }
    @keyframes tx-msg-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    .tx-msg.user { align-self:flex-end; }
    .tx-msg.bot  { align-self:flex-start; }
    .tx-bubble { padding:11px 15px; border-radius:18px; font-size:13.5px; line-height:1.75; word-wrap:break-word; }
    .tx-msg.user .tx-bubble { background:var(--tx-user-bg); color:#051a16; font-weight:600; }
    .tx-msg.bot .tx-bubble { background:var(--tx-surface); color:var(--tx-text); border:1px solid var(--tx-border); }
    .tx-bubble code { font-family:var(--tx-mono); background:#040609; color:#00E5C3; padding:2px 7px; border-radius:5px; font-size:12px; }
    .tx-meta { font-size:10px; color:var(--tx-muted); margin-top:5px; }
    .tx-typing-wrap { align-self:flex-start; display:flex; align-items:center; gap:10px; }
    .tx-typing { background:var(--tx-surface); border:1px solid var(--tx-border); border-radius:18px; padding:13px 18px; display:flex; gap:5px; }
    .tx-typing span { width:7px; height:7px; background:var(--tx-accent); border-radius:50%; animation:tx-bounce 1.2s infinite ease-in-out both; }
    .tx-typing span:nth-child(1){animation-delay:-.32s} .tx-typing span:nth-child(2){animation-delay:-.16s}
    @keyframes tx-bounce { 0%,80%,100%{transform:scale(.35);opacity:.4} 40%{transform:scale(1);opacity:1} }
    .tx-chips { padding:4px 14px 10px; display:flex; flex-wrap:wrap; gap:6px; }
    .tx-chip { background:var(--tx-surface); border:1px solid var(--tx-border); color:#8A97AB; border-radius:20px; padding:5px 13px; font-size:11.5px; cursor:pointer; }
    .tx-chip:hover { border-color:var(--tx-accent); color:var(--tx-accent); }
    .tx-bar { display:flex; align-items:center; gap:8px; padding:12px 14px; border-top:1px solid var(--tx-border); background:rgba(8,11,18,.9); }
    .tx-input { flex:1; padding:11px 16px; border-radius:22px; background:var(--tx-surface); border:1px solid var(--tx-border); color:var(--tx-text); font-family:var(--tx-font); font-size:13.5px; outline:none; resize:none; height:44px; }
    .tx-input:focus { border-color:var(--tx-accent); }
    .tx-send { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#00C9A7,#00E5C3); color:#051a16; border:none; font-size:18px; cursor:pointer; }
    .tx-send:disabled { opacity:.4; cursor:not-allowed; }
    @media(max-width:480px){ .tx-box{width:100vw;height:100dvh;bottom:0;right:0;border-radius:0;} }
  `;
  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  var HTML = `
    <button class="tx-fab" id="txFab">💬</button>
    <div class="tx-box" id="txBox">
      <div class="tx-header">
        <div class="tx-avatar">🤖</div>
        <div>
          <div class="tx-title">TermuXpert AI</div>
          <div class="tx-status online"><span>🟢 متصل</span></div>
        </div>
      </div>
      <div class="tx-msgs" id="txMsgs">
        <div class="tx-msg bot">
          <div class="tx-bubble">👋 مرحباً! أنا <b>TermuXpert</b> — خبيرك في Termux.<br>اسألني عن أي أمر!</div>
        </div>
      </div>
      <div class="tx-chips" id="txChips">
        <button class="tx-chip">pkg update</button>
        <button class="tx-chip">تثبيت Python</button>
        <button class="tx-chip">إعداد SSH</button>
      </div>
      <div class="tx-bar">
        <textarea class="tx-input" id="txInput" placeholder="اكتب سؤالك..." rows="1"></textarea>
        <button class="tx-send" id="txSend">➤</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", HTML);

  var box        = document.getElementById("txBox");
  var msgs       = document.getElementById("txMsgs");
  var input      = document.getElementById("txInput");
  var sendBtn    = document.getElementById("txSend");

  document.getElementById("txFab").addEventListener("click", function () {
    box.classList.toggle("open");
    if (box.classList.contains("open")) input.focus();
  });

  function addMsg(text, type) {
    var div = document.createElement("div");
    div.className = "tx-msg " + type;
    div.innerHTML = '<div class="tx-bubble">' + text.replace(/\n/g, "<br>") + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "tx-typing-wrap";
    div.id = "txTyping";
    div.innerHTML = '<div class="tx-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById("txTyping");
    if (el) el.remove();
  }

  async function sendMessage() {
    var text = input.value.trim();
    if (!text || loading) return;
    loading = true;
    sendBtn.disabled = true;
    addMsg(text, "user");
    input.value = "";
    showTyping();

    try {
      var resp = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      var data = await resp.json();
      hideTyping();
      addMsg(data.answer || "⚠️ لم أستطع الإجابة.", "bot");
    } catch (e) {
      hideTyping();
      addMsg("⚠️ خطأ في الاتصال.", "bot");
    }
    loading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();
