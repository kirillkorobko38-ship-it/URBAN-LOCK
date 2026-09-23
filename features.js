// Interactive components share URBAN_CONFIG.prices with product details and price list.
const urbanMoney = value => Number(value).toLocaleString('ru-RU') + ' ₸';
const defaultWaMessage = 'Здравствуйте! Хочу получить консультацию по парковочным блокираторам Urban Lock';
const urbanWa = message => 'https://wa.me/' + URBAN_CONFIG.whatsapp + '?text=' + encodeURIComponent(message || defaultWaMessage);
function urbanTrack(name, parameters = {}) {
  // No names, phone numbers, addresses, file names, free text or full URLs enter analytics.
  const safe = {};
  for (const key of ['form_type', 'placement', 'product_id', 'category', 'quantity', 'state'])
    if (parameters[key] !== undefined) safe[key] = parameters[key];
  window.dispatchEvent(new CustomEvent('urban:analytics', {detail:{event:name,...safe}}));
  if (typeof window.gtag === 'function') window.gtag('event', name, safe);
}
if (/^G-[A-Z0-9]+$/.test(URBAN_CONFIG.ga4Id)) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', URBAN_CONFIG.ga4Id, {send_page_view:true});
  const script = document.createElement('script');
  script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(URBAN_CONFIG.ga4Id);
  document.head.append(script);
}
function makeWaLink(text, message, placement) {
  const link = document.createElement('a');
  link.className = 'inline-whatsapp'; link.textContent = text;
  link.href = urbanWa(message); link.target = '_blank'; link.rel = 'noopener noreferrer'; link.dataset.placement = placement;
  return link;
}
document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
  const old = new URL(link.href);
  link.href = urbanWa(old.searchParams.get('text') || defaultWaMessage);
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  if (!link.textContent.trim() && !link.getAttribute('aria-label')) link.setAttribute('aria-label','Написать Urban Lock в WhatsApp');
});
document.querySelectorAll('.catalog-card').forEach(card => {
  const id = card.getAttribute('onclick')?.match(/showProduct\('([^']+)'\)/)?.[1];
  if (!PRODUCTS[id]) return;
  const link = makeWaLink('Консультация в WhatsApp', defaultWaMessage + '. Модель: ' + PRODUCTS[id].model, 'product_card');
  link.addEventListener('click', event => event.stopPropagation());
  card.querySelector('.catalog-card-body').append(link);
});
document.querySelectorAll('.svc-card').forEach(card => {
  card.append(makeWaLink('Обсудить в WhatsApp', 'Здравствуйте! Интересует услуга Urban Lock: ' + card.querySelector('.svc-title').textContent, 'service_card'));
});
const clientPage = document.querySelector('#client-page');
if (clientPage) clientPage.querySelector('.hero-actions').append(makeWaLink('Написать в WhatsApp', defaultWaMessage, 'client_page'));
document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  if (link.href.startsWith('https://wa.me/')) urbanTrack('whatsapp_click',{placement:link.dataset.placement || (link.closest('nav') ? 'header' : link.closest('footer') ? 'footer' : 'page')});
  if (link.classList.contains('instagram-link')) urbanTrack('instagram_click',{placement:link.closest('nav')?'header':link.closest('footer')?'footer':'page'});
});
// Dedicated accessible native dialog: Escape, focus containment and return focus work natively.
function openVisitForm(context = '') {
  const dialog = document.getElementById('visit-dialog');
  const field = dialog.querySelector('[name="Тип объекта"]');
  const pairs = [['Бизнес','Бизнес-центр'],['Жил','Жилой комплекс'],['Коммер','Коммерческий объект'],['Част','Частная территория']];
  const match = pairs.find(([word])=>context.includes(word));
  if (match) field.value = match[1];
  dialog.showModal();
}
const visit = document.getElementById('visit-dialog');
visit?.querySelector('.visit-close').addEventListener('click',()=>visit.close());
visit?.addEventListener('click',event=>{
  if(event.target!==visit)return;
  const rect=visit.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)visit.close();
});
document.querySelectorAll('button').forEach(button => {
  if (/^(Заказать )?[Вв]ыезд на объект$/.test(button.textContent.trim())) button.onclick=()=>openVisitForm();
});
const demo = document.querySelector('.lock-demo');
document.querySelectorAll('[data-lock-action]').forEach(button=>button.addEventListener('click',()=>{
  const open=button.dataset.lockAction==='open';
  demo.classList.toggle('is-open',open);
  demo.setAttribute('aria-label',open?'Схема: автоматический блокиратор опущен':'Схема: автоматический блокиратор поднят');
  document.getElementById('lock-status').textContent=open?'Открыто — дуга опущена, можно въезжать':'Закрыто — блокиратор поднят, место защищено';
  document.querySelectorAll('[data-lock-action]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  urbanTrack('blocker_demo',{state:open?'open':'closed'});
}));
function calculateParking(productId, quantity, install) {
  const unit = URBAN_CONFIG.prices[productId];
  if (!Number.isFinite(unit) || unit < 0 || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return null;
  const equipment = unit * quantity;
  const knownInstall = Number.isFinite(URBAN_CONFIG.installationPerUnit) && URBAN_CONFIG.installationPerUnit >= 0;
  const installation = install ? (knownInstall ? URBAN_CONFIG.installationPerUnit * quantity : null) : 0;
  return {unit,equipment,installation,total:equipment+(installation || 0),quantity,productId,install};
}
const calc = document.querySelector('.parking-calculator');
if(calc){
  const select=document.getElementById('calc-product');
  for(const [id,product] of Object.entries(PRODUCTS)){
    const option=document.createElement('option');option.value=id;option.textContent=product.title+' — '+urbanMoney(URBAN_CONFIG.prices[id]);select.append(option);
  }
  const readCalc=()=>calculateParking(select.value,Number(document.getElementById('calc-quantity').value),document.getElementById('calc-installation').value==='yes');
  function refreshCalc(){
    const result=readCalc();document.getElementById('calc-request').disabled=!result;
    document.getElementById('calc-breakdown').textContent=result?result.quantity+' × '+urbanMoney(result.unit):'Укажите целое количество от 1 до 1000.';
    document.getElementById('calc-total').textContent=result?(result.installation===null?'Оборудование: ':'Итого: ')+urbanMoney(result.total):'—';
    document.getElementById('calc-install-note').textContent=!result?'':result.installation===null?'Монтаж рассчитывается отдельно после оценки объекта. Итог с монтажом пока не определён.':result.install?'Включая установку: '+urbanMoney(result.installation):'Без монтажа и доставки. Предварительный расчёт по розничным ценам.';
  }
  calc.addEventListener('input',refreshCalc);calc.addEventListener('change',refreshCalc);refreshCalc();
  document.getElementById('calc-request').addEventListener('click',()=>{
    const result=readCalc();if(!result)return;
    orderProduct(PRODUCTS[result.productId].model);
    document.getElementById('quote-qty').value=result.quantity;
    document.getElementById('quote-comment').value='Предварительный расчёт: оборудование '+urbanMoney(result.equipment)+'. '+(result.install?'Нужна установка. '+(result.installation===null?'Просьба рассчитать монтаж.':'Установка '+urbanMoney(result.installation)+'.'):'Без установки.')+' Просьба уточнить доставку и возможную скидку.';
    urbanTrack('calculator_request',{product_id:result.productId,quantity:result.quantity});
  });
}
document.getElementById('business-toggle')?.addEventListener('click',event=>{
  const btn=event.currentTarget;const open=btn.getAttribute('aria-expanded')!=='true';
  btn.setAttribute('aria-expanded',String(open));document.getElementById('business-options').hidden=!open;
});
const category=new URL(location.href).searchParams.get('category');
if(['auto','manual','barrier'].includes(category)){
  document.addEventListener('DOMContentLoaded',()=>{
    const filter=document.querySelector('#catalog button[data-cat="'+category+'"]');
    if(filter)filterCatalog(filter);
  });
}
// Customer-selected photographs remain local until the customer shares them.
const auditInput=document.getElementById('audit-photos');
let auditFiles=[];
let auditUrls=[];
if(auditInput){
  const preview=document.querySelector('.audit-preview');
  auditInput.addEventListener('change',()=>{
    for(const url of auditUrls)URL.revokeObjectURL(url);
    auditUrls=[];auditFiles=[];preview.replaceChildren();
    const files=Array.from(auditInput.files);
    const valid=files.length<=3&&files.every(file=>['image/jpeg','image/png','image/webp'].includes(file.type)&&file.size<=8*1024*1024);
    auditInput.setCustomValidity(valid?'':'Выберите до 3 фотографий JPG, PNG или WebP, не больше 8 МБ каждая.');
    document.getElementById('audit-share').hidden=true;
    if(!valid){auditInput.reportValidity();return;}
    auditFiles=files;
    for(const file of files){
      const img=document.createElement('img');const url=URL.createObjectURL(file);auditUrls.push(url);
      img.src=url;img.alt='Предпросмотр: '+file.name;preview.append(img);
    }
    document.getElementById('audit-share').hidden=!(files.length&&navigator.canShare?.({files}));
  });
  document.getElementById('audit-share').addEventListener('click',async()=>{
    if(!auditFiles.length)return;
    try{
      await navigator.share({files:auditFiles,title:'Парковочный аудит Urban Lock',text:'Фото парковочного места для подбора оборудования Urban Lock.'});
      urbanTrack('audit_share',{form_type:'audit'});
    }catch(error){
      if(error.name!=='AbortError'){preview.insertAdjacentText('beforeend',' Не удалось открыть меню. Прикрепите фото вручную в WhatsApp.');}
    }
  });
}
// A gallery is published only for confirmed real projects.
const works=URBAN_CONFIG.works.filter(work=>work.verified===true&&work.image&&work.title&&work.category);
if(works.length && document.getElementById('real-works')){
  const section=document.getElementById('real-works');section.hidden=false;
  const categories=['Все',...new Set(works.map(w=>w.category))];
  function renderWorks(category){
    const grid=section.querySelector('.works-grid');grid.replaceChildren();
    for(const work of works.filter(w=>category==='Все'||w.category===category)){
      const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');
      img.src=work.image;img.alt=work.title;img.loading='lazy';caption.textContent=work.title+' · '+work.category;
      figure.append(img,caption);grid.append(figure);
    }
    section.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===category)));
  }
  for(const category of categories){const button=document.createElement('button');button.className='btn-secondary';button.textContent=category;button.onclick=()=>renderWorks(category);section.querySelector('.works-filters').append(button);}
  renderWorks('Все');
}
let instagram=null;
try { const url=new URL(URBAN_CONFIG.instagramUrl);if(url.protocol==='https:'&&['instagram.com','www.instagram.com'].includes(url.hostname)&&url.pathname!=='/')instagram=url.href;}catch{}
if(instagram){
  document.querySelectorAll('.instagram-link').forEach(link=>{
    link.hidden=false;link.href=instagram;link.target='_blank';link.rel='noopener noreferrer';
    if(link.classList.contains('instagram-icon'))link.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>';
  });
  const panel=document.querySelector('.instagram-panel'); if(panel)panel.hidden=false;
}
// Update every displayed price at runtime too: editing only site-config.js is enough.
document.querySelectorAll('.catalog-card, .price-row-data').forEach(node=>{
  const id=node.getAttribute('onclick')?.match(/showProduct\('([^']+)'\)/)?.[1];
  const price=node.querySelector('.catalog-card-price, .price-retail');
  if(price&&PRODUCTS[id]) price.textContent=urbanMoney(URBAN_CONFIG.prices[id]);
});
// Optional direct product URL, e.g. catalog.html?product=pl101-1.
document.addEventListener('DOMContentLoaded',()=>{
  const productId=new URL(location.href).searchParams.get('product');
  if(PRODUCTS[productId])showProduct(productId);
});
// Header height changes when phone navigation wraps; keep content below it.
const urbanNav=document.querySelector('nav');
if(urbanNav){
  const updateNavHeight=()=>document.documentElement.style.setProperty('--nav-height',urbanNav.getBoundingClientRect().height+'px');
  updateNavHeight();
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(updateNavHeight).observe(urbanNav);
  else window.addEventListener('resize',updateNavHeight);
}
