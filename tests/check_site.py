from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from build_support import META,config,sync_prices,apply_metadata
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=[];self.refs=[];self.meta=[];self.handlers=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='meta':self.meta.append(a)
  if 'onclick' in a:self.handlers.append(a['onclick'])
  if tag in ['img','script','link']:
   ref=a.get('src') or a.get('href')
   if ref and not urlsplit(ref).scheme:self.refs.append(unquote(ref))
for name in META:
 text=(root/name).read_text();p=Page();p.feed(text)
 assert len(p.ids)==len(set(p.ids)),name+' duplicate id'
 assert len([x for x in p.meta if x.get('name')=='description'])==1,name+' description'
 assert len([x for x in p.meta if x.get('property')=='og:title'])==1,name+' og:title'
 for ref in p.refs:assert (root/ref).is_file(),name+' missing '+ref
 assert all('5 лет' not in chunk for chunk in re.findall(r'<div class="catalog-card".*?(?=<div class="catalog-card"|$)',text,re.S))
 if name!='URBANLOCK.html':assert text.count('<h1')==1,name+' multiple h1'
text=(root/'URBANLOCK.html').read_text()
old=(root/'.backups/URBANLOCK-before-interactive.html').read_text()
pat=r'    <!-- ABOUT COMPANY -->.*?(?=    <!-- FAQ -->)'
assert re.search(pat,text,re.S)[0]==re.search(pat,old,re.S)[0],'About changed'
assert sync_prices(text)==text,'Prices not synchronized'
for cls in ['catalog-card-price','price-retail']:
 assert len(re.findall('class="'+cls+'"',text))==8
assert all(str(value) in (root/'site-config.js').read_text() for value in config()['prices'].values())
assert 'fon.JPG' in (root/'improvements.css').read_text()
print('PASS: 9 pages, unique IDs, metadata, local assets, synchronized prices, unchanged company section.')
