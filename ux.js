(() => {
  const menus = [...document.querySelectorAll('.erc-mobile-menu, .erc-classes-menu')];
  menus.forEach(menu => {
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.open = false;
      menu.querySelectorAll('details[open]').forEach(child => { child.open = false; });
    }));
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openMenu = menus.filter(menu => menu.open).pop();
    if (openMenu) {
      openMenu.open = false;
      openMenu.querySelector('summary').focus();
      event.preventDefault();
    }
  });
  document.addEventListener('click', event => {
    menus.forEach(menu => {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
  });
  const form = document.getElementById('erc-contact-form');
  let sending = false;
  let lastAccepted = '';
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('_honey') || '').trim()) return;
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
    const message = `Hi, this is ${name}.\n\nMy WhatsApp: ${phone}\nMy English learning goals: ${goal}`;
    const url = 'https://wa.me/50575281644?text=' + encodeURIComponent(message);
    const status = document.getElementById('contact-status');
    const fallback = document.getElementById('contact-whatsapp');
    const button = form.querySelector('button[type="submit"]');
    fallback.href = url;
    fallback.hidden = false;
    // Open synchronously from the click so popup blockers do not depend on the email request.
    window.open(url, '_blank', 'noopener,noreferrer');
    if (lastAccepted === message) {
      status.textContent = 'Esta consulta ya fue procesada. En WhatsApp, revisa el mensaje y pulsa Enviar.';
      return;
    }
    sending = true;
    button.disabled = true;
    button.textContent = 'Enviando consulta…';
    status.textContent = 'Procesando tu consulta por correo. En WhatsApp, pulsa Enviar para compartir el mensaje.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/erc.academianic@gmail.com', {
        method: 'POST',
        headers: {'Content-Type':'application/json', Accept:'application/json'},
        body: JSON.stringify({
          name, telefono:phone, metas:goal, message,
          _subject:'Nueva consulta — ERC Academy',
          _template:'table',
          _honey:''
        }),
        signal: controller.signal,
        keepalive:true
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission not accepted');
      lastAccepted = message;
      status.textContent = 'Consulta procesada por el servicio de correo. Para enviarla también por WhatsApp, revisa el mensaje y pulsa Enviar.';
    } catch {
      status.textContent = 'No pudimos confirmar el envío por correo. Tus datos siguen aquí: puedes reintentar o enviarlos por WhatsApp.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      button.textContent = 'Enviar consulta y abrir WhatsApp ↗';
    }
  });
})();
