/* Build Your Own Workout */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var quiz = document.getElementById("quiz");
    if (!quiz) return;

    var steps = Array.prototype.slice.call(quiz.querySelectorAll(".quiz-step"));
    var answers = {};
    var idx = 0;
    var progress = document.getElementById("quizProgress");
    var resultBox = document.getElementById("quizResult");

    function render() {
      steps.forEach(function (s, i) { s.style.display = i === idx ? "block" : "none"; });
      if (progress) progress.style.width = ((idx) / steps.length * 100) + "%";
    }

    quiz.addEventListener("click", function (e) {
      var opt = e.target.closest("[data-key]");
      if (opt) {
        var key = opt.getAttribute("data-key");
        answers[key] = opt.getAttribute("data-val");
        opt.parentNode.querySelectorAll("[data-key]").forEach(function (o) { o.classList.remove("active"); });
        opt.classList.add("active");
        var nextBtn = opt.closest(".quiz-step").querySelector("[data-next]");
        if (nextBtn) nextBtn.removeAttribute("disabled");
        return;
      }
      if (e.target.hasAttribute("data-next")) {
        if (idx < steps.length - 1) { idx++; render(); }
        else { generate(); }
      }
      if (e.target.hasAttribute("data-back")) {
        if (idx > 0) { idx--; render(); }
      }
    });

    var LIB = {
      strength: ["Goblet Squat", "Dumbbell Bench Press", "Bent-over Row", "Romanian Deadlift", "Overhead Press", "Plank"],
      cardio: ["Jump Rope Intervals", "Mountain Climbers", "High Knees", "Burpees", "Rowing Sprints", "Bike Intervals"],
      home: ["Push-ups", "Air Squats", "Reverse Lunges", "Glute Bridges", "Superman Hold", "Dead Bug"]
    };

    function generate() {
      var goal = answers.goal || "general fitness";
      var exp = answers.experience || "beginner";
      var equip = answers.equipment || "home";
      var dur = answers.duration || "30";

      var pool = equip === "gym" ? LIB.strength.concat(LIB.cardio) : (equip === "dumbbells" ? LIB.strength : LIB.home);
      var repScheme = goal === "build muscle" ? "4 sets × 8–10 reps" : goal === "lose fat" ? "3 sets × 12–15 reps" : "3 sets × 10–12 reps";
      var rest = goal === "build muscle" ? "90 sec" : "45–60 sec";
      var moves = parseInt(dur, 10) >= 45 ? 6 : parseInt(dur, 10) >= 30 ? 5 : 4;
      var picks = pool.slice(0, moves);

      var rows = picks.map(function (m, i) {
        return "<tr><td>" + (i + 1) + "</td><td>" + m + "</td><td>" + repScheme + "</td><td>" + rest + "</td></tr>";
      }).join("");

      document.getElementById("planMeta").innerHTML =
        '<span class="badge-soft me-2">' + exp + '</span>' +
        '<span class="badge-soft me-2">' + goal + '</span>' +
        '<span class="badge-soft me-2">' + equip + '</span>' +
        '<span class="badge-soft">' + dur + ' min</span>';
      document.getElementById("planTable").innerHTML = rows;

      quiz.querySelector(".quiz-body").style.display = "none";
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.getElementById("quizRestart").addEventListener("click", function () {
      idx = 0; answers = {};
      quiz.querySelectorAll("[data-key]").forEach(function (o) { o.classList.remove("active"); });
      quiz.querySelectorAll("[data-next]").forEach(function (b) { b.setAttribute("disabled", "disabled"); });
      resultBox.style.display = "none";
      quiz.querySelector(".quiz-body").style.display = "block";
      render();
    });

    render();
  });
})();
