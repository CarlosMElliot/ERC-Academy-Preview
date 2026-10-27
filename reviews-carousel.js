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
  const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const update = () => {
    const first = Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
    count.textContent = first + ' / ' + cards.length;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => track.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'});
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  let frame;
  track.addEventListener('scroll', () => {cancelAnimationFrame(frame); frame = requestAnimationFrame(update);}, {passive:true});
  window.addEventListener('resize', update);
  controls.hidden = false;
  update();
})();