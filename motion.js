(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('section h1, section h2, section h3, .hero-bg > div > p, .hero-bg > div > div:last-child, #mission p, #mission img, .timeline-line > div, .price-card, .erc-persistence-stat, .erc-guidance-item, .erc-about-portrait, .erc-about-content, #contact form, .erc-rating, main > h1, main > h2, main > .card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!preference.matches) entry.target.classList.add('erc-reveal-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  targets.forEach((target, index) => {
    target.style.setProperty('--erc-delay', (index % 3) * 100 + 'ms');
    observer.observe(target);
  });
  preference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      targets.forEach(target => target.classList.remove('erc-reveal-in'));
    }
  });
})();