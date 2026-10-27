(() => {
  // Analytics receives fixed event names and labels only, never student input or destination URLs.
  function track(name, params = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }
  document.addEventListener('click', event => {
    const a = event.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const location = a.closest('section')?.id || (a.closest('nav') ? 'navigation' : 'other');
    if (href.startsWith('https://calendar.app.google/')) track('booking_click', {placement:location});
    else if (href.startsWith('https://wa.me/')) track(a.classList.contains('erc-plan-link') ? 'plan_enquiry_click' : 'whatsapp_click', {placement:location});
  });
  const root = document.getElementById('demo-interactive');
  if (!root) return;
  const questions = [
    {context:'Escucha la conversación completa y fíjate en cómo se presentan.', question:'¿Cómo se llaman las dos personas?', options:['Anna y Pete.','Anna y Paul.','Amy y Pete.'], answer:0, why:'Se presentan como Anna y Pete.', practice:'“I’m…” e “I am…” sirven para decir tu nombre.'},
    {context:'Puedes volver a escuchar el mismo audio. Presta atención al nombre de Anna.', question:'¿Cómo se escribe el nombre de Anna?', options:['A-N-A.','A-N-N-A.','A-M-A.'], answer:1, why:'Anna corrige a Pete y deletrea A-N-N-A: lleva dos letras n.', practice:'Practica deletrear tu propio nombre en inglés.'},
    {context:'Escucha el final de la conversación.', question:'¿Qué hay en 1400 Irving Street?', options:['La oficina de Pete.','Una escuela de inglés.','El nuevo apartamento de Anna.'], answer:2, why:'Al final, Anna identifica el lugar como su nuevo apartamento.', practice:'Para hablar de un lugar nuevo para ti puedes decir “My new…” y añadir el nombre del lugar.'}
  ];
  const get = id => document.getElementById(id);
  let index = 0, correct = 0, answered = false, started = false;
  let results = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const recording = get('demo-recording');
  function playing(active) {
    get('prueba').classList.toggle('is-playing', active);
    get('demo-play-state').textContent = active ? 'Escuchando…' : recording.ended ? 'Puedes volver a escucharlo' : 'Pulsa reproducir y escucha';
  }
  recording.addEventListener('play', () => playing(true));
  recording.addEventListener('pause', () => playing(false));
  recording.addEventListener('ended', () => playing(false));
  function animatePanel() {
    const panel = get('demo-question-panel');
    if (!reducedMotion.matches && panel.animate) panel.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:300,easing:'ease-out'});
  }
  function stopAudio() {recording.pause();}
  recording.addEventListener('error', () => {
    get('demo-audio-note').insertAdjacentHTML('beforeend', '<br>No se pudo cargar el audio. Abre la lección original para escucharlo.');
  }, {once:true});
  function render(focus = false) {
    answered = false;
    const q = questions[index];
    get('demo-step').textContent = `Pregunta ${index + 1} de 3`;
    get('demo-progress').value = index;
    get('demo-question').textContent = q.question;
    get('demo-feedback').textContent = '';
    get('demo-feedback').className = '';
    get('demo-next').hidden = true;
    get('demo-next').textContent = index === 2 ? 'Terminar la práctica →' : 'Siguiente pregunta →';
    get('demo-options').replaceChildren();
    q.options.forEach((text, choice) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = text;
      b.addEventListener('click', () => answer(choice));
      get('demo-options').append(b);
    });
    animatePanel();
    if (focus) get('demo-question').focus();
  }
  function answer(choice) {
    if (answered) return;
    answered = true;
    if (!started) { track('lesson_start'); started = true; }
    const q = questions[index], right = choice === q.answer;
    results[index] = right;
    if (right) correct++;
    [...get('demo-options').children].forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('is-correct');
      if (i === choice && !right) b.classList.add('is-incorrect');
    });
    const feedback = get('demo-feedback');
    feedback.className = 'erc-demo-feedback';
    feedback.textContent = right ? '✓ Correcto.' : '✕ Incorrecto. Respuesta: ' + q.options[q.answer];
    get('demo-progress').value = index + 1;
    get('demo-next').hidden = false;
  }
  get('demo-next').addEventListener('click', () => {
    if (!answered) return;
    if (index < 2) {index++; render(true); return;}
    stopAudio();
    root.hidden = true; get('demo-result').hidden = false;
    get('demo-score').textContent = `${correct} de 3 respuestas correctas.`;
    get('demo-score-number').replaceChildren(document.createTextNode(String(correct)));
    const denominator = document.createElement('span'); denominator.textContent = '/3';
    get('demo-score-number').append(denominator);
    const ring = get('demo-ring-value');
    ring.style.strokeDasharray = '100';
    ring.style.strokeDashoffset = String(100 - correct / 3 * 100);
    if (!reducedMotion.matches && ring.animate) ring.animate([{strokeDashoffset:'100'},{strokeDashoffset:String(100 - correct / 3 * 100)}],{duration:850,easing:'ease-out'});
    get('demo-result-steps').replaceChildren();
    results.forEach((right, i) => {
      const badge = document.createElement('span');
      badge.className = right ? 'is-correct' : 'is-incorrect';
      badge.textContent = (right ? '✓ ' : '↻ ') + 'Pregunta ' + (i + 1);
      badge.setAttribute('aria-label', 'Pregunta ' + (i + 1) + (right ? ': correcta' : ': para repasar'));
      get('demo-result-steps').append(badge);
    });
    get('demo-result-title').focus(); track('lesson_complete');
  });
  get('demo-restart').addEventListener('click', () => {
    stopAudio(); recording.currentTime = 0;
    index = 0; correct = 0; started = false; results = [];
    get('demo-result').hidden = true; root.hidden = false; render(true);
  });
  window.addEventListener('pagehide', stopAudio);
  root.hidden = false;
  render();
})();

