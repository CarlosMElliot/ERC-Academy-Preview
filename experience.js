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
  {
    "kind": "Intención",
    "question": "Pete pregunta “Are you Anna?”. ¿Qué intenta confirmar?",
    "options": [
      "Cómo prefiere Anna que escriban su nombre.",
      "Si está hablando con la persona que espera.",
      "Si Anna quiere conocer a alguien llamado Pete."
    ],
    "answer": 1,
    "why": "Pregunta por su identidad; todavía no está comprobando cómo se escribe el nombre."
  },
  {
    "kind": "Palabra en contexto",
    "question": "En “Hi there!”, ¿qué función cumple “there”?",
    "options": [
      "Señala el apartamento al que van a entrar.",
      "Indica que Pete está lejos de Anna.",
      "Forma parte de un saludo informal y amistoso."
    ],
    "answer": 2,
    "why": "“Hi there” funciona como saludo; aquí “there” no identifica un lugar concreto."
  },
  {
    "kind": "Significado implícito",
    "question": "Anna dice “Nice to meet you”. ¿Qué interpretación encaja mejor?",
    "options": [
      "Expresa agrado al presentarse a Pete.",
      "Está agradeciendo que Pete recuerde su nombre.",
      "Está diciendo que le gusta el apartamento."
    ],
    "answer": 0,
    "why": "La expresión se usa al conocer a alguien; no describe el lugar ni confirma una amistad previa."
  },
  {
    "kind": "Referencia",
    "question": "En “Let’s try that again”, ¿a qué se refiere “that” en esta conversación?",
    "options": [
      "A volver a visitar el apartamento.",
      "A corregir la dirección de Irving Street.",
      "A volver a presentarse y saludarse."
    ],
    "answer": 2,
    "why": "Inmediatamente después, Anna vuelve a decir su nombre y a saludar."
  },
  {
    "kind": "Palabra en contexto",
    "question": "¿Qué añade “again” a “Let’s try that again”?",
    "options": [
      "Que deben hacerlo de una manera más formal.",
      "Que van a repetir algo que ya intentaron.",
      "Que la otra persona debe hacerlo sola."
    ],
    "answer": 1,
    "why": "“Again” indica repetición. No especifica por sí solo ni formalidad ni quién cometió un error."
  },
  {
    "kind": "Intención",
    "question": "¿Qué diferencia hay entre “Let’s try that again” y “Try that again”?",
    "options": [
      "La primera propone hacerlo juntos; la segunda se dirige a la otra persona.",
      "La primera obliga a repetir; la segunda expresa una duda.",
      "La primera se refiere al pasado; la segunda, al futuro."
    ],
    "answer": 0,
    "why": "“Let’s” incluye al hablante en la propuesta: equivale a “hagámoslo”."
  },
  {
    "kind": "Escucha precisa",
    "question": "Pete dice “Is that A-N-A?”. ¿Qué necesita comprobar?",
    "options": [
      "La manera en que Anna prefiere que la saluden.",
      "La escritura del nombre que acaba de escuchar.",
      "Si Anna está preguntando por otra persona."
    ],
    "answer": 1,
    "why": "Al decir las letras, Pete comprueba la ortografía, no el saludo ni la identidad de otra persona."
  },
  {
    "kind": "Corrección",
    "question": "Anna responde “No. A-N-N-A”. ¿Qué está corrigiendo exactamente?",
    "options": [
      "La cantidad de letras n en su propio nombre.",
      "El nombre con el que Pete se ha presentado.",
      "La dirección que Pete acaba de mencionar."
    ],
    "answer": 0,
    "why": "Conserva el nombre Anna y aclara que lleva dos letras n."
  },
  {
    "kind": "Palabra en contexto",
    "question": "“Anna with two n’s” significa que…",
    "options": [
      "Pete está distinguiendo a Anna de dos personas más.",
      "Anna usa dos nombres diferentes al presentarse.",
      "El nombre Anna contiene dos letras n."
    ],
    "answer": 2,
    "why": "“With” describe aquí una característica de la escritura del nombre."
  },
  {
    "kind": "Organización del diálogo",
    "question": "En “Well, Anna with two n’s… Welcome to…”, ¿qué hace “Well”?",
    "options": [
      "Indica que Anna se encuentra bien de salud.",
      "Marca el paso de aclarar el nombre a dar la bienvenida.",
      "Expresa que Pete considera incorrecta la respuesta de Anna."
    ],
    "answer": 1,
    "why": "Aquí “Well” introduce la continuación del diálogo; no significa “estar bien”."
  },
  {
    "kind": "Referencia",
    "question": "Anna dice “My new apartment!”. ¿A quién se refiere “my”?",
    "options": [
      "A Pete, porque él menciona primero la dirección.",
      "A los dos, porque ambos están en la conversación.",
      "A Anna, porque ella está hablando de su apartamento."
    ],
    "answer": 2,
    "why": "“My” se refiere a quien habla en ese momento, no a quien dijo la dirección."
  },
  {
    "kind": "Inferencia",
    "question": "¿Qué conclusión está respaldada por el final del audio?",
    "options": [
      "Anna identifica ese lugar como su nuevo apartamento.",
      "Pete y Anna vivirán juntos en ese apartamento.",
      "Pete es el propietario del edificio de Irving Street."
    ],
    "answer": 0,
    "why": "El audio vincula el lugar con el apartamento de Anna, pero no establece la relación de Pete con la vivienda."
  },
  {
    "kind": "Escenario nuevo",
    "question": "Un compañero escribe “Sara”, pero tu nombre es “Sarah”. ¿Qué respuesta aplica mejor lo que hizo Anna?",
    "options": [
      "“Nice to meet you, Sara.”",
      "“Yes, Sara. Let’s meet again.”",
      "“Actually, S-A-R-A-H, with an h at the end.”"
    ],
    "answer": 2,
    "why": "Deletrear y señalar la letra que falta corrige la escritura de forma específica."
  },
  {
    "kind": "Escenario nuevo",
    "question": "Acabas de conocer a alguien y dice “Nice to meet you”. ¿Qué respuesta corresponde mejor?",
    "options": [
      "“Nice to meet you, too.”",
      "“I’m fine, thank you.”",
      "“Welcome back.”"
    ],
    "answer": 0,
    "why": "“Too” devuelve el saludo. “I’m fine” responde a una pregunta sobre cómo estás."
  },
  {
    "kind": "Límite de la inferencia",
    "question": "¿Qué NO podemos asegurar solamente con esta conversación?",
    "options": [
      "Que Anna aclara cómo se escribe su nombre.",
      "Que Anna acaba de llegar de otro país.",
      "Que Pete da una bienvenida y menciona una dirección."
    ],
    "answer": 1,
    "why": "El diálogo menciona un apartamento nuevo, pero no dice desde dónde llegó Anna."
  }
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
    get('demo-step').textContent = `Pregunta ${index + 1} de ${questions.length}`;
    get('demo-progress').max = questions.length;
    get('demo-progress').value = index;
    get('demo-kind').textContent = q.kind;
    get('demo-question').textContent = q.question;
    get('demo-feedback').textContent = '';
    get('demo-feedback').className = '';
    get('demo-next').hidden = true;
    get('demo-next').textContent = index === questions.length - 1 ? 'Terminar la práctica →' : 'Siguiente pregunta →';
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
    feedback.textContent = (right ? '✓ Correcto. ' : '✕ Incorrecto. ' + q.options[q.answer] + ' ') + q.why;
    get('demo-progress').value = index + 1;
    get('demo-next').hidden = false;
  }
  get('demo-next').addEventListener('click', () => {
    if (!answered) return;
    if (index < questions.length - 1) {index++; render(true); return;}
    stopAudio();
    root.hidden = true; get('demo-result').hidden = false;
    get('demo-score').textContent = `${correct} de ${questions.length} respuestas correctas.`;
    get('demo-score-number').replaceChildren(document.createTextNode(String(correct)));
    const denominator = document.createElement('span'); denominator.textContent = '/' + questions.length;
    get('demo-score-number').append(denominator);
    const ring = get('demo-ring-value');
    ring.style.strokeDasharray = '100';
    ring.style.strokeDashoffset = String(100 - correct / questions.length * 100);
    if (!reducedMotion.matches && ring.animate) ring.animate([{strokeDashoffset:'100'},{strokeDashoffset:String(100 - correct / questions.length * 100)}],{duration:850,easing:'ease-out'});
    get('demo-result-steps').replaceChildren();
    results.forEach((right, i) => {
      const badge = document.createElement('span');
      badge.className = right ? 'is-correct' : 'is-incorrect';
      badge.textContent = (right ? '✓ ' : '↻ ') + 'P' + (i + 1);
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

