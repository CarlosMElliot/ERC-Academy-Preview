(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('section > div > h2, section > div > h3, .price-card, .erc-review-card, .erc-guidance-item, .erc-about-portrait, .erc-about-content, main > h1, main > h2, main > .card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!preference.matches) entry.target.classList.add('erc-reveal-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  targets.forEach((target, index) => {
    target.style.setProperty('--erc-delay', (index % 3) * 60 + 'ms');
    observer.observe(target);
  });
  preference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      targets.forEach(target => target.classList.remove('erc-reveal-in'));
    }
  });
})();