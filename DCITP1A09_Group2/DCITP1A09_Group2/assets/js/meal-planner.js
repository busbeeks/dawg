/* Meal Planner — add foods to meals, live nutrient totals */
(function () {
  "use strict";
  var FOODS = [
    { n: "Chicken Breast", cal: 165, p: 31, cb: 0, f: 3.6 },
    { n: "Salmon Fillet", cal: 208, p: 20, cb: 0, f: 13 },
    { n: "Eggs (2 large)", cal: 156, p: 13, cb: 1, f: 11 },
    { n: "Greek Yogurt", cal: 59, p: 10, cb: 3.6, f: 0.4 },
    { n: "Oats", cal: 150, p: 5, cb: 27, f: 3 },
    { n: "White Rice (1 cup)", cal: 205, p: 4, cb: 45, f: 0.4 },
    { n: "Sweet Potato", cal: 112, p: 2, cb: 26, f: 0.1 },
    { n: "Banana", cal: 89, p: 1.1, cb: 23, f: 0.3 },
    { n: "Avocado (half)", cal: 120, p: 1.5, cb: 6, f: 11 },
    { n: "Almonds (28g)", cal: 164, p: 6, cb: 6, f: 14 },
    { n: "Broccoli (cup)", cal: 34, p: 2.8, cb: 7, f: 0.4 },
    { n: "Mixed Berries", cal: 57, p: 0.7, cb: 14, f: 0.3 },
    { n: "Protein Shake", cal: 130, p: 25, cb: 4, f: 2 },
    { n: "Wholemeal Toast", cal: 124, p: 6, cb: 20, f: 1.7 },
    { n: "Chicken Rice (plate)", cal: 600, p: 30, cb: 75, f: 18 },
    { n: "Laksa (bowl)", cal: 400, p: 14, cb: 40, f: 22 },
    { n: "Nasi Lemak", cal: 494, p: 13, cb: 80, f: 19 },
    { n: "Satay (3 sticks)", cal: 150, p: 13, cb: 6, f: 9 },
    { n: "Roti Prata (1)", cal: 130, p: 3, cb: 18, f: 5 },
    { n: "Kaya Toast Set", cal: 260, p: 6, cb: 35, f: 10 },
    { n: "Fishball Noodles", cal: 340, p: 18, cb: 50, f: 7 },
    { n: "Soya Bean Milk", cal: 100, p: 5, cb: 14, f: 2 },
    { n: "Curry Puff (1)", cal: 130, p: 3, cb: 14, f: 7 },
    { n: "Chwee Kueh (3)", cal: 190, p: 3, cb: 30, f: 6 }
  ];
  var MEALS = ["breakfast", "lunch", "dinner", "snacks"];

  document.addEventListener("DOMContentLoaded", function () {
    var picker = document.getElementById("mealFoodSelect");
    if (!picker) return;
    var custom = (function () { try { return JSON.parse(localStorage.getItem("kahlid_custom_foods")) || []; } catch (e) { return []; } })()
      .map(function (f) { return { n: f.n, cal: f.cal, p: f.p, cb: f.cb, f: f.f }; });
    var ALL = FOODS.concat(custom);
    picker.innerHTML = '<option value="">Select a food…</option>' +
      ALL.map(function (f, i) { return '<option value="' + i + '">' + f.n + " — " + f.cal + " kcal</option>"; }).join("");

    var plan = { breakfast: [], lunch: [], dinner: [], snacks: [] };

    function totals() {
      var t = { cal: 0, p: 0, cb: 0, f: 0 };
      MEALS.forEach(function (m) {
        plan[m].forEach(function (i) {
          var f = ALL[i];
          t.cal += f.cal; t.p += f.p; t.cb += f.cb; t.f += f.f;
        });
      });
      return t;
    }

    function render() {
      MEALS.forEach(function (m) {
        var ul = document.getElementById("list-" + m);
        if (!plan[m].length) { ul.innerHTML = '<li class="text-muted-soft small">Nothing added yet.</li>'; return; }
        ul.innerHTML = plan[m].map(function (i, pos) {
          var f = ALL[i];
          return '<li class="d-flex justify-content-between align-items-center py-2 border-bottom border-soft">' +
            '<span>' + f.n + ' <small class="text-muted-soft">' + f.cal + ' kcal</small></span>' +
            '<button class="btn btn-ghost btn-sm py-0 px-2" data-remove="' + m + '" data-pos="' + pos + '" aria-label="Remove ' + f.n + '">&times;</button></li>';
        }).join("");
      });
      var t = totals();
      document.getElementById("totCal").textContent = Math.round(t.cal);
      document.getElementById("totP").textContent = Math.round(t.p) + "g";
      document.getElementById("totCb").textContent = Math.round(t.cb) + "g";
      document.getElementById("totF").textContent = Math.round(t.f) + "g";
    }

    document.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var v = picker.value;
        if (v === "") { picker.classList.add("is-invalid"); return; }
        picker.classList.remove("is-invalid");
        plan[btn.getAttribute("data-add")].push(parseInt(v, 10));
        render();
      });
    });

    document.getElementById("mealBoard").addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      plan[b.getAttribute("data-remove")].splice(parseInt(b.getAttribute("data-pos"), 10), 1);
      render();
    });

    document.getElementById("mealClear").addEventListener("click", function () {
      MEALS.forEach(function (m) { plan[m] = []; });
      render();
    });

    render();
  });
})();
