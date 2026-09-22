document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initHeaderScroll();
  initSmoothScroll();
  initReveal();
  initPubFilters();
  initContactForm();
  setYear();
});

function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("as-theme", next);
    } catch (_) {
      /* ignore */
    }
  });
}

function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("click", (event) => {
    if (!toggle.contains(event.target) && !menu.contains(event.target)) {
      close();
    }
  });
}

function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector(".site-header");
      const offset = (header?.offsetHeight || 0) + 12;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", id);
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 5, 4) * 35}ms`;
    observer.observe(el);
  });
}

function initPubFilters() {
  const filters = document.querySelectorAll(".pub-filter");
  const groups = document.querySelectorAll(".pub-group");
  if (!filters.length || !groups.length) return;

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filters.forEach((b) => b.classList.toggle("is-active", b === button));
      groups.forEach((group) => {
        const show = filter === "all" || group.dataset.group === filter;
        group.hidden = !show;
      });
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("contact-status");
  const submit = document.getElementById("contact-submit");
  const endpoint = ((window.SITE_CONTACT && window.SITE_CONTACT.formspreeEndpoint) || "").trim();

  const setStatus = (message, kind) => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind || "";
  };

  if (!endpoint) {
    setStatus(
      "The private contact form needs a one-time Formspree setup (see contact-config.js). Meanwhile, please use LinkedIn.",
      "warn"
    );
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!endpoint) {
      setStatus("Contact form is not connected yet. Please reach out via LinkedIn.", "error");
      return;
    }

    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      setStatus("Thanks — your message was sent.", "success");
      form.reset();
      return;
    }

    if (!form.reportValidity()) return;

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      _replyto: form.email.value.trim(),
    };

    submit.disabled = true;
    setStatus("Sending…", "pending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      form.reset();
      setStatus("Thanks — your message was sent. I’ll get back to you soon.", "success");
    } catch (_) {
      setStatus(
        "Something went wrong sending that message. Please try again or use LinkedIn.",
        "error"
      );
    } finally {
      submit.disabled = false;
    }
  });
}

function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
}
