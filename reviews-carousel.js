(() => {
  const track = document.getElementById('review-track');
  if (!track) return;
  const section = track.closest('.erc-reviews');
  const controls = section.querySelector('.erc-review-controls');
  const prev = controls.querySelector('[data-review-prev]');
  const next = controls.querySelector('[data-review-next]');
  const count = controls.querySelector('.erc-review-count');
  const cards = Array.from(track.children);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', track.id);
  next.after(toggle);
  let paused = reduced.matches;
  let visible = false;
  let timer;
  const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const canPlay = () => !paused && visible && !document.hidden && !reduced.matches;
  const update = () => {
    const first = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
    count.textContent = first + ' / ' + cards.length;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    const label = paused ? 'Reanudar reseñas automáticas' : 'Pausar reseñas automáticas';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.disabled = reduced.matches;
    count.setAttribute('aria-live', canPlay() ? 'off' : 'polite');
  };
  const schedule = () => {
    clearTimeout(timer);
    update();
    if (!canPlay()) return;
    timer = setTimeout(() => {
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      track.scrollTo({left: atEnd ? 0 : track.scrollLeft + step(), behavior: 'smooth'});
      schedule();
    }, 5000);
  };
  const pause = () => { paused = true; schedule(); };
  const move = direction => {
    schedule();
    track.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'});
  };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  toggle.addEventListener('click', () => {paused = !paused; schedule();});
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('pointerdown', () => clearTimeout(timer), {passive:true});
  window.addEventListener('pointerup', schedule, {passive:true});
  track.addEventListener('wheel', schedule, {passive:true});
  section.addEventListener('focusin', event => {
    if (event.target !== toggle) pause();
  });
  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, {passive:true});
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
    if (reduced.matches) paused = true;
    schedule();
  });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, {threshold: 0.25}).observe(track);
  controls.hidden = false;
  update();
})();