(() => {
  const menu = document.querySelector('.erc-mobile-menu');
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  const form = document.getElementById('erc-contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('nombre') || '').trim();
    const phone = String(data.get('telefono') || '').trim();
    const goal = String(data.get('metas') || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 7 || !goal) {
      const field = !name ? form.elements.nombre : phone.replace(/\D/g, '').length < 7 ? form.elements.telefono : form.elements.metas;
      field.setCustomValidity('Completa este campo; incluye al menos 7 dígitos para el teléfono.');
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), {once:true});
      return;
    }
    const message = `Hola, soy ${name}.\nMi WhatsApp: ${phone}.\nQuiero mejorar mi inglés para: ${goal}`;
    if (typeof window.gtag === 'function') window.gtag('event', 'whatsapp_form_continue', {placement:'contact'});
    window.location.assign('https://wa.me/50575281644?text=' + encodeURIComponent(message));
  });
})();

