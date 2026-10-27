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
    {context:'No entendiste lo que dijo la otra persona.', phrase:'Could you say that again, please?', question:'¿Qué estás pidiendo?', options:['Que repita lo que dijo.','Que hable más rápido.','Que termine la conversación.'], answer:0, why:'“Say that again” significa “repite eso”. “Could you… please?” hace que la petición suene amable.', practice:'Úsala cuando necesites escuchar una idea otra vez.'},
    {context:'Te preguntan cómo va tu práctica de inglés.', phrase:'I used to study English, but I want to start again.', question:'¿Qué expresa esta frase?', options:['Que nunca has estudiado inglés.','Que estudiaste antes y quieres retomar.','Que ya no quieres aprender.'], answer:1, why:'“Used to” habla de algo habitual en el pasado. “Start again” expresa la intención de retomar.', practice:'Puedes cambiar “English” por otra actividad que quieras retomar.'},
    {context:'Estás organizando tu próxima clase.', phrase:'Would Thursday afternoon work for you?', question:'¿Qué quiere confirmar la persona?', options:['Si trabajas todos los jueves.','Si la clase ya terminó.','Si el jueves por la tarde te viene bien.'], answer:2, why:'“Work for you” aquí significa “venirte bien”, no “trabajar para ti”. Se usa para proponer horarios.', practice:'Puedes responder: “Yes, that works for me.”'}
  ];
  const get = id => document.getElementById(id);
  let index = 0, correct = 0, answered = false, started = false;
  let speechTimer, currentUtterance;
  const audio = get('demo-listen');
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  function stopAudio() {
    clearTimeout(speechTimer);
    if (currentUtterance) {currentUtterance.onend = null; currentUtterance.onerror = null; currentUtterance = null;}
    if (canSpeak) window.speechSynthesis.cancel();
    audio.disabled = false;
    audio.textContent = 'Escuchar la frase';
  }
  function audioFallback() {
    stopAudio();
    get('demo-transcript').open = true;
    get('demo-audio-note').textContent = 'El audio no está disponible. Puedes completar la actividad leyendo la frase.';
  }
  function render(focus = false) {
    stopAudio(); answered = false;
    const q = questions[index];
    get('demo-step').textContent = `Situación ${index + 1} de 3`;
    get('demo-progress').value = index;
    get('demo-question').textContent = q.question;
    get('demo-context').textContent = q.context;
    get('demo-phrase').textContent = q.phrase;
    get('demo-transcript').open = !canSpeak;
    get('demo-feedback').textContent = '';
    get('demo-feedback').className = '';
    get('demo-next').hidden = true;
    get('demo-next').textContent = index === 2 ? 'Terminar la práctica →' : 'Siguiente situación →';
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
  audio.addEventListener('click', () => {
    if (!canSpeak) {audioFallback(); return;}
    stopAudio();
    try {
      const utterance = new SpeechSynthesisUtterance(questions[index].phrase);
      currentUtterance = utterance;
      utterance.lang = 'en-US'; utterance.rate = .85;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'));
      if (voice) utterance.voice = voice;
      audio.disabled = true; audio.textContent = 'Reproduciendo…';
      utterance.onend = stopAudio;
      utterance.onerror = audioFallback;
      window.speechSynthesis.speak(utterance);
      speechTimer = setTimeout(audioFallback, 15000);
    } catch {audioFallback();}
  });
  get('demo-next').addEventListener('click', () => {
    if (!answered) return;
    if (index < 2) {index++; render(true); return;}
    root.hidden = true; get('demo-result').hidden = false;
    get('demo-score').textContent = `Completaste las 3 situaciones: ${correct} de 3 respuestas correctas en el primer intento. Repasar también es parte de aprender.`;
    get('demo-result-title').focus(); track('lesson_complete');
  });
  get('demo-restart').addEventListener('click', () => {
    index = 0; correct = 0; started = false;
    get('demo-result').hidden = true; root.hidden = false; render(true);
  });
  window.addEventListener('pagehide', stopAudio);
  root.hidden = false;
  render();
  if (!canSpeak) {audio.hidden = true; audioFallback();}
})();
