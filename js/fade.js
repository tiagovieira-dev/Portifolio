document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const autoRevealSelector = isMobile
    ? "section h2, section .card, section .servico, section .timeline-item, section .btn-cta"
    : "section h2, section p, section h3, section .card, section .servico, section .timeline-item, section .btn-cta";

  const autoRevealElements = document.querySelectorAll(autoRevealSelector);

  autoRevealElements.forEach((el) => {
    if (!el.classList.contains("reveal")) {
      el.classList.add("reveal");
    }
  });

  const revealElements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: isMobile ? 0.08 : 0.15,
      rootMargin: isMobile ? "0px 0px -5% 0px" : "0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
});