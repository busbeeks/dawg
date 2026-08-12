/* Find a Gym in Singapore — search + region filter (DOM rendering) */
(function () {
  "use strict";
  var GYMS = [
    { name: "ActiveSG Gym @ Jurong East", area: "Jurong East", region: "west", price: "$", tags: ["Public", "Budget"], hours: "7am–10pm" },
    { name: "Anytime Fitness Clementi", area: "Clementi", region: "west", price: "$$", tags: ["24/7", "Chain"], hours: "24 hours" },
    { name: "ActiveSG Gym @ Bishan", area: "Bishan", region: "central", price: "$", tags: ["Public", "Budget"], hours: "7am–9:30pm" },
    { name: "Fitness First Raffles Place", area: "Raffles Place", region: "central", price: "$$$", tags: ["Premium", "Classes"], hours: "6am–10pm" },
    { name: "Gymmboxx Katong", area: "Katong", region: "east", price: "$$", tags: ["Chain", "Classes"], hours: "6am–11pm" },
    { name: "ActiveSG Gym @ Bedok", area: "Bedok", region: "east", price: "$", tags: ["Public", "Budget"], hours: "7am–10pm" },
    { name: "Anytime Fitness Tampines", area: "Tampines", region: "east", price: "$$", tags: ["24/7", "Chain"], hours: "24 hours" },
    { name: "ActiveSG Gym @ Woodlands", area: "Woodlands", region: "north", price: "$", tags: ["Public", "Budget"], hours: "7am–9:30pm" },
    { name: "The Gym Pod Yishun", area: "Yishun", region: "north", price: "$$", tags: ["Private Pod", "24/7"], hours: "24 hours" },
    { name: "Ground Zero Sengkang", area: "Sengkang", region: "north", price: "$$", tags: ["Strength", "Coaching"], hours: "6am–11pm" },
    { name: "Virgin Active Orchard", area: "Orchard", region: "central", price: "$$$", tags: ["Premium", "Pool"], hours: "6am–10pm" },
    { name: "UFIT Bugis", area: "Bugis", region: "central", price: "$$$", tags: ["Personal Training", "Classes"], hours: "6am–9pm" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("gymGrid");
    if (!grid) return;
    var search = document.getElementById("gymSearch");
    var count = document.getElementById("gymCount");
    var state = { q: "", region: "all" };

    function render() {
      var list = GYMS.filter(function (g) {
        var okR = state.region === "all" || g.region === state.region;
        var q = state.q.toLowerCase();
        var okQ = g.name.toLowerCase().indexOf(q) !== -1 || g.area.toLowerCase().indexOf(q) !== -1;
        return okR && okQ;
      });
      count.textContent = list.length + (list.length === 1 ? " gym" : " gyms") + " found";
      grid.innerHTML = list.length ? list.map(function (g) {
        var maps = "https://www.google.com/maps/search/" + encodeURIComponent(g.name + " Singapore");
        var tags = g.tags.map(function (t) { return '<span class="gym-tag">' + t + "</span>"; }).join("");
        return '<div class="col-md-6 col-lg-4"><div class="gym-card">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<h3 class="fs-1-3">' + g.name + '</h3><span class="badge-soft">' + g.price + "</span></div>" +
          '<p class="gym-meta mb-1">📍 ' + g.area + ", Singapore</p>" +
          '<p class="gym-meta mb-2">🕑 ' + g.hours + "</p>" +
          "<div class='mb-3'>" + tags + "</div>" +
          '<a href="' + maps + '" target="_blank" rel="noopener" class="btn btn-lime btn-sm">View on map ↗</a>' +
          "</div></div>";
      }).join("") : '<div class="col-12"><p class="text-center text-muted-soft py-5">No gyms match your search — try another area.</p></div>';
    }

    search.addEventListener("input", function () { state.q = search.value; render(); });
    document.querySelectorAll("[data-region]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.region = b.getAttribute("data-region");
        document.querySelectorAll("[data-region]").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        render();
      });
    });
    render();
  });
})();
