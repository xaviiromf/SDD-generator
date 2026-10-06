"""Descarga fuentes oficiales y licencias para distribución local reproducible."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import io, json, re, urllib.request, urllib.parse, zipfile
root = Path(__file__).resolve().parent.parent
folder = root / 'public/fonts'
share = {'Cabinet Grotesk','Satoshi','Clash Display','General Sans','Switzer','Bespoke Serif'}
def download(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
def process(name):
    slug = name.lower().replace(' ', '-')
    css=[]
    if name in share:
        z=zipfile.ZipFile(io.BytesIO(download('https://api.fontshare.com/v2/fonts/download/'+slug)))
        fonts=[p for p in z.namelist() if p.endswith('-Variable.woff2') and '/WEB/' in p]
        if not fonts: fonts=[p for p in z.namelist() if p.endswith('-Regular.woff2') and '/WEB/' in p]
        data=z.read(fonts[0]); filename=slug+'.woff2'; (folder/filename).write_bytes(data)
        css.append(f"@font-face{{font-family:'{name}';src:url('./{filename}') format('woff2');font-weight:100 900;font-display:swap;}}")
        licenses=[p for p in z.namelist() if re.search('licen[sc]e|ofl|eula',p,re.I) and not p.endswith('/')]
        if not licenses: raise RuntimeError('Sin licencia '+name)
        for i,path in enumerate(licenses): (folder/(slug+'-LICENSE'+str(i)+Path(path).suffix)).write_bytes(z.read(path))
    else:
        family='Syne' if name=='Syne ExtraBold' else name
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
            if name=='Syne ExtraBold':block=block.replace("'Syne'","'Syne ExtraBold'")
            css.append(block)
        license_slug=family.lower().replace(' ','')
        (folder/(slug+'-LICENSE.txt')).write_bytes(download('https://raw.githubusercontent.com/google/fonts/main/ofl/'+license_slug+'/OFL.txt'))
    if not css:raise RuntimeError('Sin fuente latina '+name)
    return name,'\n'.join(css)
names=json.loads((root/'scripts/font-families.json').read_text())
results=[]
with ThreadPoolExecutor(max_workers=6) as pool:
    for name,css in pool.map(process,names):results.append(css);print(name,flush=True)
(folder/'fonts.css').write_text('\n'.join(results))
print('Fuentes locales:',len(results))
