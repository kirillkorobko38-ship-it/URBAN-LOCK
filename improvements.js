// Shared request flow. A prepared draft is never reported as a sent application.
function buildUrbanRequest(form) {
  const lines = ['Здравствуйте! Заявка с сайта Urban Lock', 'Тема: ' + form.dataset.request];
  for (const [key, value] of new FormData(form)) {
    if (String(value).trim()) lines.push(key + ': ' + String(value).trim());
  }
  if (form.id === 'audit-form' && auditFiles.length) lines.push('Фото: ' + auditFiles.length + ' шт. Прикреплю фотографии к сообщению.');
  return 'https://wa.me/' + OWNER_WA + '?text=' + encodeURIComponent(lines.join('\n'));
}
document.querySelectorAll('form.urban-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const phone = form.elements.namedItem('Телефон');
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Укажите телефон: от 10 до 15 цифр.');
    if (!form.reportValidity()) return;
    const result = form.querySelector('.request-result');
    result.replaceChildren();
    const text = document.createElement('p');
    text.textContent = 'Заявка подготовлена. Откройте WhatsApp, проверьте текст и отправьте сообщение.';
    if (form.id === 'audit-form' && auditFiles.length) text.textContent += ' Важно: прикрепите выбранные фото в чате — ссылка не отправляет их автоматически.';
    const link = document.createElement('a');
    link.href = buildUrbanRequest(form);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.textContent = 'Открыть WhatsApp и отправить заявку →';
    result.append(text, link);
    urbanTrack('lead_draft_prepared', {form_type: form.id === 'visit-form' ? 'site_visit' : form.id === 'audit-form' ? 'audit' : form.closest('#client-page') ? 'client_page' : 'solution'});
    link.focus();
  });
  form.addEventListener('input', () => {
    form.elements.namedItem('Телефон').setCustomValidity('');
    form.querySelector('.request-result').replaceChildren();
  });
  form.addEventListener('change', () => form.querySelector('.request-result').replaceChildren());
});
const solution = document.querySelector('.solution-panel');
if (solution) solution.addEventListener('change', () => {
  const form = solution.querySelector('form');
  const object = form.elements.namedItem('Тип объекта').value;
  const equipment = form.elements.namedItem('Оборудование').value;
  const qty = form.elements.namedItem('Количество мест').value;
  solution.querySelector('.solution-summary').textContent = [object, equipment, qty ? qty + ' парковочных мест' : ''].filter(Boolean).join(' · ') || 'Выберите тип объекта и необходимое оборудование.';
});
const slider = document.querySelector('.compare-control input');
if (slider) slider.addEventListener('input', () => {
  document.querySelector('.parking-compare').style.setProperty('--reveal', slider.value + '%');
  slider.setAttribute('aria-valuetext', 'До: ' + slider.value + '%, после: ' + (100-slider.value) + '%');
});
document.querySelectorAll('a[target="_blank"]').forEach(link => link.rel = 'noopener noreferrer');
document.querySelectorAll('.price-row-data').forEach(row => {
  const id = (row.getAttribute('onclick') || '').match(/showProduct\('([^']+)'\)/)?.[1];
  if (id) row.querySelector('button').onclick = event => {event.stopPropagation(); orderProduct(PRODUCTS[id].model);};
});
// Keep the language hash and section query independent.
document.addEventListener('DOMContentLoaded', () => {
  const section = new URL(location.href).searchParams.get('section');
  if (section && document.getElementById(section)?.classList.contains('section')) showSection(section);
  if (location.hash === '#clients') {
    showSection('home');
    setTimeout(() => document.getElementById('clients')?.scrollIntoView(), 250);
  }
});
document.querySelectorAll('.catalog-card').forEach(card => {
  const id = (card.getAttribute('onclick') || '').match(/showProduct\('([^']+)'\)/)?.[1];
  if (id === 'barrier-e' || id === 'barrier-f') {
    const dimensions = document.createElement('div');
    dimensions.className = 'card-spec-tag';
    dimensions.textContent = id === 'barrier-e' ? '2000 × 80 мм · длина × высота' : '1500 × 250 мм · длина × высота';
    card.querySelector('.catalog-card-tags').prepend(dimensions);
  }
});
