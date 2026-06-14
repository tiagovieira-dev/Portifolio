function iniciarMenu() {
  const toggle = document.querySelector("#menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  const mobileLinks = document.querySelectorAll(".menu-mobile-links a");
  const mobileCta = document.querySelector(".menu-mobile-cta");
  const backdrop = document.querySelector("#menu-backdrop");
  const mainMenu = document.querySelector("#main-menu");
  const routeLinks = document.querySelectorAll("[data-route]");

  if (!toggle || !mobileMenu) {
    console.error("Menu ou botão não encontrado");
    return;
  }

  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const isPageInsidePagesDir = /\/pages\//.test(currentPath);
  const routePrefix = isPageInsidePagesDir ? "../" : "";

  routeLinks.forEach((link) => {
    if (link.dataset.route) {
      link.href = `${routePrefix}${link.dataset.route}`;
    }
  });

  routeLinks.forEach((link) => {
    link.removeAttribute("aria-current");
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, "");

    if (linkPath === currentPath || (currentPath === "" && linkPath.endsWith("/index.html"))) {
      link.setAttribute("aria-current", "page");
    }
  });

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    mobileMenu.classList.add("active");
    toggle.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
      return;
    }
    openMenu();
  };

  toggle.addEventListener("click", () => {
    toggleMenu();
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMenu();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  if (mobileCta) {
    mobileCta.addEventListener("click", () => {
      closeMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", closeMenu);

  const updateMenuScroll = () => {
    if (!mainMenu) return;
    mainMenu.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateMenuScroll();
  window.addEventListener("scroll", updateMenuScroll, { passive: true });
}