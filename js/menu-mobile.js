function iniciarMenu() {
  const toggle = document.querySelector("#menu-toggle");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu a");
  const logoLink = document.querySelector(".logo a");

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

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}