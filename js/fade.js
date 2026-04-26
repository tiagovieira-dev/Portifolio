document.addEventListener("DOMContentLoaded", () => {
  const autoRevealElements = document.querySelectorAll(
    "section h2, section p, section h3, section .card, section .servico, section .timeline-item, section .btn-cta"
  );

  autoRevealElements.forEach((el) => {
    el.classList.add("reveal");
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
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
});