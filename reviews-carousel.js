(() => {
  const track = document.getElementById('review-track');
  if (!track) return;
  const section = track.closest('.erc-reviews');
  section.querySelector('.erc-review-controls')?.remove();
  const cards = Array.from(track.children);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let focused = false;
  let touching = false;
  let timer;
  const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const schedule = () => {
    clearTimeout(timer);
    if (!visible || focused || touching || document.hidden || reduced.matches) return;
    timer = setTimeout(() => {
      const end = track.scrollWidth - track.clientWidth;
      track.scrollTo({left: track.scrollLeft >= end - 2 ? 0 : Math.min(end, track.scrollLeft + step()), behavior:'smooth'});
      schedule();
    }, 5000);
  };
  track.addEventListener('focusin', () => {focused = true; schedule();});
  track.addEventListener('focusout', event => {
    focused = track.contains(event.relatedTarget);
    schedule();
  });
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    track.scrollBy({left:(event.key === 'ArrowRight' ? 1 : -1) * step(), behavior:reduced.matches ? 'instant' : 'smooth'});
  });
  track.addEventListener('pointerdown', () => {touching = true; schedule();}, {passive:true});
  const release = () => {if (touching) {touching = false; schedule();}};
  window.addEventListener('pointerup', release, {passive:true});
  window.addEventListener('pointercancel', release, {passive:true});
  document.addEventListener('visibilitychange', schedule);
  window.addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, {threshold:0.1}).observe(track);
})();