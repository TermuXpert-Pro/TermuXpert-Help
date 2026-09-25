/*
  access-guard.js
  ضعه في وسم <script> داخل <head> بكل صفحة تريد حمايتها،
  في أول سطر ممكن (قبل باقي الروابط والسكريبتات).

  مثال الاستعمال داخل <head>:
  <script src="/access-guard.js"></script>

  المنطق:
  - إذا لم يدخل رمز الدخول الأول أبداً => توجيه لـ gate.html
  - إذا مرت 10 دقائق منذ آخر تحقق => توجيه لـ recheck.html (رمز المتابعة)
  - إذا كان محظوراً حالياً (بعد 3 محاولات خاطئة) => توجيه لصفحة القفل المناسبة
  - أثناء بقاء الصفحة مفتوحة، يعاد الفحص كل 20 ثانية حتى لو ما تنقلش المستخدم
*/
(function () {
  var GATE_OK_KEY     = 'xpert_gate_ok';
  var VERIFIED_AT_KEY  = 'xpert_verified_at';
  var LOCK_UNTIL_KEY    = 'xpert_lock_until';
  var RECHECK_MS         = 10 * 60 * 1000; // 10 دقائق
  var CHECK_INTERVAL_MS   = 20 * 1000;       // كل 20 ثانية

  function lockRemainingSeconds () {
    var until = parseInt(localStorage.getItem(LOCK_UNTIL_KEY) || '0', 10);
    var remaining = Math.ceil((until - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  }

  function hasPassedGateOnce () {
    return localStorage.getItem(GATE_OK_KEY) === '1';
  }

  function needsRecheck () {
    var verifiedAt = parseInt(localStorage.getItem(VERIFIED_AT_KEY) || '0', 10);
    return (Date.now() - verifiedAt) > RECHECK_MS;
  }

  function requiredDestination () {
    if (lockRemainingSeconds() > 0) {
      return hasPassedGateOnce() ? '/recheck.html' : '/gate.html';
    }
    if (!hasPassedGateOnce()) return '/gate.html';
    if (needsRecheck()) return '/recheck.html';
    return null;
  }

  function goToDestination (dest) {
    var next = encodeURIComponent(location.href);
    location.replace(dest + '?next=' + next);
  }

  function checkNow () {
    var dest;
    try {
      dest = requiredDestination();
    } catch (e) {
      return;
    }
    if (dest) goToDestination(dest);
  }

  checkNow();

  // فحص دوري: حتى لو بقيت الصفحة مفتوحة أكثر من 10 دقائق بلا تنقل
  setInterval(checkNow, CHECK_INTERVAL_MS);
})();
