/* BMI Calculator */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("bmiForm");
    if (!form) return;
    var height = document.getElementById("bmiHeight");
    var weight = document.getElementById("bmiWeight");
    var result = document.getElementById("bmiResult");

    function showError(el, msg) {
      el.classList.add("is-invalid");
      var e = document.getElementById(el.id + "Err");
      if (e) { e.textContent = msg; e.classList.add("show"); }
    }
    function clearError(el) {
      el.classList.remove("is-invalid");
      var e = document.getElementById(el.id + "Err");
      if (e) e.classList.remove("show");
    }
    function category(bmi) {
      if (bmi < 18.5) return { label: "Underweight", tip: "Focus on nutrient-dense meals and progressive strength training to build healthy mass.", pos: 12 };
      if (bmi < 25) return { label: "Healthy Weight", tip: "Great baseline! Maintain with balanced nutrition and regular activity.", pos: 40 };
      if (bmi < 30) return { label: "Overweight", tip: "A mix of cardio and strength plus a small calorie deficit is a solid start.", pos: 68 };
      return { label: "Obese", tip: "Start gently with low-impact cardio and speak to a coach for a safe plan.", pos: 90 };
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      [height, weight].forEach(clearError);
      var h = parseFloat(height.value), w = parseFloat(weight.value);
      if (!height.value || isNaN(h) || h < 80 || h > 250) { showError(height, "Enter a height between 80 and 250 cm."); ok = false; }
      if (!weight.value || isNaN(w) || w < 25 || w > 300) { showError(weight, "Enter a weight between 25 and 300 kg."); ok = false; }
      if (!ok) { result.style.display = "none"; return; }

      var bmi = w / Math.pow(h / 100, 2);
      var c = category(bmi);
      document.getElementById("bmiValue").textContent = bmi.toFixed(1);
      document.getElementById("bmiCategory").textContent = c.label;
      document.getElementById("bmiTip").textContent = c.tip;
      document.getElementById("bmiMarker").style.left = c.pos + "%";
      result.style.display = "block";
      result.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", function () {
      [height, weight].forEach(clearError);
      result.style.display = "none";
    });
  });
})();
