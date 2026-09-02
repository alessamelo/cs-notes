/* =========================================================
   HTML Study Notes — interactivity
   1. Theme toggle (light/dark), remembered in memory only
   2. Mobile sidebar open/close
   3. Scrollspy: highlight the current chapter in the sidebar
   4. Back-to-top button
   5. Demo form: capture + display submitted values (no server)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var themeIcon = themeBtn ? themeBtn.querySelector(".theme-toggle__icon") : null;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.textContent = "☀️";
    } else {
      root.setAttribute("data-theme", "light");
      if (themeIcon) themeIcon.textContent = "🌙";
    }
  }

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- 2. Mobile sidebar ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (overlay) overlay.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  function toggleSidebar() {
    if (!sidebar) return;
    var isOpen = sidebar.classList.toggle("is-open");
    if (overlay) overlay.classList.toggle("is-open", isOpen);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle) navToggle.addEventListener("click", toggleSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      // Close the mobile drawer after choosing a section.
      if (window.matchMedia("(max-width: 780px)").matches) closeSidebar();
    });
  });

  /* ---------- 3. Scrollspy ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .chapter, #top"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- 4. Back to top ---------- */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 5. Demo form capture ---------- */
  var demoForm = document.getElementById("demo-form");
  var formOutput = document.getElementById("form-output");
  var formOutputCode = document.getElementById("form-output-code");

  if (demoForm && formOutput && formOutputCode) {
    demoForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(demoForm);
      var lines = [];
      var seen = {};

      data.forEach(function (value, key) {
        if (value instanceof File) {
          value = value.name ? value.name + " (file)" : "(no file chosen)";
        }
        if (seen[key]) {
          seen[key].push(value);
        } else {
          seen[key] = [value];
        }
      });

      Object.keys(seen).forEach(function (key) {
        lines.push(key + ": " + seen[key].join(", "));
      });

      formOutputCode.textContent = lines.length
        ? lines.join("\n")
        : "(no fields had values)";
      formOutput.hidden = false;
      formOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
