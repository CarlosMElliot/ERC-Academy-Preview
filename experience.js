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
    "kind": "Nuance",
    "question": "What does “countless” convey in this introduction?",
    "options": [
      "A quantity confirmed by an exact count.",
      "An abundance presented as difficult to count.",
      "An inability to see any animals."
    ],
    "answer": 1,
    "why": "It expresses abundance without providing a verified number.",
    "focus": "Separate dramatic language from measurable facts."
  },
  {
    "kind": "Certainty",
    "question": "How does “maybe” affect the number that follows?",
    "options": [
      "It presents the number as an estimate.",
      "It makes the number a guaranteed minimum.",
      "It confirms that someone has already counted."
    ],
    "answer": 0,
    "why": "This adverb reduces the speaker’s degree of certainty.",
    "focus": "Listen for small words that change how certain a speaker sounds."
  },
  {
    "kind": "Implied disagreement",
    "question": "The second speaker challenges the quantity. What exactly is being disputed?",
    "options": [
      "Whether there are any sharks there.",
      "Whether anyone can take part in the challenge.",
      "How large the previous estimate is."
    ],
    "answer": 2,
    "why": "Questioning a quantity does not mean denying that something exists.",
    "focus": "Identify exactly which part of the previous statement receives a response."
  },
  {
    "kind": "Reference",
    "question": "How does “that many” function in the reply?",
    "options": [
      "It refers back to a previously mentioned quantity.",
      "It introduces a new, exact number.",
      "It refers to the size of each animal."
    ],
    "answer": 0,
    "why": "The expression points back to a quantity without repeating it.",
    "focus": "Connect short references to the statement immediately before them."
  },
  {
    "kind": "Informal language",
    "question": "In a money context, what does “grand” mean?",
    "options": [
      "A prize of any value.",
      "One million currency units.",
      "One thousand currency units."
    ],
    "answer": 2,
    "why": "It is an informal way to express thousands; context determines the currency.",
    "focus": "Use the topic of the conversation to interpret informal vocabulary."
  },
  {
    "kind": "Precise vocabulary",
    "question": "What action does “retrieve” describe?",
    "options": [
      "Finding out how much an object is worth.",
      "Going to get something and bringing it back.",
      "Voluntarily giving away something you own."
    ],
    "answer": 1,
    "why": "The verb emphasizes recovery rather than buying or donating.",
    "focus": "Picture the action each verb describes before choosing."
  },
  {
    "kind": "Conditions",
    "question": "What relationship does “if” establish in the proposal?",
    "options": [
      "An outcome depends on an action happening.",
      "The action already happened before the conversation.",
      "The outcome will happen even if nobody acts."
    ],
    "answer": 0,
    "why": "A condition distinguishes a possible outcome from an accomplished fact.",
    "focus": "Track the action and the result separately."
  },
  {
    "kind": "Speaker intention",
    "question": "What does “I’ll” do in this proposal?",
    "options": [
      "Ask for permission to participate.",
      "Describe an obligation fulfilled yesterday.",
      "Commit the speaker to a future action."
    ],
    "answer": 2,
    "why": "Here, the future form functions as a conditional promise.",
    "focus": "Consider what the speaker is doing with the statement, not just its tense."
  },
  {
    "kind": "Conversation roles",
    "question": "Which detail requires you to distinguish the participant from the beneficiary?",
    "options": [
      "They each have to retrieve a different backpack.",
      "The money is offered for a fan of the participant.",
      "The fan has to fund the prize."
    ],
    "answer": 1,
    "why": "The person performing an action is not always the person receiving its reward.",
    "focus": "Keep track of who acts, who speaks, and who benefits."
  },
  {
    "kind": "Figurative meaning",
    "question": "How should “number one” be interpreted when describing a fan?",
    "options": [
      "As a label suggesting enthusiasm or preference.",
      "As proof of an official ranking.",
      "As a reference to the first person to arrive."
    ],
    "answer": 0,
    "why": "A conversational superlative does not establish that a formal ranking exists.",
    "focus": "Ask whether an expression is literal or used for emphasis."
  },
  {
    "kind": "Tone and staging",
    "question": "What does “conveniently” add when introducing someone already nearby?",
    "options": [
      "It suggests their presence is irritating.",
      "It suggests they arrived too late.",
      "It highlights how their presence suits the moment."
    ],
    "answer": 2,
    "why": "The word emphasizes suitability; on its own, it does not prove advance planning.",
    "focus": "Distinguish what a word suggests from what it actually proves."
  },
  {
    "kind": "Spatial reference",
    "question": "What does “right” add to “here”?",
    "options": [
      "It says the location is morally correct.",
      "It emphasizes proximity or an exact location.",
      "It necessarily indicates the right-hand side."
    ],
    "answer": 1,
    "why": "As a place intensifier, it strengthens the location reference.",
    "focus": "Interpret the words together rather than translating each in isolation."
  },
  {
    "kind": "Meaning in context",
    "question": "When the participant is encouraged with “let’s go”, what is the best interpretation?",
    "options": [
      "A literal invitation to leave the location.",
      "A request to change the subject.",
      "Encouragement to begin or take action."
    ],
    "answer": 2,
    "why": "Conversational expressions can serve different purposes in different situations.",
    "focus": "Use the situation and the speakers’ reactions to identify the intention."
  },
  {
    "kind": "New scenario",
    "question": "In a meeting, one person gives an estimate and another doubts it is that high. Which interpretation preserves the distinction?",
    "options": [
      "The second person challenges the estimate without rejecting the entire report.",
      "The second person proves that nothing happened.",
      "The second person confirms the number is exact."
    ],
    "answer": 0,
    "why": "A limited objection should not be interpreted as a total denial.",
    "focus": "Apply the same listening distinction to a different situation."
  },
  {
    "kind": "Critical listening",
    "question": "Which claim needs evidence beyond this introduction?",
    "options": [
      "A reward is proposed in connection with an action.",
      "The exact number of sharks has been verified.",
      "Someone questions an estimate."
    ],
    "answer": 1,
    "why": "A striking estimate and a reaction do not replace an actual count.",
    "focus": "Choose only what the conversation supports; avoid filling in missing facts."
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
    get('demo-step').textContent = `Question ${index + 1} of ${questions.length}`;
    get('demo-progress').max = questions.length;
    get('demo-progress').value = index;
    get('demo-kind').textContent = q.kind;
    get('demo-question').textContent = q.question;
    get('demo-focus-title').textContent = 'Listening focus';
    get('demo-feedback').textContent = q.focus;
    get('demo-feedback').className = '';
    get('demo-next').hidden = true;
    get('demo-next').textContent = index === questions.length - 1 ? 'See my results →' : 'Next question →';
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
    get('demo-focus-title').textContent = right ? 'You caught it' : 'What to listen for';
    feedback.className = 'erc-demo-feedback';
    feedback.textContent = (right ? '✓ Correct. ' : '✕ Not quite. ' + q.options[q.answer] + ' ') + q.why;
    get('demo-progress').value = index + 1;
    get('demo-next').hidden = false;
  }
  get('demo-next').addEventListener('click', () => {
    if (!answered) return;
    if (index < questions.length - 1) {index++; render(true); return;}
    stopAudio();
    root.hidden = true; get('demo-result').hidden = false;
    get('demo-score').textContent = `${correct} of ${questions.length} answers correct.`;
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
      badge.textContent = (right ? '✓ ' : '↻ ') + 'Q' + (i + 1);
      badge.setAttribute('aria-label', 'Question ' + (i + 1) + (right ? ': correct' : ': review'));
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

