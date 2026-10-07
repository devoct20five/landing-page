# Responsive audit — measures overflow, clipped headings and text <12px on 18 pages x 8 device widths.
# Usage: pip install playwright && playwright install chromium
#        npm run build && npm start   (in another terminal)
#        python tools/responsive-audit.py http://localhost:3000 [phone-S|phone|phone-L|tablet|tablet-L|laptop|desktop|fullhd]
import asyncio, json, sys, re
from playwright.async_api import async_playwright
BASE=sys.argv[1]
WIDTHS=[(360,740,'phone-S'),(390,844,'phone'),(430,932,'phone-L'),(768,1024,'tablet'),(1024,768,'tablet-L'),(1280,800,'laptop'),(1440,900,'desktop'),(1920,1080,'fullhd')]
PAGES=['/','/agency','/agency/editing','/agency/design','/agency/3d-ads','/agency/web-dev','/agency/portfolio','/agency/vision','/agency/careers','/agency/behind-the-work','/agency/get-in-touch','/agency/book-a-call','/agency/checkout?service=editing&plan=advance&pack=7','/agency/terms-and-conditions','/publication','/publication/category/design','/publication/why-the-first-three-seconds-decide-everything','/publication/authors/aanya-verma']
JS=r"""
() => {
  const vw = document.documentElement.clientWidth;
  const out = {vw, docW: document.documentElement.scrollWidth, tiny:{}, over:[], clip:[], minBody:null, h1:null, btn:0};
  const vis = (e)=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&parseFloat(cs.opacity)>0.05}
  const sel=(e)=>{let s=e.tagName.toLowerCase(); if(e.id) s+='#'+e.id; const c=(e.className&&e.className.baseVal===undefined?e.className:'').toString().split(/\s+/).filter(Boolean).slice(0,3).join('.'); if(c) s+='.'+c; return s}
  // text nodes: smallest rendered font-size per element that directly owns text
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let n; const seen=new Set();
  while(n=walker.nextNode()){
    const t=n.nodeValue.trim(); if(t.length<2) continue;
    const e=n.parentElement; if(!e||seen.has(e)||!vis(e)) continue; seen.add(e);
    if(e.closest('script,style,noscript')) continue;
    const fs=parseFloat(getComputedStyle(e).fontSize);
    if(fs<12){ const k=fs.toFixed(1); (out.tiny[k]=out.tiny[k]||[]).push(sel(e)+': '+t.slice(0,22)); }
  }
  // horizontal overflow: elements poking past the viewport
  for(const e of document.querySelectorAll('body *')){
    if(!vis(e)) continue; const r=e.getBoundingClientRect();
    if(r.right>vw+2 && r.width<vw*3){
      // ignore things intentionally scrolled/clipped by an ancestor
      let a=e.parentElement, clipped=false;
      while(a&&a!==document.body){const o=getComputedStyle(a); if(/(hidden|auto|scroll|clip)/.test(o.overflowX)){clipped=true;break} a=a.parentElement}
      if(!clipped) out.over.push(sel(e)+' right='+Math.round(r.right));
    }
  }
  // headings that don't fit their own box (a single long word / fixed width)
  for(const e of document.querySelectorAll('h1,h2,h3,h4')){
    if(!vis(e)) continue;
    if(e.scrollWidth>e.clientWidth+2) out.clip.push(sel(e)+' sw='+e.scrollWidth+' cw='+e.clientWidth+' :'+e.innerText.slice(0,24));
  }
  const h1=document.querySelector('h1'); if(h1&&vis(h1)){const cs=getComputedStyle(h1); out.h1=Math.round(parseFloat(cs.fontSize))}
  // body paragraph size
  const ps=[...document.querySelectorAll('main p')].filter(vis).map(p=>parseFloat(getComputedStyle(p).fontSize)); if(ps.length) out.minBody=Math.min(...ps);
  // small tap targets on touch widths
  if(vw<1024){ for(const e of document.querySelectorAll('a,button')){ if(!vis(e)) continue; const r=e.getBoundingClientRect(); if(r.height<36 && r.width>0 && (e.innerText||'').trim().length>0 && !e.closest('p,li,footer nav')) out.btn++; } }
  return out;
}
"""
async def main():
    only=sys.argv[2] if len(sys.argv)>2 else None
    res={}
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h,name in WIDTHS:
            if only and name!=only: continue
            ctx=await b.new_context(viewport={'width':w,'height':h}, has_touch=w<1024)
            await ctx.route("**/*",lambda r: r.abort() if any(x in r.request.url for x in ['unsplash','fontshare']) else r.continue_())
            for path in PAGES:
                pg=await ctx.new_page()
                try:
                    await pg.goto(BASE+path,wait_until='load',timeout=20000); await pg.wait_for_timeout(700)
                    H=await pg.evaluate('document.body.scrollHeight'); y=0
                    while y<H: await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(60); y+=700
                    await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(250)
                    res[f'{name}|{path}']=await pg.evaluate(JS)
                except Exception as e: res[f'{name}|{path}']={'error':str(e)[:80]}
                await pg.close()
            await ctx.close()
        await b.close()
    json.dump(res,open(f'./audit-{only or "all"}.json','w'))
    # ---- summary
    tot={'overflow':0,'clip':0,'tiny':0}
    for k,v in res.items():
        if 'error' in v: print('ERR',k,v['error']); continue
        ov=v['docW']>v['vw']+1 or len(v['over'])>0
        ti=sum(len(x) for x in v['tiny'].values())
        if ov: tot['overflow']+=1
        if v['clip']: tot['clip']+=1
        if ti: tot['tiny']+=1
    print('page×width combos:',len(res),'| with overflow:',tot['overflow'],'| with clipped headings:',tot['clip'],'| with <12px text:',tot['tiny'])
asyncio.run(main())
