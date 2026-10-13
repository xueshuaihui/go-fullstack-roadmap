/* HomeCube Roadmap — 勾选持久化 + 进度统计（纯 localStorage，无构建依赖）
   契约见 docs/CANONICAL.md §3.3：
   - 日卡 body[data-day]，勾选框 data-key（目标 gN / 完成检查 cN）
   - 只统计 key 以 c+数字 结尾的项，写 localStorage["pf-"+day] = "done/total"
   - index.html 上每张日卡链接带 data-day="wNNdN"，进度按链接归集，不硬编码周数与天数 */
(function () {
  "use strict";

  var DEFAULT_TOTAL = 5;

  function persistables() {
    return Array.prototype.slice.call(
      document.querySelectorAll('ul.check input[type="checkbox"]')
    );
  }

  function readDay(key) {
    try {
      var raw = localStorage.getItem("pf-" + key);
      if (raw) {
        var p = raw.split("/");
        return { done: +p[0] || 0, total: +p[1] || DEFAULT_TOTAL };
      }
    } catch (e) { /* 隐私模式下静默降级 */ }
    return { done: 0, total: DEFAULT_TOTAL };
  }

  function save() {
    try {
      persistables().forEach(function (i) {
        if (i.dataset.key) localStorage.setItem(i.dataset.key, i.checked ? "1" : "0");
      });
      var day = document.body.dataset.day;
      if (day) {
        var ins = persistables().filter(function (i) { return /c\d+$/.test(i.dataset.key || ""); });
        var done = ins.filter(function (i) { return i.checked; }).length;
        localStorage.setItem("pf-" + day, done + "/" + (ins.length || DEFAULT_TOTAL));
      }
    } catch (e) { /* noop */ }
    renderProgress();
  }

  function restore() {
    try {
      persistables().forEach(function (i) {
        if (i.dataset.key && localStorage.getItem(i.dataset.key) === "1") i.checked = true;
      });
    } catch (e) { /* noop */ }
  }

  function linksIn(scope) {
    return Array.prototype.slice.call(scope.querySelectorAll("a[data-day]"));
  }

  function statsIn(scope) {
    var done = 0, total = 0, seen = {};
    linksIn(scope).forEach(function (a) {
      var k = a.dataset.day;
      if (seen[k]) return;
      seen[k] = 1;
      var s = readDay(k);
      done += s.done; total += s.total;
    });
    return { done: done, total: total, cards: Object.keys(seen).length };
  }

  function scopeOf(el) {
    if (el.dataset.scope === "all") return document;
    var card = el.closest(".week-card");
    if (card) return card;
    return el.closest("section") || document;
  }

  function pct(el) {
    var s = statsIn(scopeOf(el));
    var p = s.total ? Math.round((s.done / s.total) * 100) : 0;
    var root = el.closest(".week-card") || el;
    var fill = root.querySelector(".fill");
    if (fill) fill.style.width = p + "%";
    var pctEl = root.querySelector(".pct");
    if (pctEl) pctEl.textContent = s.done + "/" + s.total + " · " + p + "%";
    var num = el.querySelector("b");
    if (num && el.classList.contains("progress-panel")) {
      num.textContent = s.cards ? p + "%" : "—";
    }
    var sub = el.querySelector(".sub");
    if (sub && el.classList.contains("progress-panel")) {
      sub.textContent = s.cards ? s.done + "/" + s.total + " 项 · " + s.cards + " 张日卡" : "日卡尚未生成";
    }
  }

  function renderProgress() {
    document.querySelectorAll(".progress-panel, .week-mini").forEach(pct);
  }

  document.addEventListener("change", function (e) {
    if (e.target.matches && e.target.matches('ul.check input[type="checkbox"]')) save();
  });
  document.addEventListener("DOMContentLoaded", function () { restore(); renderProgress(); });
})();
