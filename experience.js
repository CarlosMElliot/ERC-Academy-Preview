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
  const transcript = `Pete: Hi! Are you Anna?
Anna: Yes! Hi there! Are you Pete?
Pete: I am Pete.
Anna: Nice to meet you.
Anna: Let's try that again. I'm Anna. Nice to meet you.
Pete: I'm Pete. “Anna” Is that A-N-A?
Anna: No. A-N-N-A.
Pete: Well, Anna with two “n's” ... Welcome to ... 1400 Irving Street!
Anna: My new apartment! Yes!`;
  const questions = [
    {context:'Escucha la conversación completa y fíjate en cómo se presentan.', phrase:transcript, question:'¿Cómo se llaman las dos personas?', options:['Anna y Pete.','Anna y Paul.','Amy y Pete.'], answer:0, why:'Se presentan como Anna y Pete.', practice:'“I’m…” e “I am…” sirven para decir tu nombre.'},
    {context:'Puedes volver a escuchar el mismo audio. Presta atención al nombre de Anna.', phrase:transcript, question:'¿Cómo se escribe el nombre de Anna?', options:['A-N-A.','A-N-N-A.','A-M-A.'], answer:1, why:'Anna corrige a Pete y deletrea A-N-N-A: lleva dos letras n.', practice:'Practica deletrear tu propio nombre en inglés.'},
    {context:'Escucha el final de la conversación.', phrase:transcript, question:'¿Qué hay en 1400 Irving Street?', options:['La oficina de Pete.','Una escuela de inglés.','El nuevo apartamento de Anna.'], answer:2, why:'Al final, Anna identifica el lugar como su nuevo apartamento.', practice:'Para hablar de un lugar nuevo para ti puedes decir “My new…” y añadir el nombre del lugar.'}
  ];
  const get = id => document.getElementById(id);
  let index = 0, correct = 0, answered = false, started = false;
  const recording = get('demo-recording');
  function stopAudio() {recording.pause();}
  recording.addEventListener('error', () => {
    get('demo-transcript').open = true;
    get('demo-audio-note').insertAdjacentHTML('beforeend', '<br>No se pudo cargar el audio. Abre la lección original o usa la transcripción para practicar.');
  }, {once:true});
  function render(focus = false) {
    stopAudio(); answered = false;
    const q = questions[index];
    get('demo-step').textContent = `Pregunta ${index + 1} de 3`;
    get('demo-progress').value = index;
    get('demo-question').textContent = q.question;
    get('demo-context').textContent = q.context;
    get('demo-phrase').textContent = q.phrase;
    get('demo-transcript').open = false;
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
    if (focus) get('demo-question').focus();
  }
  function answer(choice) {
    if (answered) return;
    answered = true; stopAudio();
    if (!started) { track('lesson_start'); started = true; }
    const q = questions[index], right = choice === q.answer;
    if (right) correct++;
    [...get('demo-options').children].forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('is-correct');
      if (i === choice && !right) b.classList.add('is-incorrect');
    });
    get('demo-transcript').open = true;
    const feedback = get('demo-feedback');
    feedback.className = 'erc-demo-feedback';
    feedback.textContent = `${right ? '¡Bien!' : 'Vamos a repasarlo.'} ${!right ? 'Respuesta: ' + q.options[q.answer] + ' ' : ''}${q.why} ${q.practice}`;
    get('demo-progress').value = index + 1;
    get('demo-next').hidden = false;
  }
  get('demo-next').addEventListener('click', () => {
    if (!answered) return;
    if (index < 2) {index++; render(true); return;}
    root.hidden = true; get('demo-result').hidden = false;
    get('demo-score').textContent = `Completaste las 3 preguntas: ${correct} de 3 respuestas correctas en el primer intento. Repasar también es parte de aprender.`;
    get('demo-result-title').focus(); track('lesson_complete');
  });
  get('demo-restart').addEventListener('click', () => {
    index = 0; correct = 0; started = false;
    get('demo-result').hidden = true; root.hidden = false; render(true);
  });
  window.addEventListener('pagehide', stopAudio);
  root.hidden = false;
  render();
})();

