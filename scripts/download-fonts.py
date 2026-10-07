"""Descarga fuentes oficiales y licencias para distribución local reproducible."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, re, urllib.request, urllib.parse
root = Path(__file__).resolve().parent.parent
folder = root / 'public/fonts'
def download(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}),timeout=40).read()
def process(name):
    slug = name.lower().replace(' ', '-')
    css=[]
    family={'Syne ExtraBold':'Syne','Geist Sans':'Geist','Zen Kaku Gothic New':'Zen Kaku Gothic New'}.get(name,name)
    weight='800' if name=='Syne ExtraBold' else '400'
    raw=download('https://fonts.googleapis.com/css2?family='+urllib.parse.quote(family+':wght@'+weight)+'&display=swap').decode()
    blocks=re.findall(r'/\* ([^*]+) \*/\s*(@font-face\s*\{[^}]+\})',raw)
    if not blocks: blocks=[('latin',raw)]
    for subset,block in blocks:
        if subset.strip() not in ['latin','latin-ext']:continue
        urls=re.findall(r'url\((https://[^)]+)\)',block)
        for idx,url in enumerate(urls):
            filename=slug+'-'+subset.strip()+str(idx)+Path(urllib.parse.urlparse(url).path).suffix
            (folder/filename).write_bytes(download(url));block=block.replace(url,'./'+filename)
        block=block.replace("'"+family+"'","'"+name+"'")
        css.append(block)
    license_slug=family.lower().replace(' ','')
    license_text=download('https://raw.githubusercontent.com/google/fonts/main/ofl/'+license_slug+'/OFL.txt').decode()
    (folder/(slug+'-LICENSE.txt')).write_text('\n'.join(line.rstrip() for line in license_text.splitlines())+'\n')
    if not css:raise RuntimeError('Sin fuente latina '+name)
    (folder/(slug+'.css')).write_text('\n'.join(css))
    return name,'\n'.join(css)
names=json.loads((root/'scripts/font-families.json').read_text())
results=[]
with ThreadPoolExecutor(max_workers=6) as pool:
    for name,css in pool.map(process,names):results.append(css);print(name,flush=True)
(folder/'fonts.css').write_text('\n'.join(results))
print('Fuentes locales:',len(results))
