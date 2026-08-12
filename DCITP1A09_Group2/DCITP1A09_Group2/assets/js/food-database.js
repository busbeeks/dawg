/* Food Database — live search, category filter & sort */
(function () {
  "use strict";
  var FOODS = [
    { n: "Chicken Breast", c: "protein", cal: 165, p: 31, cb: 0, f: 3.6 },
    { n: "Salmon Fillet", c: "protein", cal: 208, p: 20, cb: 0, f: 13 },
    { n: "Eggs (2 large)", c: "protein", cal: 156, p: 13, cb: 1, f: 11 },
    { n: "Greek Yogurt", c: "protein", cal: 59, p: 10, cb: 3.6, f: 0.4 },
    { n: "Tofu", c: "protein", cal: 76, p: 8, cb: 1.9, f: 4.8 },
    { n: "White Rice", c: "carb", cal: 130, p: 2.7, cb: 28, f: 0.3 },
    { n: "Oats", c: "carb", cal: 389, p: 17, cb: 66, f: 7 },
    { n: "Sweet Potato", c: "carb", cal: 86, p: 1.6, cb: 20, f: 0.1 },
    { n: "Banana", c: "carb", cal: 89, p: 1.1, cb: 23, f: 0.3 },
    { n: "Wholemeal Bread", c: "carb", cal: 247, p: 13, cb: 41, f: 3.4 },
    { n: "Avocado", c: "fat", cal: 160, p: 2, cb: 9, f: 15 },
    { n: "Almonds", c: "fat", cal: 579, p: 21, cb: 22, f: 50 },
    { n: "Olive Oil (1 tbsp)", c: "fat", cal: 119, p: 0, cb: 0, f: 14 },
    { n: "Peanut Butter", c: "fat", cal: 588, p: 25, cb: 20, f: 50 },
    { n: "Broccoli", c: "veg", cal: 34, p: 2.8, cb: 7, f: 0.4 },
    { n: "Spinach", c: "veg", cal: 23, p: 2.9, cb: 3.6, f: 0.4 },
    { n: "Mixed Berries", c: "veg", cal: 57, p: 0.7, cb: 14, f: 0.3 },
    { n: "Bell Pepper", c: "veg", cal: 31, p: 1, cb: 6, f: 0.3 },
    { n: "Chicken Rice (plate)", c: "carb", cal: 600, p: 30, cb: 75, f: 18 },
    { n: "Laksa (bowl)", c: "carb", cal: 400, p: 14, cb: 40, f: 22 },
    { n: "Nasi Lemak", c: "carb", cal: 494, p: 13, cb: 80, f: 19 },
    { n: "Char Kway Teow", c: "carb", cal: 745, p: 23, cb: 76, f: 38 },
    { n: "Satay (3 sticks)", c: "protein", cal: 150, p: 13, cb: 6, f: 9 },
    { n: "Roti Prata (1)", c: "carb", cal: 130, p: 3, cb: 18, f: 5 },
    { n: "Kaya Toast Set", c: "carb", cal: 260, p: 6, cb: 35, f: 10 },
    { n: "Fishball Noodles", c: "carb", cal: 340, p: 18, cb: 50, f: 7 },
    { n: "Soya Bean Milk", c: "protein", cal: 100, p: 5, cb: 14, f: 2 },
    { n: "Curry Puff (1)", c: "carb", cal: 130, p: 3, cb: 14, f: 7 },
    { n: "Ondeh Ondeh (3)", c: "carb", cal: 130, p: 1, cb: 24, f: 4 },
    { n: "Popiah (1 roll)", c: "veg", cal: 120, p: 4, cb: 20, f: 3 }
  ];

  var KEY = "kahlid_custom_foods";
  function loadCustom() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function saveCustom(a) { localStorage.setItem(KEY, JSON.stringify(a)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.getElementById("foodBody");
    if (!body) return;
    var search = document.getElementById("foodSearch");
    var count = document.getElementById("foodCount");
    var state = { q: "", cat: "all", sort: "name" };

    function all() { return FOODS.concat(loadCustom()); }

    function render() {
      var list = all().filter(function (f) {
        var okC = state.cat === "all" || f.c === state.cat;
        var okQ = f.n.toLowerCase().indexOf(state.q.toLowerCase()) !== -1;
        return okC && okQ;
      });
      list.sort(function (a, b) {
        if (state.sort === "name") return a.n.localeCompare(b.n);
        if (state.sort === "cal") return b.cal - a.cal;
        if (state.sort === "protein") return b.p - a.p;
        return 0;
      });
      body.innerHTML = list.length ? list.map(function (f) {
        var extra = f.custom ? ' <span class="badge-soft">Yours</span> <button class="btn btn-ghost btn-sm py-0 px-2" data-remove-food="' + f.id + '" aria-label="Remove ' + esc(f.n) + '">&times;</button>' : "";
        return "<tr><td><strong>" + esc(f.n) + "</strong>" + extra + "</td><td>" + f.cal + "</td><td>" + f.p + "g</td><td>" + f.cb + "g</td><td>" + f.f + "g</td></tr>";
      }).join("") : '<tr><td colspan="5" class="text-center text-muted-soft py-4">No foods match your search.</td></tr>';
      count.textContent = list.length + " of " + all().length + " foods";
    }

    search.addEventListener("input", function () { state.q = search.value; render(); });
    document.querySelectorAll("[data-cat]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.cat = b.getAttribute("data-cat");
        document.querySelectorAll("[data-cat]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active"); render();
      });
    });
    document.getElementById("foodSort").addEventListener("change", function (e) { state.sort = e.target.value; render(); });

    var addForm = document.getElementById("addFoodForm");
    if (addForm) {
      var aErr = function (id, m) { var el = document.getElementById(id); el.classList.add("is-invalid"); var e = document.getElementById(id + "Err"); if (e) { e.textContent = m; e.classList.add("show"); } };
      var aClr = function (id) { var el = document.getElementById(id); el.classList.remove("is-invalid"); var e = document.getElementById(id + "Err"); if (e) e.classList.remove("show"); };
      addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        ["nfName", "nfCal", "nfProtein", "nfCarbs", "nfFat"].forEach(aClr);
        var name = document.getElementById("nfName").value.trim();
        var cal = parseFloat(document.getElementById("nfCal").value);
        var p = parseFloat(document.getElementById("nfProtein").value);
        var cb = parseFloat(document.getElementById("nfCarbs").value);
        var fat = parseFloat(document.getElementById("nfFat").value);
        var ok = true;
        if (name.length < 2) { aErr("nfName", "Enter a food name."); ok = false; }
        if (isNaN(cal) || cal < 0 || cal > 2000) { aErr("nfCal", "0–2000 kcal."); ok = false; }
        if (isNaN(p) || p < 0 || p > 500) { aErr("nfProtein", "0–500 g."); ok = false; }
        if (isNaN(cb) || cb < 0 || cb > 500) { aErr("nfCarbs", "0–500 g."); ok = false; }
        if (isNaN(fat) || fat < 0 || fat > 500) { aErr("nfFat", "0–500 g."); ok = false; }
        if (!ok) return;
        var custom = loadCustom();
        custom.push({ id: "c" + Date.now(), n: name, c: document.getElementById("nfCat").value, cal: cal, p: p, cb: cb, f: fat, custom: true });
        saveCustom(custom);
        addForm.reset();
        render();
        var t = document.getElementById("nfThanks");
        if (t) { t.classList.remove("is-hidden"); setTimeout(function () { t.classList.add("is-hidden"); }, 4000); }
      });
    }

    body.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove-food]");
      if (!b) return;
      var id = b.getAttribute("data-remove-food");
      saveCustom(loadCustom().filter(function (x) { return x.id !== id; }));
      render();
    });

    render();
  });
})();
