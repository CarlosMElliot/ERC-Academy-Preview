const PASSAGES = [
  {
    id: "jobs",
    title: "Passage 1 — Teen Jobs",
    theme: "Should teenagers work while they are still students?",
    heading: "Teenagers and Part-Time Jobs",
    paragraphs: [
      "In some countries, teenagers have jobs, while they are still students. Some teenagers work after school. Other teenagers work on the weekend. Others work during school breaks. Schools teach students a lot, but having a job can help students in ways that schools cannot. All teenagers should work while they are in school.",
      "Teenagers who have jobs as students can learn about different fields. If a student wants to become a doctor, he or she can learn what it is like to work in a hospital. A student who likes children can help at a school. Such experiences make it easier for students to decide what kind of job they should look for when they graduate. In some cases, teenagers may learn that certain jobs are not right for them. Finding out what work they do or do not like is an important lesson, too. It is important for teenagers to learn about a variety of jobs.",
      "Students who work also learn how to manage their own money. Many teenagers depend on their parents for everything. If parents give teenagers money, then teenagers will get used to receiving money easily. By working hard for their own money, teenagers learn its value. They also learn how to make the most of their money when choosing what to buy. Understanding how to manage money is a useful skill for teenagers to learn.",
      "A job may take time away from students' studies, but it will also teach them a lot about different job fields and managing money. A part-time job provides students with experiences and skills that cannot be taught in school."
    ]
  },
  {
    id: "zoos",
    title: "Passage 2 — Zoos",
    theme: "Are zoos really the best place for animals to live?",
    heading: "Are Zoos Good for Animals?",
    paragraphs: [
      "Over the past several years, the number of people visiting zoos in the United States, Australia, and England has reached record levels. Zoos attract a lot of tourists and families. But they are not the best place for animals to live.",
      "A zoo can provide only limited space for each animal. Some bears, for example, have only 10 metres of walking space at a zoo, but in their natural home, bears can walk for long distances. Many zoos keep big cats in very small spaces compared to their natural environments. In a zoo, they cannot move enough to stay active and strong.",
      "Also, birds are often kept in small spaces where they must walk from branch to branch instead of flying. Having too little space to live can be bad for the animals' minds and bodies.",
      "It is also important to understand that zoos can be harmful and even deadly for some animals. Animals from different regions or areas live very close together. They can get sick because they are not used to each other. People can also hurt animals by giving them food that they are not supposed to eat.",
      "Animals can get sick when humans throw waste in their living space. For example, some animals think plastic bottles are food and they hurt themselves trying to eat the plastic. So it is not always the case that animals are safer in zoos than they are in their natural homes.",
      "Many people visit zoos every year. They think it is a fun activity for families. But they should think about the poor living conditions of the animals in zoos. When it comes time to plan an activity with your family, zoos are not the best choice."
    ]
  },
  {
    id: "computers",
    title: "Passage 3 — Computers",
    theme: "Have computers actually made our lives better?",
    heading: "Have Computers Made Life Better?",
    paragraphs: [
      "The first computers were very large and some were as big as several rooms. Over time, the technology improved and computers became smaller. Now, personal computers are everywhere. They are supposed to improve the quality of our lives, but they have not made life better.",
      "Computers waste a lot of time. Computers are machines, and machines often break. There are many stories of people who have wasted time because of computer problems. For example, one woman bought a computer, and after she turned it on it did not work. She spent a week talking on the phone with someone from customer support and was still not able to successfully set up the computer. She eventually returned the computer to the store.",
      "In another story, a graduate student at a major university lost a year's worth of research because his computer stopped working. He had to start his research project all over again. Having a computer means losing time when they break.",
      "Computers also hurt relationships between people. It is important to build strong relationships between family and friends. On computers, there is always another email to answer, another website to read, or another online game to play.",
      "Before computers, families would talk and play games as a group for an entire evening. Now, a family can be in the same house without talking to one another. This can damage relationships between people."
    ]
  }
];

const TOTAL_SECONDS = 18 * 60;
const state = { name: "", passage: null, timeLeft: TOTAL_SECONDS, timerId: null, submitted: false, deadline: null };

// ---------- SETUP SCREEN ----------
const choicesEl = document.getElementById('passageChoices');
PASSAGES.forEach(p => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'passage-card';
  card.innerHTML = `<span class="radio-dot"></span><span><span class="pc-title">${p.title}</span><br><span class="pc-theme">${p.theme}</span></span>`;
  card.addEventListener('click', () => {
    document.querySelectorAll('.passage-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.passage = p;
    updateBeginBtn();
  });
  choicesEl.appendChild(card);
});

const nameInput = document.getElementById('studentName');
const beginBtn = document.getElementById('beginBtn');
nameInput.addEventListener('input', updateBeginBtn);
function updateBeginBtn(){
  state.name = nameInput.value.trim();
  beginBtn.disabled = !(state.name.length > 0 && state.passage);
}
beginBtn.addEventListener('click', startTest);

// ---------- TEST SCREEN ----------
const passageScroll = document.getElementById('passageScroll');
const summaryBox = document.getElementById('summaryBox');
const opinionBox = document.getElementById('opinionBox');
const summaryWC = document.getElementById('summaryWC');
const opinionWC = document.getElementById('opinionWC');
const summaryHint = document.getElementById('summaryHint');
const opinionHint = document.getElementById('opinionHint');

function wordCount(text){
  const t = text.trim();
  if(!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function refreshCounts(){
  const sw = wordCount(summaryBox.value);
  summaryWC.textContent = sw + (sw === 1 ? ' word' : ' words');
  summaryWC.classList.remove('good','bad');
  if(sw === 0){ summaryHint.textContent = '25–50 words required.'; summaryHint.className = 'hint-line neutral'; }
  else if(sw < 25){ summaryWC.classList.add('bad'); summaryHint.textContent = `${25 - sw} more word${25-sw===1?'':'s'} to reach the minimum.`; summaryHint.className = 'hint-line bad'; }
  else if(sw <= 50){ summaryWC.classList.add('good'); summaryHint.textContent = 'Good length.'; summaryHint.className = 'hint-line good'; }
  else { summaryWC.classList.add('bad'); summaryHint.textContent = `${sw - 50} word${sw-50===1?'':'s'} over the limit — trim it down.`; summaryHint.className = 'hint-line bad'; }

  const ow = wordCount(opinionBox.value);
  opinionWC.textContent = ow + (ow === 1 ? ' word' : ' words');
  opinionWC.classList.remove('good','bad');
  if(ow === 0){ opinionHint.textContent = '50 words minimum.'; opinionHint.className = 'hint-line neutral'; }
  else if(ow < 50){ opinionWC.classList.add('bad'); opinionHint.textContent = `${50 - ow} more word${50-ow===1?'':'s'} to reach the minimum.`; opinionHint.className = 'hint-line bad'; }
  else { opinionWC.classList.add('good'); opinionHint.textContent = 'Good length.'; opinionHint.className = 'hint-line good'; }
}
summaryBox.addEventListener('input', refreshCounts);
opinionBox.addEventListener('input', refreshCounts);

// jump nav
const jumpSummary = document.getElementById('jumpSummary');
const jumpOpinion = document.getElementById('jumpOpinion');
const blockSummary = document.getElementById('blockSummary');
const blockOpinion = document.getElementById('blockOpinion');
const writingScroll = document.getElementById('writingScroll');
jumpSummary.addEventListener('click', () => {
  blockSummary.scrollIntoView({behavior:'smooth', block:'start'});
});
jumpOpinion.addEventListener('click', () => {
  blockOpinion.scrollIntoView({behavior:'smooth', block:'start'});
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      if(entry.target === blockSummary){ jumpSummary.classList.add('active'); jumpOpinion.classList.remove('active'); }
      if(entry.target === blockOpinion){ jumpOpinion.classList.add('active'); jumpSummary.classList.remove('active'); }
    }
  });
}, {root: writingScroll, threshold: 0.5});

function startTest(resuming = false){
  document.getElementById('testTitle').textContent = state.passage.title;
  document.getElementById('testSub').textContent = 'Summary and opinion';
  document.getElementById('headerName').textContent = state.name;

  passageScroll.innerHTML = `<h2>${state.passage.heading}</h2>` +
    state.passage.paragraphs.map(p => `<p>${p}</p>`).join('');

  document.getElementById('screen-setup').classList.remove('active');
  document.getElementById('screen-test').classList.add('active');

  observer.observe(blockSummary);
  observer.observe(blockOpinion);

  if(resuming !== true) state.deadline = Date.now() + TOTAL_SECONDS * 1000;
  state.timeLeft = remainingSeconds(state.deadline);
  updateTimerDisplay();
  saveDraft();
  if(state.timeLeft <= 0){ finishTest(true); return; }
  state.timerId = setInterval(tick, 1000);
}

function tick(){
  state.timeLeft = remainingSeconds(state.deadline);
  updateTimerDisplay();
  if(state.timeLeft <= 0){
    clearInterval(state.timerId);
    finishTest(true);
  }
}

function updateTimerDisplay(){
  const m = Math.floor(state.timeLeft / 60);
  const s = state.timeLeft % 60;
  const disp = document.getElementById('timerDisplay');
  disp.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  const fill = document.getElementById('timerBarFill');
  fill.style.width = `${(state.timeLeft / TOTAL_SECONDS) * 100}%`;
  if(state.timeLeft <= 120){ disp.classList.add('urgent'); } else { disp.classList.remove('urgent'); }
}

const submitWarning = document.getElementById('submitWarning');
const submitWarningText = document.getElementById('submitWarningText');

document.getElementById('submitBtn').addEventListener('click', () => {
  const sw = wordCount(summaryBox.value);
  const ow = wordCount(opinionBox.value);
  const issues = [];
  if(sw < 25) issues.push(`summary needs ${25 - sw} more word${25-sw===1?'':'s'}`);
  if(sw > 50) issues.push(`summary is ${sw - 50} words over the maximum`);
  if(ow < 50) issues.push(`opinion needs ${50 - ow} more word${50-ow===1?'':'s'}`);
  if(issues.length){
    submitWarningText.textContent = `Not quite there yet — ${issues.join(' and ')}.`;
    submitWarning.classList.add('show');
    return;
  }
  clearInterval(state.timerId);
  finishTest(false);
});

document.getElementById('cancelSubmitBtn').addEventListener('click', () => {
  submitWarning.classList.remove('show');
});

document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
  clearInterval(state.timerId);
  finishTest(false);
});

function finishTest(autoSubmitted){
  if(state.submitted) return;
  state.submitted = true;
  clearInterval(state.timerId);
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
  document.getElementById('screen-test').classList.remove('active');
  document.getElementById('screen-results').classList.add('active');

  const timeUsed = TOTAL_SECONDS - state.timeLeft;
  const mUsed = Math.floor(timeUsed / 60), sUsed = timeUsed % 60;
  const sw = wordCount(summaryBox.value);
  const ow = wordCount(opinionBox.value);
  const now = new Date();

  document.getElementById('resultsHeading').textContent = autoSubmitted ? "Time's up — here's what was saved." : "Nice work.";
  document.getElementById('resultsMeta').textContent =
    `${state.name} · ${state.passage.title} · ${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} · time used ${mUsed}:${sUsed.toString().padStart(2,'0')} of 18:00`;

  document.getElementById('resSummaryWC').textContent = `(${sw} words)`;
  document.getElementById('resOpinionWC').textContent = `(${ow} words)`;
  document.getElementById('resSummaryText').textContent = summaryBox.value.trim() || '(left blank)';
  document.getElementById('resOpinionText').textContent = opinionBox.value.trim() || '(left blank)';

  const bodyText =
`Writing Placement Test Results

Student: ${state.name}
Passage: ${state.passage.title}
Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}
Time used: ${mUsed}:${sUsed.toString().padStart(2,'0')} of 18:00

SUMMARY (${sw} words):
${summaryBox.value.trim() || '(left blank)'}

OPINION (${ow} words):
${opinionBox.value.trim() || '(left blank)'}
`;

  const subject = `Writing Test Results — ${state.name} — ${state.passage.title}`;
  const emailBtn = document.getElementById('emailBtn');
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('erc.academianic@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  emailBtn.href = gmailComposeUrl;
  emailBtn.target = '_blank';
  emailBtn.rel = 'noopener noreferrer';

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const blob = new Blob([bodyText], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.name.replace(/\s+/g,'_')}_${state.passage.id}_results.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());
}

const DRAFT_KEY = 'erc-writing-draft-v1';
function remainingSeconds(deadline, now = Date.now()){
  return Math.max(0, Math.min(TOTAL_SECONDS, Math.ceil((deadline - now) / 1000)));
}
function parseDraft(raw){
  try{
    const d=JSON.parse(raw);
    if(!d || d.version!==1 || typeof d.name!=='string' || !d.name.trim() || d.name.length>100 ||
       !PASSAGES.some(p=>p.id===d.passageId) || typeof d.summary!=='string' || typeof d.opinion!=='string' ||
       !Number.isFinite(d.deadline) || d.deadline>Date.now()+TOTAL_SECONDS*1000+5000) return null;
    return d;
  }catch{return null}
}
function saveDraft(){
  if(!state.deadline || state.submitted || !state.passage) return;
  try{
    localStorage.setItem(DRAFT_KEY,JSON.stringify({version:1,name:state.name,passageId:state.passage.id,
      summary:summaryBox.value,opinion:opinionBox.value,deadline:state.deadline}));
  }catch{
    document.getElementById('draftStatus').textContent='This browser could not save your draft. Keep this page open until you finish.';
  }
}
summaryBox.addEventListener('input',saveDraft);
opinionBox.addEventListener('input',saveDraft);
window.addEventListener('pagehide',saveDraft);
let availableDraft=null;
try{availableDraft=parseDraft(localStorage.getItem(DRAFT_KEY))}catch{}
if(availableDraft) document.getElementById('draftPrompt').hidden=false;
document.getElementById('resumeDraft').addEventListener('click',()=>{
  if(!availableDraft)return;
  state.name=availableDraft.name;
  state.passage=PASSAGES.find(p=>p.id===availableDraft.passageId);
  state.deadline=availableDraft.deadline;
  summaryBox.value=availableDraft.summary;opinionBox.value=availableDraft.opinion;
  refreshCounts();document.getElementById('draftPrompt').hidden=true;startTest(true);
});
document.getElementById('discardDraft').addEventListener('click',()=>{
  try{localStorage.removeItem(DRAFT_KEY)}catch{}
  availableDraft=null;document.getElementById('draftPrompt').hidden=true;
});

