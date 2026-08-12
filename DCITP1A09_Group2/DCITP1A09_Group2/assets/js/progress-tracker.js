/* Progress Tracker — log weight/reps/duration, chart + motivation (localStorage) */
(function () {
  "use strict";
  var KEY = "kahlid_progress";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { localStorage.setItem(KEY, JSON.stringify(a)); }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("progressForm");
    if (!form) return;
    var w = document.getElementById("pWeight");
    var reps = document.getElementById("pReps");
    var dur = document.getElementById("pDuration");
    var body = document.getElementById("progressBody");
    var chart = document.getElementById("progressChart");
    var msg = document.getElementById("progressMsg");
    var empty = document.getElementById("progressEmpty");

    function err(el, m) { el.classList.add("is-invalid"); var e = document.getElementById(el.id + "Err"); if (e) { e.textContent = m; e.classList.add("show"); } }
    function clr(el) { el.classList.remove("is-invalid"); var e = document.getElementById(el.id + "Err"); if (e) e.classList.remove("show"); }

    function render() {
      var data = load().slice().sort(function (a, b) { return a.t - b.t; });
      var has = data.length > 0;
      empty.style.display = has ? "none" : "block";
      document.getElementById("progressPanel").style.display = has ? "block" : "none";
      if (!has) { body.innerHTML = ""; chart.innerHTML = ""; msg.innerHTML = ""; return; }

      body.innerHTML = data.slice().reverse().map(function (d) {
        return "<tr><td>" + d.date + "</td><td>" + d.weight + " kg</td><td>" + (d.reps || "—") + "</td><td>" + (d.dur ? d.dur + " min" : "—") + "</td></tr>";
      }).join("");

      var weights = data.map(function (d) { return d.weight; });
      var max = Math.max.apply(null, weights), min = Math.min.apply(null, weights);
      var range = (max - min) || 1;
      chart.innerHTML = data.map(function (d) {
        var h = 20 + ((d.weight - min) / range) * 130;
        var label = d.date.slice(5); // MM-DD
        return '<div class="spark-bar" style="height:' + h + 'px"><span>' + d.weight + '</span><small>' + label + "</small></div>";
      }).join("");

      var first = data[0].weight, last = data[data.length - 1].weight;
      var pct = first ? Math.round(((last - first) / first) * 1000) / 10 : 0;
      var text, cls = "";
      if (data.length < 2) {
        text = '<span class="big">Nice start!</span><br>First entry logged — come back after your next session to see your trend.';
      } else if (last < first) {
        cls = "up";
        text = '<span class="big">You\'re down ' + Math.abs(pct) + '%!</span><br>Great progress since you started (' + first + ' kg → ' + last + ' kg). Keep it up 💪';
      } else if (last > first) {
        cls = "up";
        text = '<span class="big">Up ' + Math.abs(pct) + '% in mass!</span><br>You\'ve gone from ' + first + ' kg to ' + last + ' kg — building strong.';
      } else {
        text = '<span class="big">Holding steady.</span><br>Consistency is progress too — ' + data.length + ' sessions logged!';
      }
      msg.className = "motivation " + cls;
      msg.innerHTML = text;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      [w, reps, dur].forEach(clr);
      var ok = true;
      var wv = parseFloat(w.value);
      if (!w.value || isNaN(wv) || wv < 25 || wv > 300) { err(w, "Enter a weight between 25 and 300 kg."); ok = false; }
      if (reps.value && (parseInt(reps.value, 10) < 0 || parseInt(reps.value, 10) > 500)) { err(reps, "Enter valid reps (0–500)."); ok = false; }
      if (dur.value && (parseInt(dur.value, 10) < 0 || parseInt(dur.value, 10) > 600)) { err(dur, "Enter valid minutes (0–600)."); ok = false; }
      if (!ok) return;
      var now = new Date();
      var data = load();
      data.push({ t: now.getTime(), date: now.toISOString().slice(0, 10), weight: wv, reps: reps.value ? parseInt(reps.value, 10) : null, dur: dur.value ? parseInt(dur.value, 10) : null });
      save(data);
      form.reset();
      render();
      document.getElementById("progressPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    document.getElementById("progressReset").addEventListener("click", function () {
      localStorage.removeItem(KEY);
      render();
    });

    render();
  });
})();
