/* components.js — shared nav + footer injection & global UX
   Injects consistent navigation/footer (CRAP: repetition) and
   powers scroll reveals, parallax, marquee & mobile menu. */
(function () {
  "use strict";

  var NAV = [
    { label: "Home", href: "index.html" },
    { label: "Health Tools", children: [
      { label: "BMI Calculator", href: "bmi-calculator.html" },
      { label: "Calorie Calculator", href: "calorie-calculator.html" }
    ]},
    { label: "Workouts", children: [
      { label: "Progress Tracker", href: "progress-tracker.html" },
      { label: "Find a Gym", href: "find-gym.html" },
      { label: "Build Your Own", href: "build-workout.html" }
    ]},
    { label: "Nutrition", children: [
      { label: "Nutrition Guide", href: "nutrition-guide.html" },
      { label: "Food Database", href: "food-database.html" },
      { label: "Meal Planner", href: "meal-planner.html" }
    ]},
    { label: "Community", children: [
      { label: "Book a Trainer", href: "book-trainer.html" },
      { label: "Class Schedule", href: "class-schedule.html" },
      { label: "Testimonials & FAQ", href: "testimonials-faq.html" }
    ]}
  ];

  var current = location.pathname.split("/").pop() || "index.html";
  // pages/ live one level deep; resolve links from either root or pages/
  var inPages = /\/pages\//.test(location.pathname);
  function href(file) {
    if (file === "index.html") return inPages ? "../index.html" : "index.html";
    return inPages ? file : "pages/" + file;
  }

  function buildNav() {
    var items = NAV.map(function (item) {
      if (item.children) {
        var childActive = item.children.some(function (c) { return c.href === current; });
        var links = item.children.map(function (c) {
          var a = c.href === current ? " active" : "";
          return '<li><a class="dropdown-item' + a + '" href="' + href(c.href) + '">' + c.label + "</a></li>";
        }).join("");
        return '<li class="nav-item dropdown">' +
          '<a class="nav-link dropdown-toggle' + (childActive ? " active" : "") + '" href="#" role="button" aria-expanded="false">' + item.label + "</a>" +
          '<ul class="dropdown-menu">' + links + "</ul></li>";
      }
      var act = item.href === current ? " active" : "";
      return '<li class="nav-item"><a class="nav-link' + act + '" href="' + href(item.href) + '">' + item.label + "</a></li>";
    }).join("");

    return '<nav class="site-nav" id="siteNav"><div class="container">' +
      '<div class="navbar navbar-expand-lg p-0">' +
        '<a class="brand" href="' + href("index.html") + '">KAH<span>L</span>ID<span class="dot">.</span></a>' +
        '<button class="navbar-toggler ms-auto" type="button" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>' +
        '<div class="collapse navbar-collapse justify-content-end" id="navMenu">' +
          '<ul class="navbar-nav align-items-lg-center gap-lg-1">' + items + "</ul>" +
          '<a href="' + href("book-trainer.html") + '" class="btn btn-flame ms-lg-3 mt-3 mt-lg-0">Book Now</a>' +
        "</div>" +
      "</div></div></nav>";
  }

  function buildFooter() {
    return '<footer class="site-footer"><div class="container">' +
      '<div class="row g-5">' +
        '<div class="col-lg-4"><div class="footer-brand">KAH<span>L</span>ID</div>' +
          '<p class="text-muted-soft mt-3 maxw-34">Your baseline. Your plan. Your pace. Fitness &amp; nutrition tools built for people just getting started.</p></div>' +
        '<div class="col-6 col-lg-2"><h5>Tools</h5>' +
          '<a href="' + href("bmi-calculator.html") + '">BMI Calculator</a><a href="' + href("calorie-calculator.html") + '">Calorie Calculator</a><a href="' + href("build-workout.html") + '">Build a Workout</a><a href="' + href("meal-planner.html") + '">Meal Planner</a></div>' +
        '<div class="col-6 col-lg-2"><h5>Explore</h5>' +
          '<a href="' + href("progress-tracker.html") + '">Progress Tracker</a><a href="' + href("nutrition-guide.html") + '">Nutrition</a><a href="' + href("food-database.html") + '">Food Database</a><a href="' + href("class-schedule.html") + '">Schedule</a></div>' +
        '<div class="col-lg-4"><h5>Get Started</h5>' +
          '<p class="text-muted-soft">Book a free intro session with one of our coaches.</p>' +
          '<a href="' + href("book-trainer.html") + '" class="btn btn-lime mt-2">Book a Trainer</a>' +
          '<p class="text-muted-soft mt-4 mb-0 fs-sm">hello@kahlid.example &middot; +65 6123 4567</p></div>' +
      "</div>" +
      '<div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">' +
        '<span>&copy; <span id="year"></span> KAHLID — Group 2, DCITP/FT/1A/09. Student project.</span>' +
      "</div></div></footer>";
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initParallax() {
    var nodes = document.querySelectorAll("[data-parallax]");
    if (!nodes.length) return;
    var tick = function () {
      var y = window.pageYOffset;
      nodes.forEach(function (n) {
        var speed = parseFloat(n.getAttribute("data-parallax")) || 0.15;
        n.style.transform = "translate3d(0," + (y * speed) + "px,0)";
      });
    };
    window.addEventListener("scroll", function () { window.requestAnimationFrame(tick); }, { passive: true });
    tick();
  }

  function initNavScroll() {
    var nav = document.getElementById("siteNav");
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle("scrolled", window.pageYOffset > 40); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // vanilla replacement for Bootstrap's collapse navbar + dropdowns (no bootstrap.js)
  function initNavMenu() {
    var toggler = document.querySelector(".navbar-toggler");
    var menu = document.getElementById("navMenu");
    if (toggler && menu) {
      toggler.addEventListener("click", function () {
        var open = menu.classList.toggle("show");
        toggler.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    function closeAll() {
      document.querySelectorAll(".dropdown-menu.show").forEach(function (m) { m.classList.remove("show"); });
      document.querySelectorAll(".nav-link.dropdown-toggle").forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
    }
    document.querySelectorAll(".nav-link.dropdown-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        var dm = toggle.closest(".dropdown").querySelector(".dropdown-menu");
        var isOpen = dm.classList.contains("show");
        closeAll();
        if (!isOpen) { dm.classList.add("show"); toggle.setAttribute("aria-expanded", "true"); }
      });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".dropdown")) closeAll(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  }

  // vanilla replacement for Bootstrap's accordion (single-open, no bootstrap.js)
  function initAccordion() {
    document.querySelectorAll(".accordion-button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-bs-target");
        var target = sel && document.querySelector(sel);
        if (!target) return;
        var isOpen = target.classList.contains("show");
        var parentSel = target.getAttribute("data-bs-parent");
        var scope = parentSel ? document.querySelector(parentSel) : document;
        scope.querySelectorAll(".accordion-collapse.show").forEach(function (c) { c.classList.remove("show"); });
        scope.querySelectorAll(".accordion-button").forEach(function (b) { b.classList.add("collapsed"); b.setAttribute("aria-expanded", "false"); });
        if (!isOpen) { target.classList.add("show"); btn.classList.remove("collapsed"); btn.setAttribute("aria-expanded", "true"); }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var navMount = document.getElementById("site-nav");
    var footMount = document.getElementById("site-footer");
    if (navMount) navMount.innerHTML = buildNav();
    if (footMount) footMount.innerHTML = buildFooter();

    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    initNavScroll();
    initNavMenu();
    initAccordion();
    initReveal();
    initParallax();

    // trigger hero on-load reveal
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add("loaded"); });
    });
  });
})();
