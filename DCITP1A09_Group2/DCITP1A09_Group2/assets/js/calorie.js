/* Calorie Calculator */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("calForm");
    if (!form) return;
    var fields = {
      age: document.getElementById("calAge"),
      height: document.getElementById("calHeight"),
      weight: document.getElementById("calWeight")
    };
    var result = document.getElementById("calResult");

    function err(el, msg) {
      el.classList.add("is-invalid");
      var e = document.getElementById(el.id + "Err");
      if (e) { e.textContent = msg; e.classList.add("show"); }
    }
    function clr(el) {
      el.classList.remove("is-invalid");
      var e = document.getElementById(el.id + "Err");
      if (e) e.classList.remove("show");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      Object.values(fields).forEach(clr);
      var ok = true;
      var age = parseFloat(fields.age.value), h = parseFloat(fields.height.value), w = parseFloat(fields.weight.value);
      if (!age || age < 12 || age > 90) { err(fields.age, "Enter an age between 12 and 90."); ok = false; }
      if (!h || h < 80 || h > 250) { err(fields.height, "Enter a height between 80 and 250 cm."); ok = false; }
      if (!w || w < 25 || w > 300) { err(fields.weight, "Enter a weight between 25 and 300 kg."); ok = false; }
      if (!ok) { result.style.display = "none"; return; }

      var sex = form.querySelector('input[name="calSex"]:checked').value;
      var activity = parseFloat(document.getElementById("calActivity").value);
      var goal = document.getElementById("calGoal").value;

      var bmr = 10 * w + 6.25 * h - 5 * age + (sex === "male" ? 5 : -161);
      var tdee = bmr * activity;
      var target = tdee;
      if (goal === "lose") target = tdee - 500;
      if (goal === "gain") target = tdee + 400;

      document.getElementById("calBmr").textContent = Math.round(bmr);
      document.getElementById("calTdee").textContent = Math.round(tdee);
      document.getElementById("calTarget").textContent = Math.round(target);

      // macro split: 30P / 40C / 30F on target calories
      document.getElementById("calProtein").textContent = Math.round((target * 0.30) / 4) + "g";
      document.getElementById("calCarbs").textContent = Math.round((target * 0.40) / 4) + "g";
      document.getElementById("calFat").textContent = Math.round((target * 0.30) / 9) + "g";

      var labels = { lose: "to lose ~0.5 kg / week", maintain: "to maintain your weight", gain: "to gain lean mass" };
      document.getElementById("calGoalLabel").textContent = labels[goal];

      result.style.display = "block";
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", function () {
      Object.values(fields).forEach(clr);
      result.style.display = "none";
    });
  });
})();
