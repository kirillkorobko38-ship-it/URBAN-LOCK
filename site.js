
function showSection(id, navEl) {
  const pages = {home:'URBANLOCK.html', catalog:'catalog.html', pricelist:'pricelist.html', services:'services.html', contacts:'contacts.html'};
  if (!pages[id]) return;
  const destination = new URL(pages[id], location.href);
  const currentFile = location.pathname.split('/').pop();
  if (currentFile !== pages[id]) {
    destination.searchParams.set('lang', typeof CURRENT_LANG === 'string' ? CURRENT_LANG : 'ru');
    location.assign(destination.href);
    return;
  }
  document.querySelectorAll('.section').forEach(section=>section.classList.toggle('active',section.id===id));
  document.querySelectorAll('.nav-link').forEach(link=>link.classList.toggle('active',link.dataset.section===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function switchProduct(id) {
  document.querySelectorAll('.product-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
}

function selectQty(btn) {
  btn.closest('.qty-options').querySelectorAll('.qty-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function filterPrice(btn) {
  document.querySelectorAll('#pricelist [data-filter]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.price-row-data').forEach(row => {
    if(filter === 'all' || row.dataset.category === filter) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
}

function filterCatalog(btn) {
  document.querySelectorAll('#catalog [data-cat]').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const cat = btn.dataset.cat;
  document.querySelectorAll('.catalog-card').forEach(card => {
    if(cat === 'all' || card.dataset.cat === cat) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function orderProduct(modelName) {
  if (modelName.startsWith('Выезд на объект')) { openVisitForm(modelName); return; }
  openQuoteModal();
  const select = document.getElementById('quote-product');
  // Add model option if missing, then select it
  let found = false;
  for(const opt of select.options) {
    if(opt.value === modelName || opt.text === modelName) { opt.selected = true; found = true; break; }
  }
  if(!found) {
    const opt = document.createElement('option');
    opt.text = modelName; opt.value = modelName; opt.selected = true;
    select.insertBefore(opt, select.firstChild);
  }
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('open');
}

// =====================
// MULTILINGUAL ENGINE
// =====================
const SUPPORTED_LANGS = ['ru','kz','en'];
const DEFAULT_LANG = 'ru';
let CURRENT_LANG = DEFAULT_LANG;

const I18N = {
  ru: {
    'nav.home':'Главная','nav.catalog':'Каталог','nav.pricelist':'Прайс-лист','nav.services':'Услуги','nav.contacts':'Контакты',
    'hero.badge':'Urban Lock · Алматы · Казахстан',
    'hero.title.p1':'Защитите своё парковочное место','hero.title.p2':'уже завтра',
    'hero.sub':"Продажа, доставка и установка парковочных блокираторов по Алматы. Подберём оборудование для одного места или всей парковки.",
    'hero.cta1':'Получить консультацию','hero.cta2':'Написать в WhatsApp','hero.cta3':'Купить в Kaspi',
    'stats.1.num':'500+','stats.1.lbl':'Установок по Казахстану',
    'stats.2.num':'24Ч','stats.2.lbl':'Монтаж в Алматы',
    'stats.3.num':"12 МЕС.",'stats.3.lbl':"Гарантия на автоматические блокираторы",
    'stats.4.num':'30+','stats.4.lbl':'Единиц в наличии',
    'cat.lbl':'Категории','cat.title':'Что мы продаём',
    'cat.1.name':'Автоматические парковочные замки','cat.1.desc':'Серия PL101 — дистанционное управление, электромеханический привод, нагрузка до 2000 кг.',
    'cat.2.name':'Ручные парковочные шлагбаумы','cat.2.desc':"Серия PL105 — складная стальная конструкция без электроники. Ручное управление ключом.",
    'cat.3.name':'Ручной парковочный замок','cat.3.desc':'Модель PL105-16 — складная механика без электроники, замковый механизм для защиты от посторонних.',
    'pos.title':'Не просто оборудование — готовые решения под ключ',
    'pos.desc':'Продажа, доставка, монтаж и сервис от одного исполнителя · Защита парковочных мест в Алматы и по Казахстану',
    'pos.cta':'Получить консультацию',
    'warr.lbl':'Гарантия','warr.title':'Уверены в нашем оборудовании',
    
    'warr.2.period':'12 месяцев','warr.2.type':"Автоматические парковочные блокираторы",'warr.2.desc':"Гарантия 12 месяцев на автоматические блокираторы. Условия монтажа и обслуживания согласуем при заказе.",
    'why.lbl':'Преимущества','why.title':'Почему выбирают нас',
    'why.1.title':'Монтаж за 24 часа по Алматы','why.1.desc':'Принимаем заявку сегодня — устанавливаем оборудование уже завтра. Без откладывания и без задержек.',
    'why.2.title':"12 месяцев гарантии",'why.2.desc':"Гарантия 12 месяцев на автоматические блокираторы. Условия монтажа и обслуживания согласуем при заказе.",
    'why.3.title':'Профессиональная установка','why.3.desc':'Аккуратно устанавливаем оборудование по технологии и тестируем перед сдачей. Не оставляем мусор и царапин на объекте.',
    'why.4.title':'Оплата через Kaspi','why.4.desc':'Покупайте напрямую с Kaspi.kz — Red, рассрочка 0-0-12, привычный способ оплаты для казахстанцев.',
    'why.5.title':'Поддержка после покупки','why.5.desc':'Не пропадаем после оплаты. Консультация по настройке, выезд при поломках, замена расходников — всё включено.',
    'why.6.title':'Работаем по всему Казахстану','why.6.desc':'Алматы, Астана, Шымкент, Караганда, Атырау и любой другой город. Доставка курьером или транспортной компанией.',
    'clients.lbl':'Клиенты','clients.title':'Кому подходит наше оборудование',
    'clients.1.title':'Жилые комплексы','clients.1.desc':'Защита парковочных мест в новостройках и многоквартирных домах',
    'clients.2.title':'Бизнес-центры','clients.2.desc':'Управляемый доступ на парковку для сотрудников и посетителей',
    'clients.3.title':'Коммерческие объекты','clients.3.desc':'ТРЦ, магазины, кафе, СТО, медицинские центры и салоны',
    'clients.4.title':'Частные клиенты','clients.4.desc':'Резервирование места во дворе, на стоянке, у дома',
    'proc.lbl':'Процесс','proc.title':'Как мы работаем',
    'proc.intro':'Простой и прозрачный процесс от первого контакта до сдачи объекта. Без скрытых платежей, без задержек, без сюрпризов.',
    'proc.1.title':'Связь с нами','proc.1.desc':'WhatsApp, телефон или форма заявки на сайте. Отвечаем в течение 15 минут в рабочее время.',
    'proc.2.title':'Подбор оборудования','proc.2.desc':'Расскажите задачу — посоветуем подходящую модель и подготовим коммерческое предложение.',
    'proc.3.title':'Доставка и монтаж','proc.3.desc':'Привозим оборудование и устанавливаем в течение 24 часов по Алматы. После работы убираем за собой.',
    'proc.4.title':'Гарантия и поддержка','proc.4.desc':"Гарантия 12 месяцев на автоматические блокираторы. Условия монтажа и обслуживания согласуем при заказе.",
    'about.lbl':'О компании','about.title':'О компании URBANLOCK',
    'about.p1':'URBANLOCK — компания из Алматы, специализирующаяся на защите парковочных мест и территорий.',
    'about.p2':'Продаём, доставляем и устанавливаем автоматические и механические парковочные замки, ручные шлагбаумы, парковочные барьеры и сопутствующее оборудование. Работаем по всему Казахстану — Алматы, Астана, Шымкент, Караганда и другие регионы.',
    'about.p3':'Среди клиентов: жилые комплексы, бизнес-центры, торговые центры, рестораны, медицинские центры, СТО, склады и частные домовладения.',
    'about.placeholder':'[Здесь будет ваше развёрнутое описание компании — пришлите текст, и я заменю эту заглушку на вашу версию]',
    'about.stat.1.lbl':'Установок по Казахстану','about.stat.2.lbl':'Лет на рынке','about.stat.3.lbl':'Поддержка клиентов','about.stat.4.lbl':'Максимальная гарантия',
    'faq.lbl':'Вопросы и ответы','faq.title':'Частые вопросы',
    'faq.intro':'Собрали ответы на вопросы, которые клиенты задают чаще всего. Если не нашли свой — напишите в WhatsApp.',
    'faq.1.q':'Сколько времени занимает монтаж парковочного замка?',
    'faq.1.a':'<span data-i18n="faq.1.a">Установка одного замка занимает 15–40 минут в зависимости от модели и типа основания (асфальт или бетон). Если у вас несколько мест — приезжаем бригадой и делаем всё за один выезд. По Алматы выезжаем в течение 24 часов после согласования заявки.</span>',
    'faq.2.q':'Можно ли установить замок самостоятельно?',
    'faq.2.a':'<span data-i18n="faq.2.a">Да, все наши замки можно установить самостоятельно. В комплект входит крепёж, шаблон под бурение и инструкция. Понадобится перфоратор и базовые инструменты. Если хотите, чтобы установку сделали мы — это можно добавить к заказу.</span>',
    'faq.3.q':'Что входит в стоимость установки «под ключ»?',
    'faq.3.a':'<span data-i18n="faq.3.a">Выезд мастера на объект, демонтаж старого оборудования (если есть), бурение под анкеры, монтаж замка, настройка и тестирование, инструктаж по использованию и уборка после работы. Никаких доплат на месте.</span>',
    'faq.4.q':'Как работает гарантия?',
    'faq.4.a':"Гарантия 12 месяцев на автоматические блокираторы. Условия монтажа и обслуживания согласуем при заказе.",
    'faq.5.q':'Какие способы оплаты доступны?',
    'faq.5.a':'<span data-i18n="faq.5.a">Принимаем наличные, банковский перевод, оплату по реквизитам с НДС для юридических лиц, оплату через Kaspi.kz (включая Kaspi Red и рассрочку 0–0–12), переводы на карту. Для крупных проектов — счёт-фактура и оплата по договору.</span>',
    'faq.6.q':'Есть ли скидки на оптовый заказ?',
    'faq.6.a':'<span data-i18n="faq.6.a">Да: −5% от 2 единиц, −10% от 6 единиц, −15% от 11 единиц. Для коммерческих проектов и больших объёмов скидка обсуждается индивидуально — позвоните или напишите, мы подготовим коммерческое предложение под ваш объект.</span>',
    'faq.7.q':'Подходят ли замки для подземной парковки?',
    'faq.7.a':'<span data-i18n="faq.7.a">Да, все наши модели подходят и для подземных, и для открытых парковок. Автоматические замки с защитой IP65/IP67 работают в условиях повышенной влажности и при температуре от −20 до +60°C. Механические шлагбаумы и барьеры — без электроники, поэтому не зависят от условий и работают везде.</span>',
    'faq.8.q':'Что делать, если замок сломался?',
    'faq.8.a':"Гарантия 12 месяцев на автоматические блокираторы. Условия монтажа и обслуживания согласуем при заказе.",
    'cta.title':'Готовы защитить своё парковочное место?',
    'cta.desc':'Оставьте заявку или напишите в WhatsApp — ответим в течение 15 минут, подберём модель и подготовим расчёт под ваш объект.',
    'cta.btn1':'Получить консультацию','cta.btn2':'Написать в WhatsApp',
    'catalog.lbl':'Продукция','catalog.title':'Каталог оборудования',
    'catalog.intro':'<span data-i18n="catalog.intro">8 моделей: парковочные замки, шлагбаумы и барьеры — автоматические и ручные, для частных и коммерческих объектов. Выберите подходящий вариант или закажите консультацию по подбору.</span>',
    'catalog.f.all':'Все модели (8)','catalog.f.auto':'Автоматические (2)','catalog.f.manual':'Ручные (4)','catalog.f.barrier':'Барьеры (2)',
    'catalog.help.title':'Не знаете, какую модель выбрать?','catalog.help.desc':'Расскажите задачу — куда нужно поставить, сколько мест, какой бюджет. Подберём подходящие модели и подготовим расчёт под ваш объект.','catalog.help.cta':'Получить консультацию',
    'price.lbl':'Прайс-лист','price.title':'Цены и условия',
    'price.intro':'Розничные цены в тенге с учётом НДС. Действуют скидки при оптовом заказе. Кликните на строку, чтобы посмотреть карточку товара.',
    'price.f.all':'Все позиции (8)','price.f.auto':'Автоматические замки','price.f.manual':'Ручные','price.f.barrier':'Барьеры',
    'price.col.art':'Арт.','price.col.name':'Наименование','price.col.price':'Цена','price.col.action':'Действие',
    'disc.5.lbl':'от 2 единиц','disc.10.lbl':'от 6 единиц','disc.15.lbl':'от 11 единиц','disc.call.title':'По звонку','disc.call.lbl':'Коммерческое предложение — обсудим скидку',
    'services.lbl':'Услуги','services.title':'Готовые решения для защиты парковки',
    'services.intro':'Мы продаём не просто оборудование — мы решаем задачу под ключ. Бесплатная консультация, выезд на объект, монтаж в течение 24 часов по Алматы и поддержка после установки.',
    'services.1.title':'Установка автоматических блокираторов','services.1.desc':'Монтаж парковочных замков с пультом ДУ и мобильным приложением. Подключение, настройка, тестирование.',
    'services.2.title':'Установка механических блокираторов','services.2.desc':'Монтаж надёжных стальных замков без электроники.  Идеально для открытых парковок и стоянок.',
    'services.3.title':'Монтаж шлагбаумов','services.3.desc':'Автоматические шлагбаумы для въезда на территорию ЖК, БЦ и предприятий. Интеграция с СКУД и приложениями.',
    'services.4.title':'Разметка парковок','services.4.desc':'Профессиональная нанесённая разметка парковочных мест дорожной краской. Линии, номера мест, символы инвалидов.',
    'services.5.title':'Монтаж парковочных ограждений','services.5.desc':'Стальные барьеры Тип E и F для разграничения зон, защиты пешеходов и оформления периметра паркинга.',
    'services.6.title':'Установка видеонаблюдения','services.6.desc':'IP и аналоговые камеры для парковок и территории. Облачное хранение, удалённый просмотр со смартфона.',
    'services.7.title':'Системы контроля доступа','services.7.desc':'СКУД для парковок и территорий: карточный доступ, биометрия, считыватели гос. номеров, мобильные ключи.',
    'contacts.lbl':'Контакты','contacts.title':'Свяжитесь с нами',
    'contacts.sub':'Ответим в WhatsApp или по телефону в течение 15 минут в рабочее время. Бесплатная консультация и расчёт.',
    'contacts.wa':'Написать в WhatsApp','contacts.tg':'Telegram','contacts.phone':'Позвонить','contacts.email':'Email',
    'contacts.addr.title':'Адрес','contacts.addr.value':'Алматы, ул. Желтоксан, 115',
    'modal.title':'Заявка на консультацию','modal.sub':'Заполните форму — мы свяжемся с вами в WhatsApp в течение 15 минут.',
    'modal.f.name':'Ваше имя','modal.f.phone':'Телефон','modal.f.product':'Что вас интересует?','modal.f.qty':'Количество','modal.f.address':'Адрес объекта','modal.f.comment':'Комментарий',
    'modal.submit':'Отправить в WhatsApp','modal.cancel':'Отмена',
    'pmodal.desc':'Описание','pmodal.specs':'Характеристики','pmodal.order':'Заказать','pmodal.wa':'Написать в WhatsApp','pmodal.kaspi':'Купить в Kaspi',
    'pmodal.stock':'В наличии',
    'common.order':'Заказать','common.stock':'В наличии',
    'foot.about':'Urban Lock — защита парковочных мест в Алматы и по всему Казахстану. Доставка и монтаж под ключ.',
    'foot.products':'Продукция','foot.contact':'Контакты','foot.delivery':"Доставка по Казахстану · 12 месяцев гарантии на автоматические блокираторы",
    'wa.msg':'Здравствуйте! Я хотел бы получить консультацию по парковочным замкам.',
    'wa.product':'Здравствуйте! Интересует',

    // Yellow boxes (warranty info)
    'yel.auto.title':'Гарантия и обслуживание',
    'yel.auto.p1':'На все автоматические парковочные блокираторы предоставляется <strong>гарантия 12 месяцев</strong> с момента покупки.',
    'yel.auto.p2':'При необходимости технического обслуживания по желанию клиента стоимость выезда мастера и выполнения работ — <strong>5 000 ₸</strong>.',
    
    
    'yel.mech.p2':'Не требуют обслуживания — нет батареек и электроники. Срок службы <strong>15+ лет</strong>.',
    
    
    'yel.barr.p2':'Антивандальная сборка. Возможен индивидуальный цвет по <strong>RAL</strong>.',
    // Product cards (8 products)
    'prod.pl101-1.model':'PL101-1 · Автоматический','prod.pl101-1.title':'Автоматический парковочный замок PL101-1','prod.pl101-1.desc':'Работает от батареек — без проводки и подключения к электросети. Дистанционное управление пультом, нагрузка до 2000 кг. Подходит для жилых и коммерческих парковок.','prod.pl101-1.tag1':'Пульт ДУ','prod.pl101-1.tag2':'Питание AA','prod.pl101-1.tag3':'2000 кг',
    'prod.pl101-11-auto.model':'PL101-11 · Автоматический','prod.pl101-11-auto.title':'Автоматический парковочный замок PL101-11','prod.pl101-11-auto.desc':'Усовершенствованная модификация автоматического парковочного блокиратора. Электромеханический привод, дистанционное управление, усиленная конструкция.','prod.pl101-11-auto.tag1':'Электромеханический','prod.pl101-11-auto.tag2':'Усиленная','prod.pl101-11-auto.tag3':'2000 кг',
    'prod.pl101-11-manual.model':'PL105-16 · Ручной замок','prod.pl101-11-manual.title':'Ручной парковочный замок PL105-16','prod.pl101-11-manual.desc':'Ручное управление без электроники — классический вариант. Простой, надёжный, без обслуживания. ','prod.pl101-11-manual.tag1':'Без батарей','prod.pl101-11-manual.tag2':'Ручное управление','prod.pl101-11-manual.tag3':'Сталь',
    'prod.pl105-1.model':'PL105-10 · Ручной шлагбаум','prod.pl105-1.title':'Ручной парковочный шлагбаум PL105-10','prod.pl105-1.desc':'П-образный ручной парковочный шлагбаум. Прочная стальная конструкция, складная механика, замковый механизм для защиты от посторонних.','prod.pl105-1.tag1':'П-образный','prod.pl105-1.tag2':'Ручное управление','prod.pl105-1.tag3':'Сталь',
    'prod.pl105-13.model':'PL105-13 · Ручной шлагбаум','prod.pl105-13.title':'Ручной парковочный шлагбаум PL105-13','prod.pl105-13.desc':'Широкий П-образный ручной парковочный шлагбаум. Утолщённая сталь, антивандальный замок. Для коммерческих объектов с активным трафиком.','prod.pl105-13.tag1':'Широкий П-образный','prod.pl105-13.tag2':'Усиленный','prod.pl105-13.tag3':'Антивандальный',
    'prod.pl105-11.model':'PL105-11 · Ручной шлагбаум','prod.pl105-11.title':'Ручной парковочный шлагбаум PL105-11','prod.pl105-11.desc':'Треугольный складной ручной парковочный шлагбаум. Самое доступное решение для базовой защиты парковочного места.','prod.pl105-11.tag1':'Треугольный','prod.pl105-11.tag2':'Складной','prod.pl105-11.tag3':'Доступная цена',
    'prod.barrier-e.model':'Barrier-E · Парковочный барьер','prod.barrier-e.title':'Парковочный барьер Barrier-E','prod.barrier-e.desc':'Парковочный барьер-ограничитель с винтовым креплением. Жёлто-чёрная сигнальная окраска для лучшей видимости.','prod.barrier-e.tag1':'Жёлто-чёрный','prod.barrier-e.tag2':'С винтами','prod.barrier-e.tag3':'Стальной',
    'prod.barrier-f.model':'Barrier-F · Парковочный барьер','prod.barrier-f.title':'Парковочный барьер Barrier-F','prod.barrier-f.desc':'Парковочный барьер с винтовым креплением. Габариты 1500 × 250 мм. Для разделения парковочных рядов и защиты пешеходных зон.','prod.barrier-f.tag1':'1500 × 250 мм','prod.barrier-f.tag2':'С винтами','prod.barrier-f.tag3':'Сталь 1,5 мм',
  },
  kz: {
    'nav.home':'Басты','nav.catalog':'Каталог','nav.pricelist':'Бағалар','nav.services':'Қызметтер','nav.contacts':'Байланыс',
    'hero.badge':'Urban Lock · Алматы · Қазақстан',
    'hero.title.p1':'Парковка орныңызды қорғаңыз','hero.title.p2':'ертеңнен бастап',
    'hero.sub':"Алматыда тұрақ блокираторларын сату, жеткізу және орнату. Бір орынға немесе бүкіл тұраққа жабдық таңдаймыз.",
    'hero.cta1':'Кеңес алу','hero.cta2':'WhatsApp-қа жазу','hero.cta3':'Kaspi-де сатып алу',
    'stats.1.num':'500+','stats.1.lbl':'Қазақстан бойынша орнатылды',
    'stats.2.num':'24С','stats.2.lbl':'Алматыда монтаждау',
    'stats.3.num':"12 АЙ",'stats.3.lbl':"Автоматты блокираторларға кепілдік",
    'stats.4.num':'30+','stats.4.lbl':'Қоймада бар',
    'cat.lbl':'Санаттар','cat.title':'Біз нені сатамыз',
    'cat.1.name':'Автоматты парковка құлпылары','cat.1.desc':'PL101 сериясы — қашықтан басқару, электромеханикалық жетек, жүктеме 2000 кг дейін.',
    'cat.2.name':'Қол парковка шлагбаумдары','cat.2.desc':"PL105 сериясы — электроникасыз жиналмалы болат конструкция. Кілтпен басқару.",
    'cat.3.name':'Қол парковка құлпы','cat.3.desc':'PL105-16 моделі — электроникасыз жиналмалы механика, бөгде адамдардан қорғауға арналған құлып механизмі.',
    'pos.title':'Жай жабдық емес — кілт астында дайын шешімдер',
    'pos.desc':'Бір орындаушыдан сату, жеткізу, монтаждау және сервис · Алматы мен Қазақстан бойынша парковка орындарын қорғау',
    'pos.cta':'Кеңес алу',
    'warr.lbl':'Кепілдік','warr.title':'Біздің жабдыққа сенімдіміз',
    
    'warr.2.period':'12 ай','warr.2.type':"Автоматты тұрақ блокираторлары",'warr.2.desc':"Автоматты тұрақ блокираторларына 12 ай кепілдік. Орнату және қызмет көрсету шарттары тапсырыс кезінде келісіледі.",
    'why.lbl':'Артықшылықтар','why.title':'Бізді неге таңдайды',
    'why.1.title':'Алматыда 24 сағатта монтаждау','why.1.desc':'Өтінімді бүгін қабылдаймыз — жабдықты ертең орнатамыз. Кейінге қалдырусыз және кідіріссіз.',
    'why.2.title':"12 ай кепілдік",'why.2.desc':"Автоматты тұрақ блокираторларына 12 ай кепілдік. Орнату және қызмет көрсету шарттары тапсырыс кезінде келісіледі.",
    'why.3.title':'Кәсіби орнату','why.3.desc':'Жабдықты технология бойынша мұқият орнатамыз және тапсыру алдында тестілейміз. Объектіде қоқыс пен сызат қалдырмаймыз.',
    'why.4.title':'Kaspi арқылы төлеу','why.4.desc':'Kaspi.kz арқылы тікелей сатып алыңыз — Red, бөліп төлеу 0-0-12, қазақстандықтарға таныс төлем тәсілі.',
    'why.5.title':'Сатып алғаннан кейінгі қолдау','why.5.desc':'Төлемнен кейін жоғалып кетпейміз. Баптау бойынша кеңес, сынған жағдайда шақыру, шығын материалдарын ауыстыру — бәрі кіреді.',
    'why.6.title':'Бүкіл Қазақстан бойынша жұмыс істейміз','why.6.desc':'Алматы, Астана, Шымкент, Қарағанды, Атырау және кез келген басқа қала. Курьермен немесе көлік компаниясымен жеткізу.',
    'clients.lbl':'Клиенттер','clients.title':'Жабдығымыз кімге сай келеді',
    'clients.1.title':'Тұрғын кешендері','clients.1.desc':'Жаңа құрылыстағы және көпқабатты үйлердегі парковка орындарын қорғау',
    'clients.2.title':'Бизнес-орталықтар','clients.2.desc':'Қызметкерлер мен келушілерге арналған парковкаға басқарылатын қол жетімділік',
    'clients.3.title':'Коммерциялық нысандар','clients.3.desc':'СОО, дүкендер, кафелер, ЖО, медициналық орталықтар мен салондар',
    'clients.4.title':'Жеке клиенттер','clients.4.desc':'Аула, тұрақ, үй маңындағы орынды резервтеу',
    'proc.lbl':'Процесс','proc.title':'Біз қалай жұмыс істейміз',
    'proc.intro':'Алғашқы байланыстан объектіні тапсыруға дейінгі қарапайым және ашық процесс. Жасырын төлемдерсіз, кідіріссіз, тосын сыйларсыз.',
    'proc.1.title':'Бізбен байланыс','proc.1.desc':'WhatsApp, телефон немесе сайттағы өтінім нысаны. Жұмыс уақытында 15 минут ішінде жауап береміз.',
    'proc.2.title':'Жабдықты таңдау','proc.2.desc':'Тапсырманы айтыңыз — лайықты модельді ұсынамыз және коммерциялық ұсыныс дайындаймыз.',
    'proc.3.title':'Жеткізу және монтаждау','proc.3.desc':'Жабдықты әкеліп, Алматыда 24 сағат ішінде орнатамыз. Жұмыстан кейін өзімізден кейін жинаймыз.',
    'proc.4.title':'Кепілдік және қолдау','proc.4.desc':"Автоматты тұрақ блокираторларына 12 ай кепілдік. Орнату және қызмет көрсету шарттары тапсырыс кезінде келісіледі.",
    'about.lbl':'Компания туралы','about.title':'URBANLOCK компаниясы туралы',
    'about.p1':'URBANLOCK — парковка орындары мен аумақтарын қорғауға маманданған Алматыдағы компания.',
    'about.p2':'Автоматты және механикалық парковка құлпыларын, қол шлагбаумдарын, парковка барьерлерін және ілеспе жабдықтарды сатамыз, жеткіземіз және орнатамыз. Бүкіл Қазақстан бойынша жұмыс істейміз — Алматы, Астана, Шымкент, Қарағанды және басқа аймақтар.',
    'about.p3':'Клиенттер арасында: тұрғын кешендері, бизнес-орталықтар, сауда орталықтары, мейрамханалар, медициналық орталықтар, ЖО, қоймалар және жеке үй иеліктері.',
    'about.placeholder':'[Мұнда сіздің компанияңыздың толық сипаттамасы болады — мәтінді жіберіңіз, мен оны нұсқаңызбен ауыстырамын]',
    'about.stat.1.lbl':'Қазақстан бойынша орнатылды','about.stat.2.lbl':'Нарықта жыл','about.stat.3.lbl':'Клиенттерді қолдау','about.stat.4.lbl':'Ең жоғары кепілдік',
    'faq.lbl':'Сұрақтар мен жауаптар','faq.title':'Жиі қойылатын сұрақтар',
    'faq.intro':'Клиенттер жиі қоятын сұрақтарға жауап жинадық. Өзіңіздікін таппасаңыз — WhatsApp-қа жазыңыз.',
    'faq.1.q':'Парковка құлпын орнату қанша уақыт алады?',
    'faq.1.a':'Бір құлыпты орнату модельге және негіз түріне (асфальт немесе бетон) байланысты 15–40 минут алады. Егер бірнеше орныңыз болса — бригадамен келіп, бәрін бір сапарда жасаймыз. Алматы бойынша өтінімді келісімнен кейін 24 сағат ішінде шығамыз.',
    'faq.2.q':'Құлыпты өз бетінше орнатуға бола ма?',
    'faq.2.a':'Иә, біздің барлық құлыптарды өз бетінше орнатуға болады. Жинаққа бекіту материалдары, бұрғылау шаблоны және нұсқаулық кіреді. Перфоратор және негізгі құралдар қажет. Орнатуды біз жасауымызды қаласаңыз — оны тапсырысқа қосуға болады.',
    'faq.3.q':'«Кілт астында» орнату бағасына не кіреді?',
    'faq.3.a':'Шебердің объектіге шығуы, ескі жабдықты бөлшектеу (бар болса), анкерлер үшін бұрғылау, құлыпты монтаждау, баптау және тестілеу, пайдалану бойынша нұсқаулық беру және жұмыстан кейін жинау. Жерде ешқандай қосымша төлем жоқ.',
    'faq.4.q':'Кепілдік қалай жұмыс істейді?',
    'faq.4.a':"Автоматты тұрақ блокираторларына 12 ай кепілдік. Орнату және қызмет көрсету шарттары тапсырыс кезінде келісіледі.",
    'faq.5.q':'Қандай төлем әдістері қол жетімді?',
    'faq.5.a':'Қолма-қол ақша, банктік аударым, заңды тұлғалар үшін ҚҚС-пен реквизиттер бойынша төлем, Kaspi.kz арқылы төлем (Kaspi Red және 0–0–12 бөліп төлеуді қоса), картаға аударымдар. Ірі жобалар үшін — шот-фактура және келісім-шарт бойынша төлем.',
    'faq.6.q':'Көтерме тапсырысқа жеңілдіктер бар ма?',
    'faq.6.a':'Иә: 2 бірліктен −5%, 6 бірліктен −10%, 11 бірліктен −15%. Коммерциялық жобалар мен үлкен көлемдер үшін жеңілдік жеке талқыланады — қоңырау шалыңыз немесе жазыңыз, біз объектіңізге арналған коммерциялық ұсыныс дайындаймыз.',
    'faq.7.q':'Құлыптар жерасты парковкасына сай келе ме?',
    'faq.7.a':'Иә, біздің барлық модельдер жерасты және ашық парковкаларға сай келеді. IP65/IP67 қорғанысы бар автоматты құлыптар жоғары ылғалдылық жағдайында және −20-дан +60°C температурада жұмыс істейді. Механикалық шлагбаумдар мен барьерлер — электроникасыз, сондықтан жағдайларға тәуелді емес және барлық жерде жұмыс істейді.',
    'faq.8.q':'Құлып сынса не істеу керек?',
    'faq.8.a':"Автоматты тұрақ блокираторларына 12 ай кепілдік. Орнату және қызмет көрсету шарттары тапсырыс кезінде келісіледі.",
    'cta.title':'Парковка орныңызды қорғауға дайынсыз ба?',
    'cta.desc':'Өтінім қалдырыңыз немесе WhatsApp-қа жазыңыз — 15 минут ішінде жауап береміз, модель таңдаймыз және объектіңіз үшін есеп дайындаймыз.',
    'cta.btn1':'Кеңес алу','cta.btn2':'WhatsApp-қа жазу',
    'catalog.lbl':'Өнімдер','catalog.title':'Жабдық каталогы',
    'catalog.intro':'8 модель: парковка құлпылары, шлагбаумдар және барьерлер — автоматты және қол, жеке және коммерциялық нысандарға арналған. Лайықты нұсқаны таңдаңыз немесе таңдау бойынша кеңес алыңыз.',
    'catalog.f.all':'Барлық модельдер (8)','catalog.f.auto':'Автоматты (2)','catalog.f.manual':'Қол (4)','catalog.f.barrier':'Барьерлер (2)',
    'catalog.help.title':'Қандай модельді таңдау керектігін білмейсіз бе?','catalog.help.desc':'Тапсырманы айтыңыз — қайда қою керек, қанша орын, бюджет қанша. Лайықты модельдерді таңдап, объектіңізге арналған есеп дайындаймыз.','catalog.help.cta':'Кеңес алу',
    'price.lbl':'Бағалар','price.title':'Бағалар мен шарттар',
    'price.intro':'ҚҚС есепке алынған бөлшек бағалар теңгемен. Көтерме тапсырыс кезінде жеңілдіктер қолданылады. Тауар картасын көру үшін жолды басыңыз.',
    'price.f.all':'Барлық позициялар (8)','price.f.auto':'Автоматты құлыптар','price.f.manual':'Қол','price.f.barrier':'Барьерлер',
    'price.col.art':'Арт.','price.col.name':'Атауы','price.col.price':'Бағасы','price.col.action':'Әрекет',
    'disc.5.lbl':'2 бірліктен','disc.10.lbl':'6 бірліктен','disc.15.lbl':'11 бірліктен','disc.call.title':'Қоңырау бойынша','disc.call.lbl':'Коммерциялық ұсыныс — жеңілдікті талқылаймыз',
    'services.lbl':'Қызметтер','services.title':'Парковканы қорғауға арналған дайын шешімдер',
    'services.intro':'Біз тек жабдық сатпаймыз — біз тапсырманы кілт астында шешеміз. Тегін кеңес, объектіге шығу, Алматыда 24 сағат ішінде монтаждау және орнатудан кейінгі қолдау.',
    'services.1.title':'Автоматты блокираторларды орнату','services.1.desc':'Қашықтан басқару пультімен және мобильді қосымшамен парковка құлпыларын монтаждау. Қосу, баптау, тестілеу.',
    'services.2.title':'Механикалық блокираторларды орнату','services.2.desc':'Электроникасыз сенімді болат құлыптарды монтаждау.  Ашық парковкалар мен тұрақтарға тамаша.',
    'services.3.title':'Шлагбаумдарды монтаждау','services.3.desc':'ТК, БО және кәсіпорындар аумағына кіруге арналған автоматты шлагбаумдар. ҚБЖ және қосымшалармен интеграция.',
    'services.4.title':'Парковкаларды белгілеу','services.4.desc':'Жол бояуымен парковка орындарын кәсіби белгілеу. Сызықтар, орын нөмірлері, мүгедек белгілері.',
    'services.5.title':'Парковка қоршауларын монтаждау','services.5.desc':'Аймақтарды бөлу, жаяу жүргіншілерді қорғау және паркинг периметрін безендіруге арналған E және F типті болат барьерлер.',
    'services.6.title':'Бейнебақылауды орнату','services.6.desc':'Парковкалар мен аумаққа арналған IP және аналогты камералар. Бұлтты сақтау, смартфоннан қашықтан көру.',
    'services.7.title':'Қол жетімділікті бақылау жүйелері','services.7.desc':'Парковкалар мен аумақтарға арналған ҚБЖ: карталық қол жетімділік, биометрия, мемлекеттік нөмірлерді тану, мобильді кілттер.',
    'contacts.lbl':'Байланыс','contacts.title':'Бізбен байланысыңыз',
    'contacts.sub':'WhatsApp-та немесе телефон арқылы жұмыс уақытында 15 минут ішінде жауап береміз. Тегін кеңес және есептеу.',
    'contacts.wa':'WhatsApp-қа жазу','contacts.tg':'Telegram','contacts.phone':'Қоңырау шалу','contacts.email':'Email',
    'contacts.addr.title':'Мекен-жайы','contacts.addr.value':'Алматы, Желтоқсан көшесі, 115',
    'modal.title':'Кеңеске өтінім','modal.sub':'Нысанды толтырыңыз — 15 минут ішінде WhatsApp арқылы хабарласамыз.',
    'modal.f.name':'Атыңыз','modal.f.phone':'Телефон','modal.f.product':'Сізді не қызықтырады?','modal.f.qty':'Саны','modal.f.address':'Объектінің мекен-жайы','modal.f.comment':'Түсініктеме',
    'modal.submit':'WhatsApp-қа жіберу','modal.cancel':'Бас тарту',
    'pmodal.desc':'Сипаттама','pmodal.specs':'Сипаттамалары','pmodal.order':'Тапсырыс беру','pmodal.wa':'WhatsApp-қа жазу','pmodal.kaspi':'Kaspi-де сатып алу',
    'pmodal.stock':'Қоймада бар',
    'common.order':'Тапсырыс беру','common.stock':'Қоймада бар',
    'foot.about':'Urban Lock — Алматы мен бүкіл Қазақстан бойынша парковка орындарын қорғау. Кілт астында жеткізу және монтаждау.',
    'foot.products':'Өнімдер','foot.contact':'Байланыс','foot.delivery':"Қазақстан бойынша жеткізу · Автоматты блокираторларға 12 ай кепілдік",
    'wa.msg':'Сәлем! Парковка құлпылары бойынша кеңес алғым келеді.',
    'wa.product':'Сәлем! Қызықтырады',

    'yel.auto.title':'Кепілдік және қызмет көрсету',
    'yel.auto.p1':'Барлық автоматты парковка блокираторларына сатып алу сәтінен бастап <strong>12 ай кепілдік</strong> беріледі.',
    'yel.auto.p2':'Клиенттің тілегі бойынша техникалық қызмет көрсету қажет болған жағдайда шеберді шақыру және жұмыс құны — <strong>5 000 ₸</strong>.',
    
    
    'yel.mech.p2':'Қызмет көрсетуді қажет етпейді — батарейкалар мен электроника жоқ. Қызмет ету мерзімі <strong>15+ жыл</strong>.',
    
    
    'yel.barr.p2':'Антивандалды жинау. <strong>RAL</strong> бойынша жеке түс мүмкін.',
    'prod.pl101-1.model':'PL101-1 · Автоматты','prod.pl101-1.title':'Автоматты парковка құлпы PL101-1','prod.pl101-1.desc':'Батарейкадан жұмыс істейді — сым және электр желісіне қосылусыз. Пультпен қашықтан басқару, жүктеме 2000 кг дейін. Тұрғын және коммерциялық парковкаларға сай.','prod.pl101-1.tag1':'ҚБ пульті','prod.pl101-1.tag2':'AA қоректену','prod.pl101-1.tag3':'2000 кг',
    'prod.pl101-11-auto.model':'PL101-11 · Автоматты','prod.pl101-11-auto.title':'Автоматты парковка құлпы PL101-11','prod.pl101-11-auto.desc':'Автоматты парковка блокираторының жетілдірілген модификациясы. Электромеханикалық жетек, қашықтан басқару, күшейтілген конструкция.','prod.pl101-11-auto.tag1':'Электромеханикалық','prod.pl101-11-auto.tag2':'Күшейтілген','prod.pl101-11-auto.tag3':'2000 кг',
    'prod.pl101-11-manual.model':'PL105-16 · Қол құлпы','prod.pl101-11-manual.title':'Қол парковка құлпы PL105-16','prod.pl101-11-manual.desc':'Электроникасыз қолмен басқару — классикалық нұсқа. Қарапайым, сенімді, қызмет көрсетусіз. ','prod.pl101-11-manual.tag1':'Батареясыз','prod.pl101-11-manual.tag2':'Қолмен басқару','prod.pl101-11-manual.tag3':'Болат',
    'prod.pl105-1.model':'PL105-10 · Қол шлагбауы','prod.pl105-1.title':'Қол парковка шлагбауы PL105-10','prod.pl105-1.desc':'П-тәрізді қол парковка шлагбауы. Берік болат конструкция, жиналмалы механика, бөгде адамдардан қорғауға арналған құлып механизмі.','prod.pl105-1.tag1':'П-тәрізді','prod.pl105-1.tag2':'Қолмен басқару','prod.pl105-1.tag3':'Болат',
    'prod.pl105-13.model':'PL105-13 · Қол шлагбауы','prod.pl105-13.title':'Қол парковка шлагбауы PL105-13','prod.pl105-13.desc':'Кең П-тәрізді қол парковка шлагбауы. Қалыңдатылған болат, антивандалды құлып. Белсенді трафигі бар коммерциялық нысандарға.','prod.pl105-13.tag1':'Кең П-тәрізді','prod.pl105-13.tag2':'Күшейтілген','prod.pl105-13.tag3':'Антивандалды',
    'prod.pl105-11.model':'PL105-11 · Қол шлагбауы','prod.pl105-11.title':'Қол парковка шлагбауы PL105-11','prod.pl105-11.desc':'Үшбұрышты жиналмалы қол парковка шлагбауы. Парковка орнын негізгі қорғауға арналған ең қолжетімді шешім.','prod.pl105-11.tag1':'Үшбұрышты','prod.pl105-11.tag2':'Жиналмалы','prod.pl105-11.tag3':'Қолжетімді баға',
    'prod.barrier-e.model':'Barrier-E · Парковка барьері','prod.barrier-e.title':'Парковка барьері Barrier-E','prod.barrier-e.desc':'Бұрандалы бекітпесі бар парковка барьері-шектегіші. Жақсырақ көрінуі үшін сары-қара сигналдық бояу.','prod.barrier-e.tag1':'Сары-қара','prod.barrier-e.tag2':'Бұрандалармен','prod.barrier-e.tag3':'Болат',
    'prod.barrier-f.model':'Barrier-F · Парковка барьері','prod.barrier-f.title':'Парковка барьері Barrier-F','prod.barrier-f.desc':'Бұрандалы бекітпесі бар парковка барьері. Габариттері 1500 × 250 мм. Парковка қатарларын бөлуге және жаяу жүргіншілер аймағын қорғауға арналған.','prod.barrier-f.tag1':'1500 × 250 мм','prod.barrier-f.tag2':'Бұрандалармен','prod.barrier-f.tag3':'1,5 мм болат',
  },
  en: {
    'nav.home':'Home','nav.catalog':'Catalog','nav.pricelist':'Pricelist','nav.services':'Services','nav.contacts':'Contacts',
    'hero.badge':'Urban Lock · Almaty · Kazakhstan',
    'hero.title.p1':'Protect your parking space','hero.title.p2':'as early as tomorrow',
    'hero.sub':"Parking equipment sales, delivery and installation in Almaty. Solutions for one space or an entire parking area.",
    'hero.cta1':'Get a consultation','hero.cta2':'Message on WhatsApp','hero.cta3':'Buy on Kaspi',
    'stats.1.num':'500+','stats.1.lbl':'Installations across Kazakhstan',
    'stats.2.num':'24H','stats.2.lbl':'Installation in Almaty',
    'stats.3.num':"12 MONTHS",'stats.3.lbl':"Automatic blocker warranty",
    'stats.4.num':'30+','stats.4.lbl':'Units in stock',
    'cat.lbl':'Categories','cat.title':'What we sell',
    'cat.1.name':'Automatic parking locks','cat.1.desc':'PL101 series — remote control, electromechanical drive, load capacity up to 2000 kg.',
    'cat.2.name':'Manual parking barriers','cat.2.desc':"PL105 series — folding steel construction without electronics. Manual key operation.",
    'cat.3.name':'Manual parking lock','cat.3.desc':'Model PL105-16 — foldable mechanics without electronics, lock mechanism for protection from outsiders.',
    'pos.title':'Not just equipment — turnkey solutions',
    'pos.desc':'Sale, delivery, installation and service from one contractor · Parking space protection in Almaty and across Kazakhstan',
    'pos.cta':'Get a consultation',
    'warr.lbl':'Warranty','warr.title':'Confident in our equipment',
    
    'warr.2.period':'12 months','warr.2.type':"Automatic parking blockers",'warr.2.desc':"Automatic parking blockers have a 12-month warranty. Installation and service terms are agreed when ordering.",
    'why.lbl':'Advantages','why.title':'Why customers choose us',
    'why.1.title':'Installation in 24 hours in Almaty','why.1.desc':'We accept your order today — install the equipment tomorrow. No postponements, no delays.',
    'why.2.title':"12-month warranty",'why.2.desc':"Automatic parking blockers have a 12-month warranty. Installation and service terms are agreed when ordering.",
    'why.3.title':'Professional installation','why.3.desc':'We carefully install equipment according to technology and test it before handover. We leave no trash or scratches on site.',
    'why.4.title':'Payment via Kaspi','why.4.desc':'Buy directly through Kaspi.kz — Red, 0-0-12 installments, the familiar payment method for Kazakhstanis.',
    'why.5.title':'Post-purchase support','why.5.desc':'We don\'t disappear after payment. Setup consultations, breakdown visits, replacement of consumables — all included.',
    'why.6.title':'We work across all of Kazakhstan','why.6.desc':'Almaty, Astana, Shymkent, Karaganda, Atyrau and any other city. Delivery by courier or transport company.',
    'clients.lbl':'Clients','clients.title':'Who our equipment suits',
    'clients.1.title':'Residential complexes','clients.1.desc':'Parking space protection in new buildings and apartment houses',
    'clients.2.title':'Business centers','clients.2.desc':'Controlled parking access for employees and visitors',
    'clients.3.title':'Commercial properties','clients.3.desc':'Shopping malls, stores, cafes, auto repair shops, medical centers and salons',
    'clients.4.title':'Private clients','clients.4.desc':'Reserving a spot in the yard, parking lot, near home',
    'proc.lbl':'Process','proc.title':'How we work',
    'proc.intro':'A simple and transparent process from first contact to project handover. No hidden fees, no delays, no surprises.',
    'proc.1.title':'Contact us','proc.1.desc':'WhatsApp, phone or order form on the site. We respond within 15 minutes during business hours.',
    'proc.2.title':'Equipment selection','proc.2.desc':'Tell us your task — we\'ll recommend a suitable model and prepare a commercial offer.',
    'proc.3.title':'Delivery and installation','proc.3.desc':'We bring the equipment and install it within 24 hours in Almaty. We clean up after our work.',
    'proc.4.title':'Warranty and support','proc.4.desc':"Automatic parking blockers have a 12-month warranty. Installation and service terms are agreed when ordering.",
    'about.lbl':'About the company','about.title':'About URBANLOCK',
    'about.p1':'URBANLOCK is a company from Almaty specializing in the protection of parking spaces and territories.',
    'about.p2':'We sell, deliver and install automatic and mechanical parking locks, manual barriers, parking bollards and related equipment. We work throughout Kazakhstan — Almaty, Astana, Shymkent, Karaganda and other regions.',
    'about.p3':'Among our clients: residential complexes, business centers, shopping centers, restaurants, medical centers, auto repair shops, warehouses and private home owners.',
    'about.placeholder':'[Your detailed company description goes here — send the text and I\'ll replace this placeholder with your version]',
    'about.stat.1.lbl':'Installations across Kazakhstan','about.stat.2.lbl':'Years on the market','about.stat.3.lbl':'Customer support','about.stat.4.lbl':'Maximum warranty',
    'faq.lbl':'Q&A','faq.title':'Frequently asked questions',
    'faq.intro':'We\'ve gathered answers to questions our clients ask most often. If you don\'t find yours — message us on WhatsApp.',
    'faq.1.q':'How long does parking lock installation take?',
    'faq.1.a':'Installing one lock takes 15–40 minutes depending on the model and base type (asphalt or concrete). If you have several spots — we come as a team and do everything in one visit. We come to your Almaty location within 24 hours after order confirmation.',
    'faq.2.q':'Can I install the lock myself?',
    'faq.2.a':'Yes, all our locks can be installed independently. The kit includes fasteners, drilling template and instructions. You\'ll need a hammer drill and basic tools. If you want us to do the installation — it can be added to the order.',
    'faq.3.q':'What\'s included in the "turnkey" installation price?',
    'faq.3.a':'Master visit to the site, dismantling of old equipment (if any), drilling for anchors, lock installation, setup and testing, usage instruction and cleanup after work. No extra payments on site.',
    'faq.4.q':'How does the warranty work?',
    'faq.4.a':"Automatic parking blockers have a 12-month warranty. Installation and service terms are agreed when ordering.",
    'faq.5.q':'What payment methods are available?',
    'faq.5.a':'We accept cash, bank transfer, payment by invoice with VAT for legal entities, payment via Kaspi.kz (including Kaspi Red and 0–0–12 installments), card transfers. For large projects — invoice and payment under contract.',
    'faq.6.q':'Are there discounts for bulk orders?',
    'faq.6.a':'Yes: −5% from 2 units, −10% from 6 units, −15% from 11 units. For commercial projects and large volumes, the discount is discussed individually — call or message us, we\'ll prepare a commercial offer for your project.',
    'faq.7.q':'Are the locks suitable for underground parking?',
    'faq.7.a':'Yes, all our models are suitable for both underground and outdoor parking. Automatic locks with IP65/IP67 protection work in high humidity conditions and at temperatures from −20 to +60°C. Mechanical barriers and bollards — without electronics, so they\'re not dependent on conditions and work everywhere.',
    'faq.8.q':'What should I do if the lock breaks?',
    'faq.8.a':"Automatic parking blockers have a 12-month warranty. Installation and service terms are agreed when ordering.",
    'cta.title':'Ready to protect your parking space?',
    'cta.desc':'Leave a request or message us on WhatsApp — we\'ll respond within 15 minutes, select a model and prepare an estimate for your project.',
    'cta.btn1':'Get a consultation','cta.btn2':'Message on WhatsApp',
    'catalog.lbl':'Products','catalog.title':'Equipment catalog',
    'catalog.intro':'8 models: parking locks, barriers and bollards — automatic and manual, for private and commercial properties. Choose a suitable option or order a consultation.',
    'catalog.f.all':'All models (8)','catalog.f.auto':'Automatic (2)','catalog.f.manual':'Manual (4)','catalog.f.barrier':'Bollards (2)',
    'catalog.help.title':'Don\'t know which model to choose?','catalog.help.desc':'Tell us your task — where to install, how many spots, what budget. We\'ll select suitable models and prepare an estimate for your project.','catalog.help.cta':'Get a consultation',
    'price.lbl':'Pricelist','price.title':'Prices and conditions',
    'price.intro':'Retail prices in tenge including VAT. Discounts apply on bulk orders. Click a row to view the product card.',
    'price.f.all':'All items (8)','price.f.auto':'Automatic locks','price.f.manual':'Manual','price.f.barrier':'Bollards',
    'price.col.art':'No.','price.col.name':'Name','price.col.price':'Price','price.col.action':'Action',
    'disc.5.lbl':'from 2 units','disc.10.lbl':'from 6 units','disc.15.lbl':'from 11 units','disc.call.title':'By call','disc.call.lbl':'Commercial offer — let\'s discuss the discount',
    'services.lbl':'Services','services.title':'Ready-made parking protection solutions',
    'services.intro':'We don\'t just sell equipment — we solve the task turnkey. Free consultation, on-site visit, installation within 24 hours in Almaty and post-installation support.',
    'services.1.title':'Installation of automatic blockers','services.1.desc':'Installation of parking locks with remote control and mobile app. Connection, setup, testing.',
    'services.2.title':'Installation of mechanical blockers','services.2.desc':'Installation of reliable steel locks without electronics.  Ideal for open parking lots.',
    'services.3.title':'Barrier installation','services.3.desc':'Automatic barriers for entry to residential complexes, business centers and enterprises. Integration with access control and apps.',
    'services.4.title':'Parking marking','services.4.desc':'Professional parking space marking with road paint. Lines, space numbers, disabled symbols.',
    'services.5.title':'Installation of parking fences','services.5.desc':'Type E and F steel bollards for zone separation, pedestrian protection and parking perimeter design.',
    'services.6.title':'Video surveillance installation','services.6.desc':'IP and analog cameras for parking lots and territory. Cloud storage, remote viewing from smartphone.',
    'services.7.title':'Access control systems','services.7.desc':'Access control for parking lots and territories: card access, biometrics, license plate readers, mobile keys.',
    'contacts.lbl':'Contacts','contacts.title':'Get in touch',
    'contacts.sub':'We\'ll respond on WhatsApp or by phone within 15 minutes during business hours. Free consultation and estimate.',
    'contacts.wa':'Message on WhatsApp','contacts.tg':'Telegram','contacts.phone':'Call','contacts.email':'Email',
    'contacts.addr.title':'Address','contacts.addr.value':'Almaty, Zheltoksan St., 115',
    'modal.title':'Consultation request','modal.sub':'Fill out the form — we\'ll contact you on WhatsApp within 15 minutes.',
    'modal.f.name':'Your name','modal.f.phone':'Phone','modal.f.product':'What are you interested in?','modal.f.qty':'Quantity','modal.f.address':'Site address','modal.f.comment':'Comment',
    'modal.submit':'Send to WhatsApp','modal.cancel':'Cancel',
    'pmodal.desc':'Description','pmodal.specs':'Specifications','pmodal.order':'Order','pmodal.wa':'Message on WhatsApp','pmodal.kaspi':'Buy on Kaspi',
    'pmodal.stock':'In stock',
    'common.order':'Order','common.stock':'In stock',
    'foot.about':'Urban Lock — parking space protection in Almaty and across Kazakhstan. Turnkey delivery and installation.',
    'foot.products':'Products','foot.contact':'Contacts','foot.delivery':"Delivery across Kazakhstan · 12-month warranty on automatic blockers",
    'wa.msg':'Hello! I\'d like to get a consultation on parking locks.',
    'wa.product':'Hello! I\'m interested in',

    'yel.auto.title':'Warranty and service',
    'yel.auto.p1':'All automatic parking blockers come with a <strong>12-month warranty</strong> from the date of purchase.',
    'yel.auto.p2':'If technical service is required at the customer request, the cost of a master visit and work is — <strong>5,000 ₸</strong>.',
    
    
    'yel.mech.p2':'Maintenance-free — no batteries or electronics. Service life <strong>15+ years</strong>.',
    
    
    'yel.barr.p2':'Anti-vandal assembly. Custom color by <strong>RAL</strong> available on request.',
    'prod.pl101-1.model':'PL101-1 · Automatic','prod.pl101-1.title':'Automatic parking lock PL101-1','prod.pl101-1.desc':'Battery-powered — no wiring or power connection needed. Remote control operation, load capacity up to 2000 kg. Suitable for residential and commercial parking.','prod.pl101-1.tag1':'Remote control','prod.pl101-1.tag2':'AA batteries','prod.pl101-1.tag3':'2000 kg',
    'prod.pl101-11-auto.model':'PL101-11 · Automatic','prod.pl101-11-auto.title':'Automatic parking lock PL101-11','prod.pl101-11-auto.desc':'Enhanced modification of the automatic parking blocker. Electromechanical drive, remote control, reinforced construction.','prod.pl101-11-auto.tag1':'Electromechanical','prod.pl101-11-auto.tag2':'Reinforced','prod.pl101-11-auto.tag3':'2000 kg',
    'prod.pl101-11-manual.model':'PL105-16 · Manual lock','prod.pl101-11-manual.title':'Manual parking lock PL105-16','prod.pl101-11-manual.desc':'Manual operation without electronics — the classic option. Simple, reliable, maintenance-free. ','prod.pl101-11-manual.tag1':'No batteries','prod.pl101-11-manual.tag2':'Manual control','prod.pl101-11-manual.tag3':'Steel',
    'prod.pl105-1.model':'PL105-10 · Manual barrier','prod.pl105-1.title':'Manual parking barrier PL105-10','prod.pl105-1.desc':'U-shaped manual parking barrier. Durable steel construction, folding mechanism, lock for protection against outsiders.','prod.pl105-1.tag1':'U-shaped','prod.pl105-1.tag2':'Manual control','prod.pl105-1.tag3':'Steel',
    'prod.pl105-13.model':'PL105-13 · Manual barrier','prod.pl105-13.title':'Manual parking barrier PL105-13','prod.pl105-13.desc':'Wide U-shaped manual parking barrier. Thickened steel, anti-vandal lock. For commercial facilities with active traffic.','prod.pl105-13.tag1':'Wide U-shaped','prod.pl105-13.tag2':'Reinforced','prod.pl105-13.tag3':'Anti-vandal',
    'prod.pl105-11.model':'PL105-11 · Manual barrier','prod.pl105-11.title':'Manual parking barrier PL105-11','prod.pl105-11.desc':'Triangular foldable manual parking barrier. The most affordable solution for basic parking space protection.','prod.pl105-11.tag1':'Triangular','prod.pl105-11.tag2':'Foldable','prod.pl105-11.tag3':'Affordable',
    'prod.barrier-e.model':'Barrier-E · Parking bollard','prod.barrier-e.title':'Parking bollard Barrier-E','prod.barrier-e.desc':'Parking bollard limiter with screw mounting. Yellow-black signal coloring for better visibility.','prod.barrier-e.tag1':'Yellow-black','prod.barrier-e.tag2':'With screws','prod.barrier-e.tag3':'Steel',
    'prod.barrier-f.model':'Barrier-F · Parking bollard','prod.barrier-f.title':'Parking bollard Barrier-F','prod.barrier-f.desc':'Parking bollard with screw mounting. Dimensions 1500 × 250 mm. For separating parking rows and protecting pedestrian zones.','prod.barrier-f.tag1':'1500 × 250 mm','prod.barrier-f.tag2':'With screws','prod.barrier-f.tag3':'1.5 mm steel',
  }
};

function detectLanguage() {
  // 1. Check URL hash
  const requestedLang = new URL(location.href).searchParams.get('lang');
  if (SUPPORTED_LANGS.includes(requestedLang)) return requestedLang;
  const hashLang = location.hash.replace('#','').toLowerCase();
  if (SUPPORTED_LANGS.includes(hashLang)) return hashLang;
  // 2. Check localStorage
  try {
    const stored = localStorage.getItem('urbanlock_lang');
    if (SUPPORTED_LANGS.includes(stored)) return stored;
  } catch(e) {}
  // 3. Check browser language
  const browserLang = (navigator.language || 'ru').toLowerCase().substring(0,2);
  if (browserLang === 'kk' || browserLang === 'kz') return 'kz';
  if (browserLang === 'en') return 'en';
  return DEFAULT_LANG;
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  CURRENT_LANG = lang;
  document.documentElement.lang = lang;

  // Update lang button states
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  // Translate text content elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = I18N[lang][key];
    if (text !== undefined) el.textContent = text.replace(/<[^>]*>/g, '');
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = I18N[lang][key];
    if (text !== undefined) el.placeholder = text;
  });

  // Translate HTML content (allows <strong>, <em>, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const html = I18N[lang][key];
    if (html !== undefined) el.innerHTML = html;
  });

  // Translate option labels and optgroup labels in selects
  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-label');
    const text = I18N[lang][key];
    if (text !== undefined) el.label = text;
  });

  // Refresh open product modal if any
  if (typeof CURRENT_PRODUCT_ID !== 'undefined' && CURRENT_PRODUCT_ID) {
    showProduct(CURRENT_PRODUCT_ID);
  }

  // Save preference
  try { localStorage.setItem('urbanlock_lang', lang); } catch(e) {}
  // Update URL hash without scrolling
  const languageUrl = new URL(location.href);
  languageUrl.searchParams.set('lang', lang);
  history.replaceState(null, '', languageUrl);
}

// Helper to get translation
function t(key) {
  return I18N[CURRENT_LANG][key] || I18N.ru[key] || key;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setLang(document.getElementById('client-page') ? 'ru' : detectLanguage());
});

// =====================
// PRODUCT DETAIL MODAL
// =====================
const PRODUCTS = {
  'pl101-1': {
    model: 'PL101-1 · Автоматический',
    title: 'Автоматический парковочный замок PL101-1',
    image: 'PL 101.JPG',
    images: ['PL 101.JPG'],
    desc: 'Работает от батареек — без проводки и подключения к электросети. Дистанционное управление пультом, нагрузка до 2000 кг.',
    fullDesc: '<p>Автоматический парковочный блокиратор <strong>PL101-1</strong> предназначен для ограничения доступа к парковочному месту. Управление осуществляется с помощью дистанционного пульта, позволяющего быстро поднимать и опускать блокирующую дугу.</p><p>Корпус изготовлен из стали с антикоррозийным покрытием и рассчитан на эксплуатацию в условиях дождя, снега, пыли и перепадов температур.</p><h4>Особенности:</h4><ul class="product-feature-list"><li>Дистанционное управление</li><li>Электромеханический привод</li><li>Прочный стальной корпус</li><li>Антикоррозийное покрытие</li><li>Устойчивость к атмосферным воздействиям</li><li>Монтаж на асфальт или бетон</li><li>Подходит для частных и коммерческих парковок</li></ul><p>PL101-1 обеспечивает надёжную защиту парковочного места от несанкционированной парковки.</p>',
    tags: ['Пульт ДУ', 'Питание AA', '2000 кг', 'CE'],
    price: URBAN_CONFIG.prices['pl101-1'],
    stock: 'В наличии: 15+ единиц',
    specs: [
      ['Модель','PL101-1'],
      ['Тип','Smart Lock (умный замок)'],
      ['Управление','Пульт ДУ (в комплекте)'],
      ['Питание','Батарейки AA — 4–5 месяцев'],
      ['Нагрузка','до 2000 кг'],
      ['Габариты','445 × 435 мм'],
      ['Защита','IP65 (всепогодный)'],
      ['Радиус ДУ','до 50 метров'],
      ['Сертификация','CE'],
      ['Гарантия','12 месяцев'],
    ],
    warranty: '<p>На все автоматические парковочные блокираторы предоставляется <strong>гарантия 12 месяцев</strong> с момента покупки.</p><p>При необходимости технического обслуживания по желанию клиента стоимость выезда мастера и выполнения работ — <strong>5 000 ₸</strong>.</p>',
  },
  'pl101-11-auto': {
    model: 'PL101-11 · Автоматический',
    title: 'Автоматический парковочный замок PL101-11',
    image: 'assets/pl101-11.jpg',
    images: ['assets/pl101-11.jpg', 'assets/pl101-11-angles.jpg'],
    desc: 'Усовершенствованная модификация автоматического парковочного блокиратора. Электромеханический привод, дистанционное управление, усиленная конструкция.',
    fullDesc: '<p><strong>PL101-11 PRO</strong> — усовершенствованная версия автоматического парковочного блокиратора, предназначенная для надёжной защиты индивидуальных парковочных мест на жилых, коммерческих и корпоративных объектах.</p><p>Модель оснащена усиленной конструкцией, электромеханическим приводом и системой дистанционного управления. Корпус выполнен из высокопрочной стали с антикоррозийным покрытием, обеспечивающим устойчивость к механическим нагрузкам и воздействию окружающей среды.</p><h4>Особенности:</h4><ul class="product-feature-list"><li>Усиленная PRO-конструкция</li><li>Дистанционное управление с пульта ДУ</li><li>Электромеханический привод</li><li>Прочный стальной корпус</li><li>Антикоррозийное покрытие</li><li>Устойчивость к дождю, снегу и перепадам температур</li><li>Монтаж на бетонное или асфальтовое основание</li><li>Подходит для интенсивной эксплуатации</li></ul><p>PL101-11 PRO обеспечивает высокий уровень защиты парковочного места и рассчитан на длительную ежедневную эксплуатацию.</p>',
    tags: ['Электромеханический', 'Усиленная', '2000 кг'],
    price: URBAN_CONFIG.prices['pl101-11-auto'],
    stock: 'В наличии: 12 единиц',
    specs: [
      ['Модель','PL101-11 Pro / RICJ-PL101-H'],
      ['Тип','Smart Lock Pro'],
      ['Управление','Пульт ДУ + мобильное приложение опц.'],
      ['Питание','Встроенный АКБ 8000 мАч'],
      ['Время работы','6–7 месяцев на заряд'],
      ['Нагрузка','до 2000 кг'],
      ['Защита','IP67 (повышенная влагозащита)'],
      ['Сертификация','CE'],
      ['Гарантия','12 месяцев'],
    ],
    warranty: '<p>На все автоматические парковочные блокираторы предоставляется <strong>гарантия 12 месяцев</strong> с момента покупки.</p><p>При необходимости технического обслуживания по желанию клиента стоимость выезда мастера и выполнения работ — <strong>5 000 ₸</strong>.</p>',
  },
  'pl105-16': {
    model: 'PL105-16 · Ручной замок',
    title: 'Ручной парковочный замок PL105-16',
    image: 'pl105-16.JPG',
    images: ['pl105-16.JPG', 'pl105-16full.JPG'],
    imgViz: 'manual-lock',
    desc: 'Ручное управление без электроники. Никаких батареек, никакого обслуживания — только сталь и механика. ',
    fullDesc: '<p><strong>PL105-16</strong> — надёжный механический парковочный блокиратор для защиты личного парковочного места. Благодаря складной конструкции не занимает много места и прост в ежедневном использовании.</p><p>PL105-16 не требует подключения к электросети, зарядки аккумуляторов или дополнительного обслуживания. Изготовлен из прочной стали и рассчитан на длительную эксплуатацию в любых погодных условиях.</p><h4>Преимущества:</h4><ul class="product-feature-list"><li>Складная механическая конструкция</li><li>Не требует питания и электроники</li><li>Замковый механизм для защиты от посторонних</li><li>Усиленный стальной корпус</li><li>Защита от коррозии и влаги</li><li>Подходит для дворов, ЖК, офисов и предприятий</li><li>Быстрый монтаж на асфальт или бетон</li></ul><p>Простое и эффективное решение для резервирования парковочного места.</p>',
    tags: ['Без батарей', 'Ключ', 'Сталь', 'Ручное управление'],
    price: URBAN_CONFIG.prices['pl105-16'],
    stock: 'В наличии: 20+ единиц',
    specs: [
      ['Модель','PL105-16'],
      ['Тип','Механический складной'],
      ['Управление','Ручное + ключ-фиксатор'],
      ['Материал','Сталь, порошковая краска'],
      ['Нагрузка','до 3000 кг'],
      ['Срок службы','15+ лет'],
      ['Цвет','Жёлтый / RAL по запросу']
    ],
    warranty: '',
  },
  'pl105-10': {
    model: 'PL105-10 · Ручной шлагбаум',
    title: 'Ручной парковочный шлагбаум PL105-10',
    image: 'pl105-10.JPG',
    images: ['pl105-10.JPG', 'pl105-10full.JPG'],
    imgViz: 'u-shape',
    desc: 'П-образный ручной парковочный шлагбаум. Прочная стальная конструкция, складная механика, замковый механизм для защиты от посторонних.',
    fullDesc: '<p><strong>PL105-10</strong> — ручной парковочный шлагбаум П-образной конструкции. Используется для резервирования и защиты индивидуального парковочного места во дворах, ЖК, на коммерческих и частных территориях.</p><p>Изготовлен из прочной стали с антикоррозийным покрытием. Не требует электричества и обслуживания — простое и надёжное решение.</p>',
    tags: ['П-образный', 'Ручное управление', 'Сталь'],
    price: URBAN_CONFIG.prices['pl105-10'],
    stock: 'В наличии: 30+ единиц',
    specs: [
      ['Модель','PL105-10'],
      ['Тип','Складной треугольный барьер'],
      ['Управление','Ручное + ключ'],
      ['Материал','Сталь 2 мм'],
      ['Покрытие','Порошковая краска'],
      ['Цвет','Жёлтый / Серый / RAL'],
      ['Светоотражающие полосы','Да, в комплекте'],
      ['Срок службы','15+ лет']
    ],
    warranty: '',
  },
  'pl105-13': {
    model: 'PL105-13 · Ручной шлагбаум',
    title: 'Ручной парковочный шлагбаум PL105-13',
    image: 'pl105-13.JPG',
    images: ['pl105-13.JPG', 'pl105-13full.JPG'],
    imgViz: 'u-shape-wide',
    desc: 'Широкий П-образный ручной парковочный шлагбаум. Утолщённая сталь, антивандальный замок. Для коммерческих объектов с активным трафиком.',
    fullDesc: '<p><strong>PL105-13</strong> — широкий П-образный ручной парковочный шлагбаум, усиленная версия. Утолщённая сталь и антивандальный замковый механизм обеспечивают повышенную защиту парковочного места.</p><p>Рекомендуется для коммерческих объектов, мест с активным трафиком и территорий с риском попыток взлома.</p>',
    tags: ['Широкий П-образный', 'Усиленный', 'Антивандальный'],
    price: URBAN_CONFIG.prices['pl105-13'],
    stock: 'В наличии: 18 единиц',
    specs: [
      ['Модель','PL105-13 Усиленный'],
      ['Толщина стали','3 мм (вместо 2 мм)'],
      ['Замок','Усиленный, антивандальный'],
      ['Управление','Ручное + ключ'],
      ['Покрытие','Порошковая краска'],
      ['Срок службы','15+ лет']
    ],
    warranty: '',
  },
  'pl105-11': {
    model: 'PL105-11 · Ручной шлагбаум',
    title: 'Ручной парковочный шлагбаум PL105-11',
    image: 'pl105-11.JPG',
    images: ['pl105-11.JPG', 'pl105-11full.JPG'],
    desc: 'Треугольный складной ручной парковочный шлагбаум. Самое доступное решение для базовой защиты парковочного места.',
    fullDesc: '<p><strong>PL105-11</strong> — треугольный складной ручной парковочный шлагбаум. Базовая модель для частных дворов и личных парковочных мест по доступной цене.</p><p>Складная конструкция, замковый механизм, светоотражающие полосы в комплекте. Не требует обслуживания и электричества.</p>',
    tags: ['Треугольный', 'Складной', 'Доступная цена'],
    price: URBAN_CONFIG.prices['pl105-11'],
    stock: 'В наличии: 25+ единиц',
    specs: [
      ['Модель','PL105-11 Бюджет'],
      ['Тип','Складной треугольный барьер'],
      ['Материал','Сталь, облегчённая конструкция'],
      ['Управление','Ручное + ключ'],
      ['Цвет','Жёлтый'],
      ['Срок службы','10+ лет']
    ],
    warranty: '',
  },
  'barrier-e': {
    model: 'Barrier-E · Парковочный барьер',
    title: 'Парковочный барьер Barrier-E',
    image: 'barier-e.JPG',
    imgViz: 'wheel-stop',
    desc: 'Длина — 2000 мм, высота — 80 мм. Парковочный барьер-ограничитель с винтовым креплением. Жёлто-чёрная сигнальная окраска для лучшей видимости.',
    fullDesc: '<p>Длина — 2000 мм, высота — 80 мм.</p><p><strong>Barrier-E</strong> — парковочный барьер-ограничитель для разметки и ограничения движения колеса. Используется на парковках жилых комплексов, бизнес-центров и коммерческих объектов.</p><p>Стальная конструкция с порошковой покраской в сигнальные цвета (жёлтый + чёрный). Монтируется на бетонное или асфальтовое основание с помощью винтов и анкеров (входят в комплект).</p>',
    tags: ['Жёлто-чёрный', 'С винтами', 'Стальной'],
    price: URBAN_CONFIG.prices['barrier-e'],
    stock: 'В наличии: 30+ единиц',
    specs: [['Высота','80 мм'],['Длина','2000 мм'],
      ['Модель','Barrier-E'],
      ['Тип','Парковочный барьер-ограничитель'],
      ['Материал','Сталь, порошковая краска'],
      ['Цвет','Жёлтый + чёрный (сигнальный)'],
      ['Крепление','Винты + анкеры (в комплекте)'],
      ['Монтаж','На асфальт или бетон'],
      ['Срок службы','15+ лет']
    ],
    warranty: '',
  },
  'barrier-f': {
    model: 'Barrier-F · Парковочный барьер',
    title: 'Парковочный барьер Barrier-F',
    image: null,
    imgViz: 'wheel-stop',
    desc: 'Длина — 1500 мм, высота — 250 мм. Парковочный барьер с винтовым креплением. Габариты 1500 × 250 мм. Для разделения парковочных рядов и защиты пешеходных зон.',
    fullDesc: '<p><strong>Barrier-F</strong> — парковочный барьер с винтовым креплением. Используется для разделения парковочных рядов, защиты пешеходных зон и оформления периметра парковочной территории.</p><p>Габариты <strong>1500 × 250 мм</strong>. Толщина металла 1,5 мм обеспечивает прочность и устойчивость к нагрузкам.</p>',
    tags: ['1500 × 250 мм', 'С винтами', 'Сталь 1,5 мм'],
    price: URBAN_CONFIG.prices['barrier-f'],
    stock: 'В наличии: 25+ единиц',
    specs: [['Высота','250 мм'],['Длина','1500 мм'],
      ['Модель','Barrier-F'],
      ['Тип','Парковочный барьер'],
      ['Габариты','1500 × 250 мм'],
      ['Толщина металла','1,5 мм'],
      ['Материал','Сталь, порошковая краска'],
      ['Крепление','Винты + анкеры (в комплекте)'],
      ['Монтаж','На асфальт или бетон']
    ],
    warranty: '',
  },
};


// Localized product data (kz, en); ru is the base PRODUCTS object above
const PRODUCTS_I18N = {
  kz: {
    'pl101-1': {
      model:'PL101-1 · Автоматты', title:'Автоматты парковка құлпы PL101-1',
      desc:'Батарейкадан жұмыс істейді — сым және электр желісіне қосылусыз. Пультпен қашықтан басқару, жүктеме 2000 кг дейін.',
      fullDesc:'<p><strong>PL101-1</strong> — парковка орнына қол жетімділікті шектеуге арналған автоматты парковка блокираторы. Басқару бұғаттаушы садақты тез көтеруге және түсіруге мүмкіндік беретін қашықтан басқару пультімен жүзеге асырылады.</p><p>Корпус коррозияға қарсы жабыны бар болаттан жасалған және жаңбыр, қар, шаң және температура ауытқулары жағдайында пайдалануға арналған.</p><h4>Ерекшеліктері:</h4><ul class="product-feature-list"><li>Қашықтан басқару</li><li>Электромеханикалық жетек</li><li>Берік болат корпус</li><li>Коррозияға қарсы жабын</li><li>Атмосфералық әсерлерге төзімділік</li><li>Асфальт немесе бетонға монтаждау</li><li>Жеке және коммерциялық парковкаларға сай</li></ul><p>PL101-1 парковка орнын рұқсатсыз тұрақтаудан сенімді қорғауды қамтамасыз етеді.</p>',
      tags:['ҚБ пульті','AA қоректену','2000 кг','CE'],
      stock:'Қоймада бар: 15+ бірлік',
      specs:[['Моделі','PL101-1'],['Түрі','Smart Lock (ақылды құлып)'],['Басқару','ҚБ пульті (жинақта)'],['Қоректену','AA батарейкалары — 4–5 ай'],['Жүктеме','2000 кг дейін'],['Габариттері','445 × 435 мм'],['Қорғаныс','IP65 (барлық ауа райына)'],['ҚБ радиусы','50 метрге дейін'],['Сертификация','CE'],['Кепілдік','12 ай']],
      warranty:'<p>Барлық автоматты парковка блокираторларына сатып алу сәтінен бастап <strong>12 ай кепілдік</strong> беріледі.</p><p>Клиенттің тілегі бойынша техникалық қызмет көрсету қажет болған жағдайда шеберді шақыру және жұмыс құны — <strong>5 000 ₸</strong>.</p>',
    },
    'pl101-11-auto': {
      model:'PL101-11 · Автоматты', title:'Автоматты парковка құлпы PL101-11',
      desc:'Автоматты парковка блокираторының жетілдірілген модификациясы. Электромеханикалық жетек, қашықтан басқару, күшейтілген конструкция.',
      fullDesc:'<p><strong>PL101-11</strong> — тұрғын, коммерциялық және корпоративтік объектілердегі жеке парковка орындарын сенімді қорғауға арналған автоматты парковка блокираторының жетілдірілген нұсқасы.</p><p>Модель күшейтілген конструкциямен, электромеханикалық жетекпен және қашықтан басқару жүйесімен жабдықталған. Корпус механикалық жүктемелер мен қоршаған орта әсеріне төзімділікті қамтамасыз ететін коррозияға қарсы жабыны бар жоғары беріктікті болаттан жасалған.</p><h4>Ерекшеліктері:</h4><ul class="product-feature-list"><li>Күшейтілген конструкция</li><li>Қашықтан басқару пультімен</li><li>Электромеханикалық жетек</li><li>Берік болат корпус</li><li>Коррозияға қарсы жабын</li><li>Жаңбыр, қар, температура ауытқуларына төзімділік</li><li>Бетон немесе асфальт негізіне монтаждау</li><li>Қарқынды пайдалануға сай</li></ul><p>PL101-11 парковка орнын жоғары деңгейде қорғауды қамтамасыз етеді және ұзақ күнделікті пайдалануға арналған.</p>',
      tags:['Электромеханикалық','Күшейтілген','2000 кг'],
      stock:'Қоймада бар: 12 бірлік',
      specs:[['Моделі','PL101-11'],['Түрі','Электромеханикалық автоматты'],['Басқару','ҚБ пульті + опционалды қосымша'],['Қоректену','Кірістірілген АКБ'],['Жүктеме','2000 кг дейін'],['Қорғаныс','IP67 (жоғары ылғалдан қорғау)'],['Сертификация','CE'],['Кепілдік','12 ай']],
      warranty:'<p>Барлық автоматты парковка блокираторларына сатып алу сәтінен бастап <strong>12 ай кепілдік</strong> беріледі.</p><p>Клиенттің тілегі бойынша техникалық қызмет көрсету қажет болған жағдайда шеберді шақыру және жұмыс құны — <strong>5 000 ₸</strong>.</p>',
    },
    'pl105-16': {
      model:'PL105-16 · Қол құлпы', title:'Қол парковка құлпы PL105-16',
      desc:'Электроникасыз қолмен басқару — классикалық нұсқа. Қарапайым, сенімді, қызмет көрсетусіз. ',
      fullDesc:'<p><strong>PL105-16</strong> — жеке парковка орнын қорғауға арналған сенімді механикалық парковка блокираторы. Жиналмалы конструкциясының арқасында көп орын алмайды және күнделікті пайдалануда қарапайым.</p><p>PL105-16 электр желісіне қосылуды, аккумуляторларды зарядтауды немесе қосымша қызмет көрсетуді қажет етпейді. Берік болаттан жасалған және кез келген ауа райы жағдайында ұзақ пайдалануға арналған.</p><h4>Артықшылықтары:</h4><ul class="product-feature-list"><li>Жиналмалы механикалық конструкция</li><li>Қоректену мен электрониканы қажет етпейді</li><li>Бөгде адамдардан қорғауға арналған құлып механизмі</li><li>Күшейтілген болат корпус</li><li>Коррозия мен ылғалдан қорғау</li><li>Аула, ТК, кеңсе және кәсіпорындарға сай</li><li>Асфальт немесе бетонға жылдам монтаждау</li></ul><p>Парковка орнын резервтеудің қарапайым және тиімді шешімі.</p>',
      tags:['Батареясыз','Кілт','Болат','Қолмен басқару'],
      stock:'Қоймада бар: 20+ бірлік',
      specs:[['Моделі','PL105-16'],['Түрі','Механикалық жиналмалы'],['Басқару','Қол + кілт-бекіткіш'],['Материалы','Болат, ұнтақ боя'],['Жүктеме','3000 кг дейін'],['Қызмет ету мерзімі','15+ жыл'],['Түсі','Сары / тапсырыс бойынша RAL']],
      warranty: '',
    },
    'pl105-10': {
      model:'PL105-10 · Қол шлагбауы', title:'Қол парковка шлагбауы PL105-10',
      desc:'П-тәрізді қол парковка шлагбауы. Берік болат конструкция, жиналмалы механика, бөгде адамдардан қорғауға арналған құлып механизмі.',
      fullDesc:'<p><strong>PL105-10</strong> — П-тәрізді конструкциясы бар қол парковка шлагбауы. Тұрғын, коммерциялық және жеке аумақтардағы аула, ТК ішінде жеке парковка орнын резервтеу және қорғау үшін қолданылады.</p><p>Коррозияға қарсы жабыны бар берік болаттан жасалған. Электр желісі мен қызмет көрсетуді қажет етпейді — қарапайым және сенімді шешім.</p>',
      tags:['П-тәрізді','Қолмен басқару','Болат'],
      stock:'Қоймада бар: 30+ бірлік',
      specs:[['Моделі','PL105-10'],['Түрі','П-тәрізді жиналмалы шлагбаум'],['Басқару','Қол + кілт'],['Материалы','Болат 2 мм'],['Жабын','Ұнтақ боя'],['Түсі','Сары / Сұр / RAL'],['Жарықшағылыстырғыш жолақтар','Иә, жинақта'],['Қызмет ету мерзімі','15+ жыл']],
      warranty: '',
    },
    'pl105-13': {
      model:'PL105-13 · Қол шлагбауы', title:'Қол парковка шлагбауы PL105-13',
      desc:'Кең П-тәрізді қол парковка шлагбауы. Қалыңдатылған болат, антивандалды құлып. Белсенді трафигі бар коммерциялық нысандарға.',
      fullDesc:'<p><strong>PL105-13</strong> — кең П-тәрізді қол парковка шлагбауының күшейтілген нұсқасы. Қалыңдатылған болат және антивандалды құлып механизмі парковка орнын жоғары деңгейде қорғауды қамтамасыз етеді.</p><p>Белсенді трафигі бар коммерциялық объектілерге, бұзу әрекетінің қаупі бар орындарға және қойма мен кәсіпорындарға ұсынылады.</p>',
      tags:['Кең П-тәрізді','Күшейтілген','Антивандалды'],
      stock:'Қоймада бар: 18 бірлік',
      specs:[['Моделі','PL105-13 Күшейтілген'],['Болат қалыңдығы','3 мм (2 мм орнына)'],['Құлып','Күшейтілген, антивандалды'],['Басқару','Қол + кілт'],['Жабын','Ұнтақ боя'],['Қызмет ету мерзімі','15+ жыл']],
      warranty: '',
    },
    'pl105-11': {
      model:'PL105-11 · Қол шлагбауы', title:'Қол парковка шлагбауы PL105-11',
      desc:'Үшбұрышты жиналмалы қол парковка шлагбауы. Парковка орнын негізгі қорғауға арналған ең қолжетімді шешім.',
      fullDesc:'<p><strong>PL105-11</strong> — үшбұрышты жиналмалы қол парковка шлагбауы. Жеке аула мен жеке парковка орындарына арналған негізгі модель.</p><p>Жиналмалы конструкция, құлып механизмі, жинақта жарықшағылыстырғыш жолақтар. Қызмет көрсету мен электр энергиясын қажет етпейді.</p>',
      tags:['Үшбұрышты','Жиналмалы','Қолжетімді баға'],
      stock:'Қоймада бар: 25+ бірлік',
      specs:[['Моделі','PL105-11'],['Түрі','Үшбұрышты жиналмалы шлагбаум'],['Материалы','Болат, жеңілдетілген конструкция'],['Басқару','Қол + кілт'],['Түсі','Сары'],['Қызмет ету мерзімі','10+ жыл']],
      warranty: '',
    },
    'barrier-e': {
      model:'Barrier-E · Парковка барьері', title:'Парковка барьері Barrier-E',
      desc:'Ұзындығы — 2000 мм, биіктігі — 80 мм. Бұрандалы бекітпесі бар парковка барьері-шектегіші. Жақсырақ көрінуі үшін сары-қара сигналдық бояу.',
      fullDesc:'<p>Ұзындығы — 2000 мм, биіктігі — 80 мм.</p><p><strong>Barrier-E</strong> — белгілеу мен дөңгелек қозғалысын шектеуге арналған парковка барьері-шектегіш. Тұрғын кешендерінің, бизнес-орталықтардың және коммерциялық объектілердің парковкаларында қолданылады.</p><p>Сигналдық түстерге (сары + қара) ұнтақ бояумен боялған болат конструкциядан жасалған. Бұрандалар мен анкерлер арқылы бетон немесе асфальт негізіне монтаждалады (жинаққа кіреді).</p>',
      tags:['Сары-қара','Бұрандалармен','Болат'],
      stock:'Қоймада бар: 30+ бірлік',
      specs:[['Моделі','Barrier-E'],['Түрі','Парковка барьері-шектегіш'],['Материалы','Құбырлы болат'],['Түсі','RAL 1023 (сары)'],['Жабын','Ұнтақ боя'],['Ұзындығы','2000 мм'],['Биіктігі','80 мм'],['Монтаждау','Анкерлік немесе пісірілген']],
      warranty: '',
    },
    'barrier-f': {
      model:'Barrier-F · Парковка барьері', title:'Парковка барьері Barrier-F',
      desc:'Ұзындығы — 1500 мм, биіктігі — 250 мм. Бұрандалы бекітпесі бар парковка барьері. Габариттері 1500 × 250 мм. Парковка қатарларын бөлуге және жаяу жүргіншілер аймағын қорғауға арналған.',
      fullDesc:'<p><strong>Barrier-F</strong> — бұрандалы бекітпесі бар парковка барьері. Парковка қатарларын бөлуге, жаяу жүргіншілер аймағын қорғауға және парковка аумағының периметрін безендіруге арналған.</p><p>Габариттері <strong>1500 × 250 мм</strong>. Металдың 1,5 мм қалыңдығы беріктікті және жүктемелерге төзімділікті қамтамасыз етеді.</p>',
      tags:['1500 × 250 мм','Бұрандалармен','1,5 мм болат'],
      stock:'Қоймада бар: 25+ бірлік',
      specs:[['Биіктігі','250 мм'],['Ұзындығы','1500 мм'],['Моделі','Barrier-F'],['Түрі','Парковка барьері'],['Габариттері','1500 × 250 мм'],['Металл қалыңдығы','1,5 мм'],['Материалы','Болат, ұнтақ боя'],['Бекіту','Бұрандалар + анкерлер (жинақта)'],['Монтаждау','Асфальт немесе бетонға']],
      warranty: '',
    },
  },
  en: {
    'pl101-1': {
      model:'PL101-1 · Automatic', title:'Automatic parking lock PL101-1',
      desc:'Battery-powered — no wiring or power connection needed. Remote control operation, load capacity up to 2000 kg.',
      fullDesc:'<p>Automatic parking blocker <strong>PL101-1</strong> is designed to restrict access to a parking space. Control is carried out using a remote control, allowing you to quickly raise and lower the blocking arc.</p><p>The body is made of steel with anti-corrosion coating and is designed for operation in conditions of rain, snow, dust and temperature fluctuations.</p><h4>Features:</h4><ul class="product-feature-list"><li>Remote control</li><li>Electromechanical drive</li><li>Durable steel body</li><li>Anti-corrosion coating</li><li>Resistance to atmospheric influences</li><li>Mounting on asphalt or concrete</li><li>Suitable for private and commercial parking</li></ul><p>PL101-1 provides reliable protection of the parking space from unauthorized parking.</p>',
      tags:['Remote control','AA batteries','2000 kg','CE'],
      stock:'In stock: 15+ units',
      specs:[['Model','PL101-1'],['Type','Smart Lock'],['Control','Remote control (included)'],['Power','AA batteries — 4–5 months'],['Load capacity','up to 2000 kg'],['Dimensions','445 × 435 mm'],['Protection','IP65 (all-weather)'],['Remote range','up to 50 meters'],['Certification','CE'],['Warranty','12 months']],
      warranty:'<p>All automatic parking blockers come with a <strong>12-month warranty</strong> from the date of purchase.</p><p>If technical service is required at the customer request, the cost of a master visit and work is — <strong>5,000 ₸</strong>.</p>',
    },
    'pl101-11-auto': {
      model:'PL101-11 · Automatic', title:'Automatic parking lock PL101-11',
      desc:'Enhanced modification of the automatic parking blocker. Electromechanical drive, remote control, reinforced construction.',
      fullDesc:'<p><strong>PL101-11</strong> is an enhanced version of the automatic parking blocker, designed for reliable protection of individual parking spaces at residential, commercial and corporate facilities.</p><p>The model is equipped with a reinforced design, an electromechanical drive and a remote control system. The body is made of high-strength steel with an anti-corrosion coating that provides resistance to mechanical loads and environmental influences.</p><h4>Features:</h4><ul class="product-feature-list"><li>Reinforced construction</li><li>Remote control operation</li><li>Electromechanical drive</li><li>Durable steel body</li><li>Anti-corrosion coating</li><li>Resistance to rain, snow and temperature fluctuations</li><li>Mounting on concrete or asphalt base</li><li>Suitable for intensive use</li></ul><p>PL101-11 provides a high level of parking space protection and is designed for long-term daily use.</p>',
      tags:['Electromechanical','Reinforced','2000 kg'],
      stock:'In stock: 12 units',
      specs:[['Model','PL101-11'],['Type','Electromechanical automatic'],['Control','Remote control + optional app'],['Power','Built-in battery'],['Load capacity','up to 2000 kg'],['Protection','IP67 (enhanced moisture protection)'],['Certification','CE'],['Warranty','12 months']],
      warranty:'<p>All automatic parking blockers come with a <strong>12-month warranty</strong> from the date of purchase.</p><p>If technical service is required at the customer request, the cost of a master visit and work is — <strong>5,000 ₸</strong>.</p>',
    },
    'pl105-16': {
      model:'PL105-16 · Manual lock', title:'Manual parking lock PL105-16',
      desc:'Manual operation without electronics — the classic option. Simple, reliable, maintenance-free. ',
      fullDesc:'<p><strong>PL105-16</strong> is a reliable mechanical parking blocker for protecting a personal parking space. Due to its folding design, it does not take up much space and is easy to use daily.</p><p>PL105-16 does not require connection to the power supply, battery charging, or additional maintenance. Made of durable steel and designed for long-term operation in any weather conditions.</p><h4>Advantages:</h4><ul class="product-feature-list"><li>Foldable mechanical construction</li><li>No power or electronics required</li><li>Lock mechanism for protection against outsiders</li><li>Reinforced steel body</li><li>Protection against corrosion and moisture</li><li>Suitable for yards, residential complexes, offices and enterprises</li><li>Quick mounting on asphalt or concrete</li></ul><p>A simple and effective solution for reserving a parking space.</p>',
      tags:['No batteries','Key','Steel','Manual control'],
      stock:'In stock: 20+ units',
      specs:[['Model','PL105-16'],['Type','Mechanical folding'],['Control','Manual + key'],['Material','Steel, powder coating'],['Load capacity','up to 3000 kg'],['Service life','15+ years'],['Color','Yellow / custom RAL on request']],
      warranty: '',
    },
    'pl105-10': {
      model:'PL105-10 · Manual barrier', title:'Manual parking barrier PL105-10',
      desc:'U-shaped manual parking barrier. Durable steel construction, folding mechanism, lock for protection against outsiders.',
      fullDesc:'<p><strong>PL105-10</strong> is a U-shaped manual parking barrier. Used for reserving and protecting an individual parking space in yards, residential complexes, on commercial and private territories.</p><p>Made of durable steel with anti-corrosion coating. Does not require electricity or maintenance — a simple and reliable solution.</p>',
      tags:['U-shaped','Manual control','Steel'],
      stock:'In stock: 30+ units',
      specs:[['Model','PL105-10'],['Type','U-shaped folding barrier'],['Control','Manual + key'],['Material','Steel 2 mm'],['Coating','Powder paint'],['Color','Yellow / Gray / RAL'],['Reflective stripes','Yes, included'],['Service life','15+ years']],
      warranty: '',
    },
    'pl105-13': {
      model:'PL105-13 · Manual barrier', title:'Manual parking barrier PL105-13',
      desc:'Wide U-shaped manual parking barrier. Thickened steel, anti-vandal lock. For commercial facilities with active traffic.',
      fullDesc:'<p><strong>PL105-13</strong> is a wide U-shaped manual parking barrier, a reinforced version. Thickened steel and anti-vandal lock mechanism provide enhanced protection of the parking space.</p><p>Recommended for commercial facilities, places with active traffic, and territories with a risk of break-in attempts.</p>',
      tags:['Wide U-shaped','Reinforced','Anti-vandal'],
      stock:'In stock: 18 units',
      specs:[['Model','PL105-13 Reinforced'],['Steel thickness','3 mm (instead of 2 mm)'],['Lock','Reinforced, anti-vandal'],['Control','Manual + key'],['Coating','Powder paint'],['Service life','15+ years']],
      warranty: '',
    },
    'pl105-11': {
      model:'PL105-11 · Manual barrier', title:'Manual parking barrier PL105-11',
      desc:'Triangular foldable manual parking barrier. The most affordable solution for basic parking space protection.',
      fullDesc:'<p><strong>PL105-11</strong> is a triangular foldable manual parking barrier. A basic model for private yards and personal parking spaces.</p><p>Foldable construction, lock mechanism, reflective stripes included. Does not require maintenance or electricity.</p>',
      tags:['Triangular','Foldable','Affordable'],
      stock:'In stock: 25+ units',
      specs:[['Model','PL105-11'],['Type','Triangular folding barrier'],['Material','Steel, lightweight construction'],['Control','Manual + key'],['Color','Yellow'],['Service life','10+ years']],
      warranty: '',
    },
    'barrier-e': {
      model:'Barrier-E · Parking bollard', title:'Parking bollard Barrier-E',
      desc:'Length: 2000 mm, height: 80 mm. Parking bollard limiter with screw mounting. Yellow-black signal coloring for better visibility.',
      fullDesc:'<p>Length: 2000 mm. Height: 80 mm.</p><p><strong>Barrier-E</strong> is a parking bollard limiter for marking and limiting wheel movement. Used in parking lots of residential complexes, business centers and commercial facilities.</p><p>Steel construction with powder coating in signal colors (yellow + black). Mounted on concrete or asphalt base using screws and anchors (included).</p>',
      tags:['Yellow-black','With screws','Steel'],
      stock:'In stock: 30+ units',
      specs:[['Model','Barrier-E'],['Type','Parking bollard limiter'],['Material','Tubular steel'],['Color','RAL 1023 (yellow)'],['Coating','Powder paint'],['Length','2000 mm'],['Height','80 mm'],['Mounting','Anchor or welded']],
      warranty: '',
    },
    'barrier-f': {
      model:'Barrier-F · Parking bollard', title:'Parking bollard Barrier-F',
      desc:'Length: 1500 mm, height: 250 mm. Parking bollard with screw mounting. Dimensions 1500 × 250 mm. For separating parking rows and protecting pedestrian zones.',
      fullDesc:'<p><strong>Barrier-F</strong> is a parking bollard with screw mounting. Used to separate parking rows, protect pedestrian zones and design the perimeter of the parking territory.</p><p>Dimensions <strong>1500 × 250 mm</strong>. Metal thickness of 1.5 mm ensures strength and resistance to loads.</p>',
      tags:['1500 × 250 mm','With screws','1.5 mm steel'],
      stock:'In stock: 25+ units',
      specs:[['Height','250 mm'],['Length','1500 mm'],['Model','Barrier-F'],['Type','Parking bollard'],['Dimensions','1500 × 250 mm'],['Metal thickness','1.5 mm'],['Material','Steel, powder paint'],['Mounting','Screws + anchors (included)'],['Installation','On asphalt or concrete']],
      warranty: '',
    },
  }
};

// Helper to get language-aware product field value
function pField(p, id, field) {
  const lang = CURRENT_LANG;
  if (lang !== 'ru' && PRODUCTS_I18N[lang] && PRODUCTS_I18N[lang][id] && PRODUCTS_I18N[lang][id][field] !== undefined) {
    return PRODUCTS_I18N[lang][id][field];
  }
  return p[field];
}

// Track currently open product to refresh on language change
let CURRENT_PRODUCT_ID = null;

function showProduct(id) {
  const p = PRODUCTS[id];
  if (!p) return;
  CURRENT_PRODUCT_ID = id;

  // Image or CSS viz
  const imgWrap = document.getElementById('pm-img-wrap');
  if (p.image) {
    renderProductGallery(imgWrap, p, pField(p, id, 'title'));
  } else if (id === 'barrier-f') {
    imgWrap.innerHTML = '<div class="photo-pending">Barrier-F<span>Фото уточняется</span><small>1500 × 250 мм</small></div>';
  } else if (p.imgViz === 'u-shape') {
    imgWrap.innerHTML = '<svg viewBox="0 0 240 200" style="width:80%;max-width:280px"><rect x="50" y="30" width="22" height="140" fill="#FFC107" rx="3"/><rect x="168" y="30" width="22" height="140" fill="#FFC107" rx="3"/><rect x="50" y="30" width="140" height="22" fill="#FFC107" rx="3"/><circle cx="120" cy="100" r="16" fill="none" stroke="#FFC107" stroke-width="4"/><rect x="20" y="178" width="200" height="6" fill="#666" rx="2"/></svg>';
  } else if (p.imgViz === 'u-shape-wide') {
    imgWrap.innerHTML = '<svg viewBox="0 0 280 200" style="width:90%;max-width:320px"><rect x="30" y="30" width="26" height="140" fill="#FFC107" rx="3"/><rect x="224" y="30" width="26" height="140" fill="#FFC107" rx="3"/><rect x="30" y="30" width="220" height="26" fill="#FFC107" rx="3"/><circle cx="140" cy="100" r="18" fill="none" stroke="#FFC107" stroke-width="4"/><rect x="10" y="178" width="260" height="6" fill="#666" rx="2"/></svg>';
  } else if (p.imgViz === 'wheel-stop') {
    imgWrap.innerHTML = '<svg viewBox="0 0 300 160" style="width:90%;max-width:320px"><rect x="10" y="80" width="280" height="40" fill="#FFC107" rx="4"/><rect x="30" y="80" width="40" height="40" fill="#222"/><rect x="100" y="80" width="40" height="40" fill="#222"/><rect x="170" y="80" width="40" height="40" fill="#222"/><rect x="240" y="80" width="40" height="40" fill="#222"/><circle cx="40" cy="100" r="5" fill="#aaa"/><circle cx="110" cy="100" r="5" fill="#aaa"/><circle cx="180" cy="100" r="5" fill="#aaa"/><circle cx="250" cy="100" r="5" fill="#aaa"/><rect x="0" y="140" width="300" height="8" fill="#666" rx="2"/></svg>';
  } else if (p.imgViz === 'manual-lock') {
    imgWrap.innerHTML = '<svg viewBox="0 0 200 200" style="width:75%;max-width:240px"><rect x="40" y="80" width="120" height="80" fill="#FFC107" rx="6"/><path d="M65 80 V60 a35 35 0 0 1 70 0 V80" fill="none" stroke="#FFC107" stroke-width="10" stroke-linecap="round"/><circle cx="100" cy="120" r="10" fill="#111"/><rect x="96" y="125" width="8" height="20" fill="#111"/></svg>';
  } else if (p.imgViz) {
    const color = p.imgViz === 'yellow' ? '#FFC107' : '#666';
    imgWrap.innerHTML = '<div class="product-modal-img-cssviz">'+
      '<div class="bar" style="background:'+color+'"></div>'+
      '<div class="bar" style="background:'+color+'"></div>'+
      '<div class="ground"></div>'+
      '<div class="bar" style="background:'+color+'"></div>'+
      '<div class="bar" style="background:'+color+'"></div>'+
      '</div>';
  }

  document.getElementById('pm-model').textContent = pField(p, id, 'model').toUpperCase();
  document.getElementById('pm-title').textContent = pField(p, id, 'title');
  document.getElementById('pm-desc').textContent = pField(p, id, 'desc');
  document.getElementById('pm-price').innerHTML = Number(p.price).toLocaleString('ru-RU') + '<small> ₸</small>';
  document.getElementById('pm-stock').textContent = pField(p, id, 'stock');
  document.getElementById('pm-fulldesc').innerHTML = pField(p, id, 'fullDesc');

  // Tags
  const tagsBox = document.getElementById('pm-tags');
  tagsBox.innerHTML = '';
  pField(p, id, 'tags').forEach(t => {
    const span = document.createElement('span');
    span.className = 'card-spec-tag';
    span.textContent = t;
    tagsBox.appendChild(span);
  });

  // Specs
  const specsBox = document.getElementById('pm-specs');
  specsBox.innerHTML = '';
  pField(p, id, 'specs').forEach(([k,v]) => {
    const row = document.createElement('div');
    row.className = 'spec-row';
    row.innerHTML = '<div class="spec-k">'+k+'</div><div class="spec-v">'+v+'</div>';
    specsBox.appendChild(row);
  });

  // Warranty block
  const wBox = document.getElementById('pm-warranty');
  const warrantyHTML = pField(p, id, 'warranty');
  if (warrantyHTML) {
    const lang = CURRENT_LANG;
    let wTitle;
    if (lang === 'kz') {
      wTitle = warrantyHTML.indexOf('қызмет көрсету') !== -1 ? 'Кепілдік және қызмет көрсету' : 'Кепілдік';
    } else if (lang === 'en') {
      wTitle = warrantyHTML.indexOf('service is required') !== -1 ? 'Warranty and service' : 'Warranty';
    } else {
      wTitle = warrantyHTML.indexOf('обслуживания') !== -1 ? 'Гарантия и обслуживание' : 'Гарантия';
    }
    document.querySelector('#pm-warranty .product-modal-warranty-title').textContent = wTitle;
    document.getElementById('pm-warranty-body').innerHTML = warrantyHTML;
    wBox.style.display = 'block';
  } else {
    wBox.style.display = 'none';
  }

  // Wire action buttons
  document.getElementById('pm-btn-order').onclick = function() {
    closeProductModal();
    orderProduct(pField(p, id, 'model'));
  };
  document.getElementById('pm-btn-wa').href = 'https://wa.me/' + OWNER_WA + '?text=' + encodeURIComponent(t('wa.product') + ' ' + pField(p, id, 'model') + ' (' + pField(p, id, 'title') + '). ' + (CURRENT_LANG === 'kz' ? 'Менімен байланысыңыз.' : CURRENT_LANG === 'en' ? 'Please contact me.' : 'Свяжитесь со мной.'));

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('open');
  CURRENT_PRODUCT_ID = null;
  // Restore body scroll after the close animation completes
  setTimeout(() => { document.body.style.overflow = ''; }, 350);
}

document.getElementById('productModal').addEventListener('click', function(e) {
  if (e.target === this) closeProductModal();
});

// Close on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeProductModal(); closeQuoteModal(); }
});

function openQuoteModal() {
  document.getElementById('quoteModal').classList.add('open');
  setTimeout(() => document.getElementById('quote-name').focus(), 50);
}
function closeQuoteModal() {
  document.getElementById('quoteModal').classList.remove('open');
}
document.getElementById('quoteModal').addEventListener('click', function(e) {
  if(e.target === this) closeQuoteModal();
});

// Owner's WhatsApp number — все заявки уходят сюда
const OWNER_WA = URBAN_CONFIG.whatsapp;

function sendQuickQuote() {
  // Multilingual labels for WhatsApp message
  const L = {
    ru: { greeting:'Здравствуйте!', name:'Имя', phone:'Телефон', product:'Товар', qty:'Количество', addr:'Адрес', comment:'Комментарий', from:'Заявка с сайта Urban Lock' },
    kz: { greeting:'Сәлем!', name:'Аты', phone:'Телефон', product:'Тауар', qty:'Саны', addr:'Мекен-жайы', comment:'Түсініктеме', from:'Urban Lock сайтынан өтінім' },
    en: { greeting:'Hello!', name:'Name', phone:'Phone', product:'Product', qty:'Quantity', addr:'Address', comment:'Comment', from:'Request from Urban Lock website' }
  }[CURRENT_LANG || 'ru'];
  const name = document.getElementById('quote-name').value.trim();
  const phone = document.getElementById('quote-phone').value.trim();
  const product = document.getElementById('quote-product').value;
  const qty = document.getElementById('quote-qty').value.trim();
  const address = document.getElementById('quote-address').value.trim();
  const comment = document.getElementById('quote-comment').value.trim();

  if (!name) { alert(CURRENT_LANG === 'kz' ? 'Атыңызды көрсетіңіз' : CURRENT_LANG === 'en' ? 'Please enter your name' : 'Пожалуйста, укажите имя'); document.getElementById('quote-name').focus(); return; }
  if (!phone) { alert(CURRENT_LANG === 'kz' ? 'Телефон нөмірін көрсетіңіз' : CURRENT_LANG === 'en' ? 'Please enter your phone number' : 'Пожалуйста, укажите номер телефона'); document.getElementById('quote-phone').focus(); return; }

  let message = L.greeting + ' ' + L.from + '\n\n';
  message += '👤 ' + L.name + ': ' + name + '\n';
  message += '📞 ' + L.phone + ': ' + phone + '\n';
  message += '🔹 ' + L.product + ': ' + product + '\n';
  if (qty && (!Number.isInteger(Number(qty)) || Number(qty) < 1)) { alert('Количество должно быть целым числом от 1.'); return; }
  if (qty) message += '🔢 ' + L.qty + ': ' + qty + '\n';
  if (address) message += '📍 ' + L.addr + ': ' + address + '\n';
  if (comment) message += '💬 ' + L.comment + ': ' + comment + '\n';

  if (phone.replace(/\D/g, '').length < 10 || phone.replace(/\D/g, '').length > 15) { alert('Укажите корректный телефон: от 10 до 15 цифр.'); return; }
  const url = 'https://wa.me/' + OWNER_WA + '?text=' + encodeURIComponent(message);
  urbanTrack('lead_draft_prepared', {form_type:'quote'});
  urbanTrack('whatsapp_click', {placement:'quote_form'});
  window.open(url, '_blank', 'noopener,noreferrer');
  closeQuoteModal();
}

function sendProjectQuote() {
  const name = document.getElementById('proj-name').value.trim();
  const phone = document.getElementById('proj-phone').value.trim();
  const object = document.getElementById('proj-object').value;
  const spots = document.getElementById('proj-spots').value.trim();
  const desc = document.getElementById('proj-desc').value.trim();

  if (!name) { alert('Пожалуйста, укажите имя'); document.getElementById('proj-name').focus(); return; }
  if (!phone) { alert('Пожалуйста, укажите номер телефона'); document.getElementById('proj-phone').focus(); return; }

  let message = 'Здравствуйте! Заявка на расчёт проекта с сайта Urban Lock\n\n';
  message += '👤 Имя: ' + name + '\n';
  message += '📞 Телефон: ' + phone + '\n';
  if (object) message += '🏢 Тип объекта: ' + object + '\n';
  if (spots) message += '🅿️ Количество мест: ' + spots + '\n';
  if (desc) message += '📝 Описание: ' + desc + '\n';
  message += '\nПрошу подготовить коммерческое предложение.';

  if (phone.replace(/\D/g, '').length < 10 || phone.replace(/\D/g, '').length > 15) { alert('Укажите корректный телефон: от 10 до 15 цифр.'); return; }
  const url = 'https://wa.me/' + OWNER_WA + '?text=' + encodeURIComponent(message);
  urbanTrack('lead_draft_prepared', {form_type:'quote'});
  urbanTrack('whatsapp_click', {placement:'quote_form'});
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Shared gallery for catalog cards and the product detail window.
function renderProductGallery(wrap, product, title) {
  const photos = [...new Set(product.images || [product.image])];
  wrap.onclick = null;
  wrap.ontouchstart = null;
  wrap.ontouchend = null;
  if (wrap.id === 'pm-img-wrap') wrap.replaceChildren();
  wrap.querySelectorAll('img, svg, .gallery-arrow, .gallery-count').forEach(el => el.remove());
  wrap.classList.add('product-gallery');
  const img = document.createElement('img');
  img.alt = title;
  img.draggable = false;
  img.loading = wrap.id === 'pm-img-wrap' ? 'eager' : 'lazy';
  wrap.prepend(img);
  let index = 0;
  const count = document.createElement('span');
  count.className = 'gallery-count';
  count.setAttribute('aria-live', 'polite');
  function show(step) {
    index = (index + step + photos.length) % photos.length;
    img.src = photos[index];
    count.textContent = (index + 1) + ' / ' + photos.length;
  }
  show(0);
  if (photos.length < 2) return;
  wrap.append(count);
  for (const [step, label, glyph, side] of [[-1, 'Предыдущее фото', '‹', 'prev'], [1, 'Следующее фото', '›', 'next']]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-arrow gallery-' + side;
    button.setAttribute('aria-label', label);
    button.textContent = glyph;
    button.onclick = event => { event.stopPropagation(); show(step); };
    wrap.append(button);
  }
  let start = null;
  let swiped = false;
  wrap.ontouchstart = event => { start = {x: event.touches[0].clientX, y: event.touches[0].clientY}; swiped = false; };
  wrap.ontouchend = event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { show(dx < 0 ? 1 : -1); swiped = true; }
    start = null;
  };
  wrap.onclick = event => { if (swiped) { event.stopPropagation(); event.preventDefault(); swiped = false; } };
}
document.querySelectorAll('.catalog-card').forEach(card => {
  const match = (card.getAttribute('onclick') || '').match(/showProduct\('([^']+)'\)/);
  const product = match && PRODUCTS[match[1]];
  if (product && product.image) renderProductGallery(card.querySelector('.catalog-card-img'), product, product.title);
});

