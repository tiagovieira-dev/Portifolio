const canvas = document.getElementById("bg-canvas");
if (!canvas) {
  // Página sem canvas de fundo
} else {
  const ctx = canvas.getContext("2d");

  let particles = [];
  let scrollTarget = 0;
  let scrollCurrent = 0;
  let isScrolling = false;
  let scrollEndTimeout;
  let animationId = 0;
  let isAnimating = true;

  function isMobileOrTablet() {
    return window.innerWidth <= 1024;
  }

  function isSmallMobile() {
    return window.innerWidth <= 768;
  }

  function getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.visualViewport?.height ?? window.innerHeight,
    };
  }

  function getParticleCount() {
    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;

    if (width <= 768) return 18;

    if (width <= 1024) return 44;

    if (width >= 2560) return 90;

    if (dpr > 1.5) return 140;

    return 200;
  }

  function getMaxDistance() {
    const width = window.innerWidth;
    if (width <= 768) return 64;
    if (width <= 1024) return 90;
    return 120;
  }

  function getLineStep() {
    if (isSmallMobile()) return 3;
    if (isMobileOrTablet()) return 2;
    return 1;
  }

  const CONFIG = {
    count: getParticleCount(),
    color: "#17D1B2",
    maxDistance: getMaxDistance(),
  };

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function resize() {
    const { width, height } = getViewportSize();
    const dpr = window.devicePixelRatio || 1;
    const pixelRatio = isMobileOrTablet() ? 1 : Math.min(dpr, 1.5);

    canvas.width = Math.max(1, Math.floor(width * pixelRatio));
    canvas.height = Math.max(1, Math.floor(height * pixelRatio));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  resize();

  let resizeTimeout;
  function handleViewportChange() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      CONFIG.count = getParticleCount();
      CONFIG.maxDistance = getMaxDistance();
      init();
    }, 150);
  }

  window.addEventListener("resize", handleViewportChange);

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleViewportChange);
  }

  window.addEventListener(
    "scroll",
    () => {
      scrollTarget = window.scrollY;

      if (!isMobileOrTablet()) return;

      isScrolling = true;
      clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(() => {
        isScrolling = false;
      }, 120);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isAnimating = false;
      cancelAnimationFrame(animationId);
      return;
    }

    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      const { width, height } = getViewportSize();
      this.x = Math.random() * width;
      this.y = Math.random() * height;

      this.size = Math.random() * 2 + 0.5;

      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;

      this.depth = Math.random();
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      const { width, height } = getViewportSize();

      if (this.x > width) this.x = 0;
      if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      if (this.y < 0) this.y = height;
    }

    draw() {
      const { height } = getViewportSize();
      const y =
        ((this.y + scrollCurrent * (0.05 + this.depth * 0.15)) % height + height) %
        height;

      this.renderY = y;

      ctx.beginPath();
      ctx.arc(this.x, y, this.size, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(23, 209, 178, ${0.15 + this.depth * 0.3})`;
      ctx.fill();
    }
  }

  function drawLines() {
    if (isMobileOrTablet() && isScrolling) return;

    const maxDistSq = CONFIG.maxDistance * CONFIG.maxDistance;
    const step = getLineStep();

    for (let i = 0; i < particles.length; i += step) {
      for (let j = i + 1; j < particles.length; j += step) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].renderY - particles[j].renderY;

        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const opacity = 1 - distSq / maxDistSq;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].renderY);
          ctx.lineTo(particles[j].x, particles[j].renderY);

          ctx.strokeStyle = `rgba(23, 209, 178, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particles = [];

    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    animationId = requestAnimationFrame(animate);

    if (document.hidden) return;

    clearCanvas();

    scrollCurrent += (scrollTarget - scrollCurrent) * (isSmallMobile() ? 0.12 : 0.08);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    drawLines();
  }

  init();
  animate();
}
