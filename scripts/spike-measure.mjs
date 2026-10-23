import { chromium } from 'playwright-core';
import { readdirSync } from 'fs';
const base='/opt/pw-browsers/'; const dir=readdirSync(base).find(d=>d.startsWith('chromium')&&!d.includes('headless'));
const exe = base+'chromium'; 
let path; try{ path=exe }catch{}
const b = await chromium.launch({ executablePath: (await import('fs')).existsSync(exe)&&!(await import('fs')).statSync(exe).isDirectory()?exe:`${base}${dir}/chrome-linux/chrome` });
const url='http://localhost:4399/spike/x-hero';
async function run(label, opts, nojs=false, revisit=false){
  const ctx = await b.newContext({ viewport:{width:opts.w||390,height:800}, reducedMotion:opts.rm?'reduce':'no-preference', javaScriptEnabled:!nojs });
  const page = await ctx.newPage();
  await page.addInitScript(()=>{window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true})});
  await page.goto(url); 
  const state0 = nojs? 'n/a' : await page.evaluate(()=>document.documentElement.dataset.intro);
  if(revisit){ await page.reload(); }
  const s1 = nojs?'n/a':await page.evaluate(()=>document.documentElement.dataset.intro);
  await page.waitForTimeout(1800);
  const s2 = nojs?'n/a':await page.evaluate(()=>document.documentElement.dataset.intro);
  const cls = nojs?'n/a':await page.evaluate(()=>window.__cls);
  const h1 = await page.evaluate(()=>{const e=document.getElementById('h1');const c=getComputedStyle(e);return {op:c.opacity,w:e.getBoundingClientRect().width, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth}});
  console.log(label,{state0,s1,s2,cls,h1});
  if(!nojs&&opts.shot) await page.screenshot({path:`/tmp/claude-0/-home-claude/92dfd034-2d24-5b0d-9875-b73f26239d3e/scratchpad/${label}.png`});
  await ctx.close();
}
await run('first-390',{shot:1});
await run('first-1440',{w:1440,shot:1});
await run('repeat',{}, false, true);
await run('reduced',{rm:1});
await run('nojs',{}, true);
await run('narrow-900',{w:900,shot:1});
await b.close();
