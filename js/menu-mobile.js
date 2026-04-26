function iniciarMenu() {
  const toggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu a");
  const logoLink = document.querySelector(".logo a");
  const backdrop = document.querySelector("#menu-backdrop");

  if (!toggle || !menu) {
    console.error("Menu ou botão não encontrado");
    return;
  }

  // Ajusta links do menu para funcionar tanto na index quanto nas páginas internas.
  const currentPath = window.location.pathname.replace(/\/+$/, "");
  const isPageInsidePagesDir = /\/pages\//.test(currentPath);
  const routePrefix = isPageInsidePagesDir ? "../" : "";

  if (logoLink && logoLink.dataset.route) {
    logoLink.href = `${routePrefix}${logoLink.dataset.route}`;
  }

  menuLinks.forEach((link) => {
    if (link.dataset.route) {
      link.href = `${routePrefix}${link.dataset.route}`;
    }
  });

  // Define o item ativo conforme a rota atual.
  menuLinks.forEach((link) => {
    link.removeAttribute("aria-current");
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, "");

    if (linkPath === currentPath || (currentPath === "" && linkPath.endsWith("/index.html"))) {
      link.setAttribute("aria-current", "page");
    }
  });

  const closeMenu = () => {
    menu.classList.remove("active");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    menu.classList.add("active");
    toggle.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const toggleMenu = () => {
    if (menu.classList.contains("active")) {
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

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  if (backdrop) {
    backdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", closeMenu);
}