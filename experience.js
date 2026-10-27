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
    "kind": "Matiz",
    "question": "¿Qué comunica “countless” en esta introducción?",
    "options": [
      "Una cantidad certificada por un recuento.",
      "Una abundancia que el hablante presenta como difícil de contar.",
      "La imposibilidad de ver ningún animal."
    ],
    "answer": 1,
    "why": "Es una expresión de abundancia; no aporta una cifra verificable."
  },
  {
    "kind": "Grado de certeza",
    "question": "¿Qué efecto tiene “maybe” antes de una cifra?",
    "options": [
      "Presenta la cifra como una estimación.",
      "Convierte la cifra en un mínimo garantizado.",
      "Confirma que alguien ya hizo el recuento."
    ],
    "answer": 0,
    "why": "Este adverbio reduce el grado de certeza."
  },
  {
    "kind": "Desacuerdo implícito",
    "question": "La segunda voz cuestiona la cantidad. ¿Qué rechaza exactamente?",
    "options": [
      "Que haya tiburones en el lugar.",
      "Que se pueda participar en el reto.",
      "La magnitud de la estimación anterior."
    ],
    "answer": 2,
    "why": "Cuestionar una cantidad no equivale a negar la existencia de lo mencionado."
  },
  {
    "kind": "Referencia",
    "question": "¿Cómo funciona “that many” en la respuesta?",
    "options": [
      "Compara con una cantidad mencionada antes.",
      "Introduce una nueva cifra exacta.",
      "Se refiere al tamaño de cada animal."
    ],
    "answer": 0,
    "why": "La expresión recupera una cantidad del contexto sin repetirla."
  },
  {
    "kind": "Registro informal",
    "question": "En un contexto de dinero, ¿qué significa “grand”?",
    "options": [
      "Un premio de cualquier valor.",
      "Un millón de unidades monetarias.",
      "Mil unidades monetarias."
    ],
    "answer": 2,
    "why": "Es una forma coloquial de expresar miles; el contexto determina la moneda."
  },
  {
    "kind": "Verbo preciso",
    "question": "¿Qué acción expresa “retrieve”?",
    "options": [
      "Averiguar cuánto vale un objeto.",
      "Ir a buscar y recuperar algo.",
      "Entregar voluntariamente algo propio."
    ],
    "answer": 1,
    "why": "El verbo destaca la recuperación, no la compra ni la donación."
  },
  {
    "kind": "Condición",
    "question": "¿Qué relación introduce “if” en la propuesta?",
    "options": [
      "Un resultado depende de que ocurra una acción.",
      "La acción ya ocurrió antes de hablar.",
      "El resultado sucederá aunque nadie actúe."
    ],
    "answer": 0,
    "why": "Una condición distingue lo posible de lo ya realizado."
  },
  {
    "kind": "Intención comunicativa",
    "question": "En la propuesta, ¿qué función tiene “I’ll”?",
    "options": [
      "Pedir permiso para participar.",
      "Describir una obligación que se cumplió ayer.",
      "Comprometer al hablante a una acción futura."
    ],
    "answer": 2,
    "why": "En este contexto, la forma futura funciona como una promesa condicionada."
  },
  {
    "kind": "Roles del diálogo",
    "question": "¿Qué detalle exige distinguir entre participante y beneficiario?",
    "options": [
      "Ambos deben recuperar una mochila distinta.",
      "El dinero se ofrece para un fan del participante.",
      "El fan debe financiar el premio."
    ],
    "answer": 1,
    "why": "Quien realiza una acción no siempre es quien recibe su recompensa."
  },
  {
    "kind": "Expresión figurada",
    "question": "¿Cómo interpretar “number one” al hablar de un fan?",
    "options": [
      "Como una etiqueta de entusiasmo o preferencia.",
      "Como prueba de una clasificación oficial.",
      "Como referencia a la primera persona en llegar."
    ],
    "answer": 0,
    "why": "El uso coloquial de un superlativo no demuestra que exista un ranking."
  },
  {
    "kind": "Tono y puesta en escena",
    "question": "¿Qué aporta “conveniently” al presentar a alguien que ya está allí?",
    "options": [
      "Indica que su presencia resulta molesta.",
      "Sugiere que llegó demasiado tarde.",
      "Subraya que su presencia encaja oportunamente con el momento."
    ],
    "answer": 2,
    "why": "La palabra resalta lo oportuno; por sí sola no prueba si hubo planificación."
  },
  {
    "kind": "Referencia espacial",
    "question": "¿Qué matiz añade “right” a “here”?",
    "options": [
      "Expresa que el lugar es moralmente correcto.",
      "Enfatiza la cercanía o ubicación exacta.",
      "Señala necesariamente el lado derecho."
    ],
    "answer": 1,
    "why": "Como intensificador de lugar, refuerza la localización."
  },
  {
    "kind": "Intención en contexto",
    "question": "Cuando animan al participante con “let’s go”, ¿cuál es la lectura más adecuada?",
    "options": [
      "Una invitación literal a abandonar el lugar.",
      "Una petición para cambiar de tema.",
      "Una expresión de ánimo para empezar o actuar."
    ],
    "answer": 2,
    "why": "Las expresiones conversacionales cambian de función según la situación."
  },
  {
    "kind": "Aplicación",
    "question": "En una reunión, una persona calcula una cifra y otra duda de que sea tan alta. ¿Qué respuesta conserva mejor ese matiz?",
    "options": [
      "La segunda persona rechaza la estimación, sin negar todo el informe.",
      "La segunda persona demuestra que no ocurrió nada.",
      "La segunda persona confirma que la cifra es exacta."
    ],
    "answer": 0,
    "why": "Una objeción limitada no debe interpretarse como una negación total."
  },
  {
    "kind": "Lectura crítica",
    "question": "¿Qué afirmación requiere evidencia adicional a esta introducción?",
    "options": [
      "Se propone una recompensa vinculada a una acción.",
      "Se ha comprobado el número exacto de tiburones.",
      "Una persona cuestiona una estimación."
    ],
    "answer": 1,
    "why": "Una estimación llamativa y una reacción no sustituyen un recuento."
  }
];
  const get = id => document.getElementById(id);
  let index = 0, correct = 0, answered = false, started = false;
  let results = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const recording = get('demo-recording');
  function animatePanel() {
    const panel = get('demo-question-panel');
    if (!reducedMotion.matches && panel.animate) panel.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:300,easing:'ease-out'});
  }
  function stopAudio() {
    // Unload the iframe to stop playback without relying on a third-party API.
    recording.removeAttribute('src');
  }
  function loadClip() { recording.src = recording.dataset.src; }
  get('demo-replay').addEventListener('click', loadClip);
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
    stopAudio(); loadClip();
    index = 0; correct = 0; started = false; results = [];
    get('demo-result').hidden = true; root.hidden = false; render(true);
  });
  window.addEventListener('pagehide', stopAudio);
  root.hidden = false;
  render();
})();

