/* GoFullStack Roadmap — 勾选持久化 + 进度统计（纯 localStorage，无构建依赖） */
(function () {
  "use strict";

  function persistables() {
    return Array.prototype.slice.call(
      document.querySelectorAll('ul.check input[type="checkbox"]')
    );
  }

  function save() {
    try {
      persistables().forEach(function (i) {
        if (i.dataset.key) localStorage.setItem(i.dataset.key, i.checked ? "1" : "0");
      });
      var day = document.body.dataset.day; // e.g. "w1d1"
      if (day) {
        // 进度只按「完成检查」项（data-key 以 c+数字 结尾）统计，不含目标项
        var ins = persistables().filter(function (i) { return /c\d+$/.test(i.dataset.key || ""); });
        var done = ins.filter(function (i) { return i.checked; }).length;
        localStorage.setItem("pf-" + day, done + "/" + (ins.length || 5));
      }
    } catch (e) { /* 隐私模式下静默降级 */ }
    renderProgress();
  }

  function restore() {
    try {
      persistables().forEach(function (i) {
        if (i.dataset.key && localStorage.getItem(i.dataset.key) === "1") i.checked = true;
      });
    } catch (e) { /* noop */ }
  }

  // 汇总指定范围的进度；未访问过的天按 0/5 计
  function statsInRange(fromW, toW) {
    var done = 0, total = 0;
    for (var w = fromW; w <= toW; w++) {
      for (var d = 1; d <= 5; d++) {
        var v = 0, m = 5;
        try {
          var raw = localStorage.getItem("pf-w" + w + "d" + d);
          if (raw) { var p = raw.split("/"); v = +p[0]; m = +p[1] || 5; }
        } catch (e) { /* noop */ }
        done += v; total += m;
      }
    }
    return { done: done, total: total };
  }

  function pct(el) {
    var wk = el.dataset.weeks ? +el.dataset.weeks : (el.dataset.week ? +el.dataset.week : null);
    var s = wk ? statsInRange(wk, wk) : statsInRange(1, 8);
    var p = s.total ? Math.round((s.done / s.total) * 100) : 0;
    var root = el.closest(".week-card") || el;
    var fill = root.querySelector(".fill");
    if (fill) fill.style.width = p + "%";
    var pctEl = root.querySelector(".pct");
    if (pctEl) pctEl.textContent = s.done + "/" + s.total + " · " + p + "%";
    var num = el.querySelector("b");
    if (num && el.classList.contains("progress-panel")) num.textContent = p + "%";
  }

  function renderProgress() {
    document.querySelectorAll(".progress-panel, .week-mini[data-week]").forEach(pct);
  }

  document.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches('ul.check input[type="checkbox"]')) save();
  });
  document.addEventListener("DOMContentLoaded", function () { restore(); renderProgress(); });
})();
