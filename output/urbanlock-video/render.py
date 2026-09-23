from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

ROOT=Path(__file__).resolve().parent
W,H=720,1280
FPS=24
YELLOW=(255,199,30)
FONT='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG='/System/Library/Fonts/Supplemental/Arial.ttf'
def font(n,b=True): return ImageFont.truetype(FONT if b else REG,n)
def smooth(x):
    x=max(0,min(1,x)); return x*x*(3-2*x)
def txt(draw,xy,s,size=46,color='white',bold=True):
    draw.text(xy,s,font=font(size,bold),fill=color,stroke_width=0)
def scene(im,t):
    # Animate the camera while retaining all four parking bays.
    z=1+0.024*math.sin(t/20*math.pi)
    sw,sh=round(720*z),round(1080*z)
    im=im.resize((sw,sh),Image.Resampling.LANCZOS)
    im=im.crop(((sw-720)//2,(sh-1080)//2,(sw+720)//2,(sh+1080)//2))
    canvas=Image.new('RGB',(W,H),(12,16,20));canvas.paste(im,(0,100))
    return canvas
def shade(im):
    overlay=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(overlay)
    for y in range(100,480):
        a=int(205*(1-(y-100)/380)**1.4)
        d.line((0,y,W,y),fill=(7,12,18,a))
    return Image.alpha_composite(im.convert('RGBA'),overlay)
before=Image.open(ROOT/'before.png').convert('RGB')
after=Image.open(ROOT/'after.png').convert('RGB')
product=Image.open(ROOT.parent.parent/'assets/pl101-11.jpg').convert('RGB')
frames=ROOT/'frames';frames.mkdir(exist_ok=True)
for i in range(480):
    t=i/FPS
    a=scene(before,t); b=scene(after,t)
    if t<6.5: im=a
    elif t<8.5:
        p=smooth((t-6.5)/2); x=int(W*p)
        im=a.copy();im.paste(b.crop((0,0,x,H)),(0,0))
        d=ImageDraw.Draw(im);d.rectangle((x-2,100,x+2,1180),fill=YELLOW)
    else: im=b
    im=shade(im)
    d=ImageDraw.Draw(im)
    txt(d,(38,34),'URBANLOCK',28,YELLOW)
    txt(d,(465,40),'ПАРКОВКА ЖК',17,(190,195,200),False)
    if t<3.3:
        txt(d,(38,156),'Ваше место',51)
        txt(d,(38,218),'снова занято?',51)
        label='БЕЗ ЗАЩИТЫ МЕСТА'
    elif t<6.5:
        txt(d,(38,156),'Чужие машины.',49)
        txt(d,(38,216),'Мусор. Хаос.',49)
        label='ДВОР, В КОТОРЫЙ НЕ ХОЧЕТСЯ ВОЗВРАЩАТЬСЯ'
    elif t<8.5:
        txt(d,(38,156),'Время перемен.',48)
        label='ДО  /  ПОСЛЕ'
    elif t<12:
        txt(d,(38,156),'Порядок начинается',43)
        txt(d,(38,212),'с вашего места.',48)
        label='БЛОКИРАТОРЫ URBANLOCK'
    else:
        txt(d,(38,156),'Ваше место.',53)
        txt(d,(38,220),'Под защитой.',53,YELLOW)
        label='УХОЖЕННЫЙ ДВОР. ЗАЩИЩЁННАЯ ПАРКОВКА.'
    txt(d,(38,1214),label,18,(221,224,226),False)
    if t>=15:
        end=Image.new('RGB',(W,H),(10,13,16))
        prod=product.resize((672,840),Image.Resampling.LANCZOS)
        end.paste(prod,(24,270))
        e=ImageDraw.Draw(end)
        txt(e,(38,57),'URBANLOCK',60,YELLOW)
        txt(e,(40,143),'Ваше место — только ваше.',34)
        txt(e,(40,203),'Блокираторы парковочных мест',25,(180,185,190),False)
        e.rounded_rectangle((38,1120,682,1198),radius=18,fill=YELLOW)
        text='ПОРЯДОК НАЧИНАЕТСЯ ЗДЕСЬ'
        e.text((W//2,1159),text,font=font(26),fill=(12,16,20),anchor='mm')
        txt(e,(40,1230),'URBANLOCK  /  ПАРКОВКА ПОД КОНТРОЛЕМ',17,(152,160,165),False)
        im=Image.blend(im.convert('RGB'),end,smooth((t-15)/0.8))
    im.convert('RGB').save(frames/f'{i:04d}.jpg',quality=93)
    if i in (48,120,180,250,330,440):
        im.convert('RGB').save(ROOT/f'check-{i:04d}.jpg',quality=92)
    if i%96==0: print(f'Rendered {i}/480',flush=True)
print('Frames ready',flush=True)
