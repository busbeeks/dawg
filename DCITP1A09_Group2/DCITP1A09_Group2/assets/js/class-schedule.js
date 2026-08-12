/* Class Schedule */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var table = document.getElementById("scheduleBody");
    if (!table) return;
    var rows = Array.prototype.slice.call(table.querySelectorAll("[data-day]"));
    document.querySelectorAll("[data-dayfilter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var day = btn.getAttribute("data-dayfilter");
        document.querySelectorAll("[data-dayfilter]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var shown = 0;
        rows.forEach(function (r) {
          var show = day === "all" || r.getAttribute("data-day") === day;
          r.style.display = show ? "" : "none";
          if (show) shown++;
        });
        document.getElementById("scheduleEmpty").style.display = shown === 0 ? "" : "none";
      });
    });
  });
})();
