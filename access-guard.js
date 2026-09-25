/*
  access-guard.js
  ضعه في وسم <script> داخل <head> بكل صفحة تريد حمايتها،
  في أول سطر ممكن (قبل باقي الروابط والسكريبتات)
  حتى يتم التوجيه قبل تحميل أي محتوى من الصفحة.

  مثال الاستعمال داخل <head>:
  <script src="/access-guard.js"></script>

  ملاحظة: عدّل GATE_PATH إذا كانت gate.html في مجلد مختلف عن جذر الموقع.
*/
(function () {
  var STORAGE_KEY = 'xpert_gate_ok';
  var GATE_PATH   = '/gate.html';

  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch (e) {
    // إذا كان localStorage غير متاح، نكمل للتوجيه احتياطاً
  }

  var next = encodeURIComponent(location.href);
  location.replace(GATE_PATH + '?next=' + next);
})();
