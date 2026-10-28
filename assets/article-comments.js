(async () => {
  const root = document.querySelector('[data-article-comments]');
  if (!root) return;
  const slug = root.dataset.articleComments;
  const endpoint = '/api/article-comments?article=' + encodeURIComponent(slug);
  root.innerHTML = `<h2>La conversación sigue aquí</h2><p>Deja tu opinión con tu nombre y país.</p><form><div class="comment-fields"><label>Nombre o alias<input name="name" autocomplete="nickname" maxlength="60" required></label><label>País (lo eliges tú)<select name="country" required><option value="">Selecciona tu país</option></select></label></div><label>Tu comentario<textarea name="text" rows="4" minlength="3" maxlength="2000" required></textarea></label><label class="comment-trap" aria-hidden="true">Deja este campo vacío<input name="website" tabindex="-1" autocomplete="off"></label><p class="comment-privacy">Tu nombre, país, comentario y fecha serán públicos y se guardarán en nuestro repositorio público. No incluyas datos privados. <a href="/#contact">Solicitar retirada</a>.</p><button class="action" type="submit" disabled>Publicar comentario</button></form><p class="comment-status" role="status" aria-live="polite">Cargando comentarios…</p><div class="comment-list"></div>`;
  const form = root.querySelector('form'), button = root.querySelector('button'), status = root.querySelector('.comment-status'), list = root.querySelector('.comment-list');
  let countries = {}, submissionId = crypto.randomUUID(), enabled = false;
  function render(comment, prepend = false) {
    const item = document.createElement('article'); item.className = 'reader-comment';
    const name = document.createElement('strong'); name.textContent = comment.name;
    const meta = document.createElement('p'); meta.className = 'comment-meta';
    const time = document.createElement('time'); time.dateTime = comment.createdAt;
    time.textContent = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.createdAt));
    time.title = comment.createdAt + ' (UTC)';
    meta.append((countries[comment.country] || comment.country) + ' · ', time, ' · hora local');
    const text = document.createElement('p'); text.textContent = comment.text;
    item.append(name, meta, text); prepend ? list.prepend(item) : list.append(item);
  }
  try {
    const [countryResponse, response] = await Promise.all([fetch('/data/comment-countries.json'), fetch(endpoint)]);
    if (!countryResponse.ok || !response.ok) throw Error('No pudimos cargar los comentarios. Recarga la página para volver a intentar.');
    countries = await countryResponse.json();
    Object.entries(countries).sort((a,b) => a[1].localeCompare(b[1], 'es')).forEach(([code, name]) => { const option = new Option(name, code); form.elements.country.add(option); });
    const data = await response.json(); enabled = data.enabled === true;
    (data.comments || []).forEach(c => render(c));
    button.disabled = !enabled;
    status.textContent = enabled ? (data.comments.length ? '' : 'Sé la primera persona en comentar.') : 'Los comentarios aún no están disponibles.';
  } catch (error) { status.textContent = error.message; }
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); if (!enabled || button.disabled) return;
    button.disabled = true; status.textContent = 'Guardando tu comentario…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), submissionId }) });
      const data = await response.json();
      if (!response.ok || !data.comment) throw Error(data.error || 'No se pudo confirmar el guardado. Tu texto sigue aquí; intenta otra vez.');
      render(data.comment, true); form.elements.text.value = ''; submissionId = crypto.randomUUID(); status.textContent = 'Tu comentario está publicado.';
    } catch (error) { status.textContent = error.message || 'No se pudo guardar. Intenta otra vez.'; }
    finally { button.disabled = false; }
  });
})();
