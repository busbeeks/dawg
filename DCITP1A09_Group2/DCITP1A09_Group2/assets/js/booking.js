/* Booking form */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("bookingForm");
    if (!form) return;

    function setErr(id, msg) {
      var el = document.getElementById(id);
      el.classList.add("is-invalid"); el.classList.remove("is-valid");
      var e = document.getElementById(id + "Err");
      if (e) { e.textContent = msg; e.classList.add("show"); }
    }
    function setOk(id) {
      var el = document.getElementById(id);
      el.classList.remove("is-invalid"); el.classList.add("is-valid");
      var e = document.getElementById(id + "Err");
      if (e) e.classList.remove("show");
    }

    var validators = {
      bkName: function (v) { return v.trim().length >= 2 || "Please enter your full name."; },
      bkEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address."; },
      bkPhone: function (v) { return /^[0-9\s\-]{6,14}$/.test(v) || "Enter a valid phone number (digits only)."; },
      bkService: function (v) { return v !== "" || "Please choose a service."; },
      bkTrainer: function (v) { return v !== "" || "Please pick a trainer."; },
      bkDate: function (v) {
        if (!v) return "Please choose a date.";
        var today = new Date(); today.setHours(0, 0, 0, 0);
        return new Date(v) >= today || "Choose today or a future date.";
      }
    };

    Object.keys(validators).forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener("blur", function () {
        var res = validators[id](el.value);
        res === true ? setOk(id) : setErr(id, res);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Object.keys(validators).forEach(function (id) {
        var el = document.getElementById(id);
        var res = validators[id](el.value);
        if (res === true) setOk(id); else { setErr(id, res); ok = false; }
      });
      if (!document.getElementById("bkTerms").checked) {
        document.getElementById("bkTermsErr").classList.add("show"); ok = false;
      } else { document.getElementById("bkTermsErr").classList.remove("show"); }

      if (!ok) { form.querySelector(".is-invalid").focus(); return; }

      var name = document.getElementById("bkName").value.trim();
      var service = document.getElementById("bkService");
      var trainer = document.getElementById("bkTrainer");
      var date = document.getElementById("bkDate").value;

      document.getElementById("confName").textContent = name;
      document.getElementById("confService").textContent = service.options[service.selectedIndex].text;
      document.getElementById("confTrainer").textContent = trainer.options[trainer.selectedIndex].text;
      document.getElementById("confDate").textContent = new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

      form.style.display = "none";
      var box = document.getElementById("bookingConfirm");
      box.style.display = "block";
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    var again = document.getElementById("bookAgain");
    if (again) again.addEventListener("click", function () {
      form.reset();
      Object.keys(validators).forEach(function (id) {
        document.getElementById(id).classList.remove("is-valid", "is-invalid");
      });
      document.getElementById("bookingConfirm").style.display = "none";
      form.style.display = "block";
    });
  });
})();
