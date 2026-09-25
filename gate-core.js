/*
  gate-core.js
  المنطق المشترك بين gate.html و recheck.html و access-guard.js
  حتى تكون قيم القفل والمحاولات والتوقيت موحّدة في كل مكان.
*/
var XpertGate = (function () {
  var GATE_OK_KEY     = 'xpert_gate_ok';
  var VERIFIED_AT_KEY  = 'xpert_verified_at';
  var ATTEMPTS_KEY      = 'xpert_attempts';
  var LOCK_UNTIL_KEY     = 'xpert_lock_until';

  var MAX_ATTEMPTS   = 3;
  var LOCK_MS         = 60 * 60 * 1000;   // ساعة واحدة
  var RECHECK_MS       = 10 * 60 * 1000;    // 10 دقائق

  function lockRemainingSeconds () {
    var until = parseInt(localStorage.getItem(LOCK_UNTIL_KEY) || '0', 10);
    var remaining = Math.ceil((until - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  function registerFailure () {
    var attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(attempts));
    if (attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(LOCK_UNTIL_KEY, String(Date.now() + LOCK_MS));
      localStorage.setItem(ATTEMPTS_KEY, '0');
      return true; // صار محظوراً الآن
    }
    return false;
  }

  function markVerified () {
    localStorage.setItem(GATE_OK_KEY, '1');
    localStorage.setItem(VERIFIED_AT_KEY, String(Date.now()));
    localStorage.removeItem(ATTEMPTS_KEY);
  }

  function hasPassedGateOnce () {
    return localStorage.getItem(GATE_OK_KEY) === '1';
  }

  function needsRecheck () {
    var verifiedAt = parseInt(localStorage.getItem(VERIFIED_AT_KEY) || '0', 10);
    return (Date.now() - verifiedAt) > RECHECK_MS;
  }

  function formatTime (totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  // أين يجب أن يذهب أي زائر الآن؟ null = مسموح له يبقى في الصفحة الحالية.
  function requiredDestination () {
    if (lockRemainingSeconds() > 0) {
      return hasPassedGateOnce() ? 'recheck.html' : 'gate.html';
    }
    if (!hasPassedGateOnce()) {
      return 'gate.html';
    }
    if (needsRecheck()) {
      return 'recheck.html';
    }
    return null;
  }

  return {
    MAX_ATTEMPTS: MAX_ATTEMPTS,
    RECHECK_MS: RECHECK_MS,
    lockRemainingSeconds: lockRemainingSeconds,
    registerFailure: registerFailure,
    markVerified: markVerified,
    hasPassedGateOnce: hasPassedGateOnce,
    needsRecheck: needsRecheck,
    formatTime: formatTime,
    requiredDestination: requiredDestination
  };
})();
