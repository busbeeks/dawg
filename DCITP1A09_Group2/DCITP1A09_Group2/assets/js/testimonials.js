/* Testimonials & FAQ — rating filter, leave-a-review (localStorage), contact validation */
(function () {
  "use strict";
  var KEY = "kahlid_reviews";
  function loadReviews() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function saveReviews(a) { localStorage.setItem(KEY, JSON.stringify(a)); }
  function stars(n) {
    var s = "";
    for (var i = 0; i < 5; i++) s += i < n ? "★" : '<span class="off">★</span>';
    return s;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("reviewGrid");
    if (grid) {
      // render saved user reviews (newest first, prepended before static cards)
      loadReviews().forEach(function (r) {
        grid.insertAdjacentHTML("afterbegin", reviewCard(r.name, r.rating, r.text));
      });

      var currentStar = "all";
      function applyFilter() {
        var cards = grid.querySelectorAll("[data-rating]");
        var shown = 0;
        cards.forEach(function (c) {
          var show = currentStar === "all" || c.getAttribute("data-rating") === currentStar;
          c.style.display = show ? "" : "none";
          if (show) shown++;
        });
        document.getElementById("reviewEmpty").style.display = shown === 0 ? "block" : "none";
      }
      document.querySelectorAll("[data-star]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          currentStar = btn.getAttribute("data-star");
          document.querySelectorAll("[data-star]").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          applyFilter();
        });
      });

      function reviewCard(name, rating, text) {
        var initial = (name.trim()[0] || "?").toUpperCase();
        return '<div class="col-md-6 col-lg-4" data-rating="' + rating + '">' +
          '<div class="card-flat h-100">' +
            '<div class="stars mb-2" aria-label="' + rating + ' out of 5 stars">' + stars(rating) + "</div>" +
            "<p>&ldquo;" + escapeHtml(text) + "&rdquo;</p>" +
            '<div class="d-flex align-items-center gap-3 mt-3"><div class="avatar-initial">' + escapeHtml(initial) + "</div>" +
              "<div><strong>" + escapeHtml(name) + "</strong><br><small class=\"text-muted-soft\">New member</small></div></div>" +
          "</div></div>";
      }
      function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

      // review form
      var rForm = document.getElementById("reviewForm");
      if (rForm) {
        function rErr(id, m) { var el = document.getElementById(id); if (el) el.classList.add("is-invalid"); var e = document.getElementById(id + "Err"); if (e) { e.textContent = m; e.classList.add("show"); } }
        function rClr(id) { var el = document.getElementById(id); if (el) el.classList.remove("is-invalid"); var e = document.getElementById(id + "Err"); if (e) e.classList.remove("show"); }
        rForm.addEventListener("submit", function (e) {
          e.preventDefault();
          ["rvName", "rvText"].forEach(rClr);
          document.getElementById("rvRatingErr").classList.remove("show");
          var ok = true;
          var name = document.getElementById("rvName").value.trim();
          var text = document.getElementById("rvText").value.trim();
          var ratingEl = rForm.querySelector('input[name="rvRating"]:checked');
          if (name.length < 2) { rErr("rvName", "Please enter your name."); ok = false; }
          if (!ratingEl) { document.getElementById("rvRatingErr").textContent = "Please pick a star rating."; document.getElementById("rvRatingErr").classList.add("show"); ok = false; }
          if (text.length < 10) { rErr("rvText", "Review must be at least 10 characters."); ok = false; }
          if (!ok) return;
          var rating = parseInt(ratingEl.value, 10);
          grid.insertAdjacentHTML("afterbegin", reviewCard(name, rating, text));
          var saved = loadReviews();
          saved.unshift({ name: name, rating: String(rating), text: text });
          saveReviews(saved);
          rForm.reset();
          applyFilter();
          var thanks = document.getElementById("rvThanks");
          thanks.classList.remove("is-hidden");
          setTimeout(function () { thanks.classList.add("is-hidden"); }, 4000);
        });
      }
    }

    // contact form
    var form = document.getElementById("contactForm");
    if (!form) return;
    function setErr(id, msg) { var el = document.getElementById(id); el.classList.add("is-invalid"); var e = document.getElementById(id + "Err"); if (e) { e.textContent = msg; e.classList.add("show"); } }
    function clr(id) { var el = document.getElementById(id); el.classList.remove("is-invalid"); var e = document.getElementById(id + "Err"); if (e) e.classList.remove("show"); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["ctName", "ctEmail", "ctMessage"].forEach(clr);
      if (document.getElementById("ctName").value.trim().length < 2) { setErr("ctName", "Please enter your name."); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("ctEmail").value)) { setErr("ctEmail", "Enter a valid email."); ok = false; }
      if (document.getElementById("ctMessage").value.trim().length < 10) { setErr("ctMessage", "Message must be at least 10 characters."); ok = false; }
      if (!ok) return;
      form.style.display = "none";
      document.getElementById("contactConfirm").style.display = "block";
    });
  });
})();
