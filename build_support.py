"""Build-time price synchronization and metadata from the single site-config.js."""
from pathlib import Path
import json,re,html
ROOT=Path(__file__).parent
def config():
    return json.loads((ROOT/'site-config.js').read_text().split('=',1)[1].strip().rstrip(';'))
def sync_prices(shell):
    prices=config()['prices']
    pattern=r'(<div class="(?:catalog-card|price-row-data)"[^>]*onclick="showProduct\(\'([^\']+)\'\)"[^>]*>)(.*?)(?=<div class="(?:catalog-card|price-row-data)"|<!--|$)'
    # Card/row prices are the first price node following each product's opening tag.
    for id,amount in prices.items():
        if not isinstance(amount,(int,float)) or amount<0: raise ValueError('Invalid price: '+id)
        amount=f'{amount:,.0f}'.replace(',',' ')
        for cls in ['catalog-card-price','price-retail']:
            pat=r'(onclick="showProduct\(\''+re.escape(id)+r'\'\)"[\s\S]*?<div class="'+cls+r'">)[\d\s]+(?=\s*<small>)'
            # Limit search to the right card/row type to avoid crossing into another section.
            container='catalog-card' if cls=='catalog-card-price' else 'price-row-data'
            matches=list(re.finditer(r'<div class="'+container+r'"[^>]*onclick="showProduct\(\''+re.escape(id)+r'\'\)"',shell))
            for match in reversed(matches):
                tail=shell[match.start():]
                next_card=re.search(r'<div class="'+container+r'"',tail[1:])
                limit=(next_card.start()+1) if next_card else len(tail)
                chunk=tail[:limit]
                chunk=re.sub(r'(<div class="'+cls+r'">)[\d\s]+(?=\s*<small>)',lambda m:m[1]+amount,chunk,count=1)
                shell=shell[:match.start()]+chunk+tail[limit:]
    return shell
META={
'URBANLOCK.html':('Urban Lock — парковочные блокираторы и установка в Алматы','Автоматические и механические парковочные блокираторы Urban Lock в Алматы. Подбор оборудования, расчёт стоимости, выезд на объект и монтаж.'),
'business.html':('Парковочные решения для бизнес-центров в Алматы — Urban Lock','Оснащение парковок бизнес-центров: блокираторы, подбор оборудования, выезд на объект и расчёт монтажа. Urban Lock, Алматы.'),
'residential.html':('Парковочные блокираторы для ЖК в Алматы — Urban Lock','Решения для жильцов и управляющих компаний: подземный, наземный и уличный паркинг. Консультация, подбор и монтаж Urban Lock.'),
'commercial.html':('Оснащение коммерческих парковок в Алматы — Urban Lock','Блокираторы, барьеры и монтаж для торговых центров, магазинов и офисных зданий. Подбор с учётом рельефа и объёма работ.'),
'private.html':('Блокиратор на личное парковочное место — Urban Lock, Алматы','Подбор и установка автоматического или механического блокиратора на личное парковочное место в Алматы. Консультация и расчёт стоимости.'),
'catalog.html':('Каталог парковочных блокираторов и барьеров — Urban Lock','Цены, фотографии и характеристики автоматических и механических парковочных замков, барьеров E и F. Подбор оборудования в Алматы.'),
'pricelist.html':('Цены на парковочные блокираторы в Алматы — Urban Lock','Актуальные цены оборудования Urban Lock: автоматические замки PL101, механические PL105 и барьеры. Стоимость монтажа рассчитывается отдельно.'),
'services.html':('Установка блокираторов и монтаж парковки в Алматы — Urban Lock','Монтаж автоматических и механических блокираторов, парковочных замков, шлагбаумов и разметка мест. Выезд и консультация Urban Lock.'),
'contacts.html':('Контакты Urban Lock — парковочные блокираторы, Алматы','Свяжитесь с Urban Lock для подбора парковочного оборудования, консультации и выезда на объект в Алматы. WhatsApp +7 777 412 75 55.')
}
def apply_metadata(text,filename):
    c=config();base=c['siteUrl'].rstrip('/')
    if base and not re.match(r'^https://[^/]+',base):raise ValueError('siteUrl must be the public HTTPS URL')
    title,description=META[filename]
    head_end=text.index('</head>');head=text[:head_end]
    head=re.sub(r'<title>.*?</title>','<title>'+html.escape(title)+'</title>',head,flags=re.S)
    head=re.sub(r'<meta (?:name="(?:description|robots|twitter:[^"]+|google-site-verification)"|property="og:[^"]+")[^>]*>\s*','',head)
    head=re.sub(r'<link rel="canonical"[^>]*>\s*','',head)
    head=re.sub(r'<script type="application/ld\+json">.*?</script>\s*','',head,flags=re.S)
    tags=f'<meta name="description" content="{html.escape(description,quote=True)}">\n<meta name="robots" content="index,follow">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Urban Lock">\n<meta property="og:locale" content="ru_KZ">\n<meta property="og:title" content="{html.escape(title,quote=True)}">\n<meta property="og:description" content="{html.escape(description,quote=True)}">\n<meta name="twitter:card" content="summary_large_image">\n'
    if base:
        url=base+'/'+filename
        tags+=f'<link rel="canonical" href="{html.escape(url,quote=True)}">\n<meta property="og:url" content="{html.escape(url,quote=True)}">\n<meta property="og:image" content="{html.escape(base,quote=True)}/fon.JPG">\n<meta property="og:image:alt" content="Парковочные блокираторы Urban Lock">\n'
    if c['searchConsoleVerification']:
        tags+='<meta name="google-site-verification" content="'+html.escape(c['searchConsoleVerification'],quote=True)+'">\n'
    structured={'@context':'https://schema.org','@type':'LocalBusiness','name':'Urban Lock','telephone':'+'+c['whatsapp'],'areaServed':{'@type':'City','name':'Алматы'}}
    if base:structured['url']=base+'/URBANLOCK.html';structured['image']=base+'/fon.JPG'
    tags+='<script type="application/ld+json">'+json.dumps(structured,ensure_ascii=False).replace('<','\\u003c')+'</script>\n'
    return head+tags+text[head_end:]
def finish():
    shell=(ROOT/'URBANLOCK.html').read_text()
    for section in ['catalog','pricelist','services','contacts']:
        out=shell.replace('id="home" class="section active"','id="home" class="section"')
        out=out.replace(f'id="{section}" class="section"',f'id="{section}" class="section active"')
        (ROOT/f'{section}.html').write_text(out)
    for filename in META:
        p=ROOT/filename
        text=p.read_text()
        if filename != 'URBANLOCK.html': text=remove_other_sections(text,filename.removesuffix('.html'))
        p.write_text(apply_metadata(text,filename))
    base=config()['siteUrl'].rstrip('/')
    robots='User-agent: *\nAllow: /\nDisallow: /.backups/\n'
    if base:
        robots+='Sitemap: '+base+'/sitemap.xml\n'
        (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+html.escape(base+'/'+f)+'</loc></url>' for f in META)+'</urlset>')
    (ROOT/'robots.txt').write_text(robots)

def remove_other_sections(text, keep):
    """Keep one section per published page; retain shared navigation and dialogs."""
    for section in ['home','catalog','pricelist','services','contacts']:
        if section==keep:continue
        match=re.search(r'<div id="'+section+r'" class="section(?: active)?">',text)
        if not match:continue
        depth=0
        for tag in re.finditer(r'</?div\b[^>]*>',text[match.start():]):
            depth+=-1 if tag[0].startswith('</') else 1
            if depth==0:
                text=text[:match.start()]+text[match.start()+tag.end():]
                break
    return text
