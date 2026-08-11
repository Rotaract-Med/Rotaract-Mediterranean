// The full-page journey, as a browser script string rendered offline into a
// JPEG sequence (see render-journey.js).
//
// The ENTIRE home page is this one sequence: document scroll position maps
// straight onto journey progress p (0..1). Every visual is a pure function of
// p, so consecutive frames differ by a couple of pixels — which is what makes
// scroll-scrubbing read as video rather than as a slideshow.
//
// Beats (matching the page's chapters):
//   0.00 dawn above the sea      0.44 medLOVE current (pink)
//   0.10 breaking the surface    0.56 medNATURE current (green)
//   0.20 blue descent            0.66 medCULTURE current (cyan)
//   0.34 abyss + ruins           0.78 gold (the awards)
//                                0.90 ascent, breach, daylight

module.exports = `
const c = document.getElementById('c');
const ctx = c.getContext('2d');
const W = c.width, H = c.height;

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);
const band=(p,at,w)=>clamp(1-Math.abs(p-at)/w,0,1);
function mix(a,b,t){return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}
function rgb(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+(a===undefined?1:a)+')';}

// Water column keyed to the brand palette, extended through the three
// initiative currents and the awards gold.
const STOPS = [
  { p:0.00, top:[250,214,160], bot:[120,170,225], light:1.00 },  // dawn sky over water
  { p:0.09, top:[150,200,240], bot:[36,86,190],   light:1.00 },  // at the surface
  { p:0.20, top:[46,104,200],  bot:[19,55,140],   light:0.85 },  // just under
  { p:0.30, top:[22,66,150],   bot:[12,40,104],   light:0.58 },  // descending
  { p:0.40, top:[10,32,80],    bot:[6,16,46],     light:0.24 },  // abyss
  { p:0.46, top:[9,24,60],     bot:[5,12,36],     light:0.16 },  // deepest
  { p:0.53, top:[92,20,64],    bot:[36,8,30],     light:0.34 },  // medLOVE
  { p:0.62, top:[10,78,66],    bot:[5,32,30],     light:0.36 },  // medNATURE
  { p:0.71, top:[14,70,110],   bot:[6,30,58],     light:0.40 },  // medCULTURE
  { p:0.80, top:[150,112,30],  bot:[60,40,14],    light:0.72 },  // awards gold
  { p:0.90, top:[40,104,190],  bot:[16,48,120],   light:0.78 },  // ascending
  { p:1.00, top:[236,246,255], bot:[46,110,205],  light:1.00 }   // breach, daylight
];

function waterAt(p){
  let i=0; while(i<STOPS.length-2 && p>STOPS[i+1].p) i++;
  const a=STOPS[i], b=STOPS[i+1];
  const t=smooth(clamp((p-a.p)/(b.p-a.p||1),0,1));
  return { top:mix(a.top,b.top,t), bot:mix(a.bot,b.bot,t), light:lerp(a.light,b.light,t) };
}

// Depth curve: 0 at both ends, 1 through the middle of the journey.
function depthAt(p){ return smooth(clamp(band(p,0.5,0.5),0,1)); }

const LAYERS=[{n:110,depth:0.25,r:[0.5,1.5],a:0.09},{n:80,depth:0.55,r:[0.9,2.4],a:0.15},{n:46,depth:1.0,r:[1.6,4.2],a:0.20}];
const FIELD=LAYERS.map((L,li)=>{const rnd=mulberry(9871+li*733);return Array.from({length:L.n},()=>({x:rnd(),y:rnd(),r:lerp(L.r[0],L.r[1],rnd()),ph:rnd()*Math.PI*2,sp:0.5+rnd()}));});

// ---- sky + horizon, only near the very start and very end -----------------
function sky(p){
  const vis=Math.max(band(p,0.0,0.11), band(p,1.0,0.10));
  if(vis<=0) return;
  const rise=p<0.5 ? p/0.11 : (1-p)/0.10;
  const horizon=H*(0.52+clamp(rise,0,1)*0.55);
  ctx.save();
  ctx.globalAlpha=vis;
  const g=ctx.createLinearGradient(0,0,0,horizon);
  if(p<0.5){ g.addColorStop(0,'rgb(38,58,120)'); g.addColorStop(0.55,'rgb(216,138,96)'); g.addColorStop(1,'rgb(252,206,150)'); }
  else { g.addColorStop(0,'rgb(120,175,235)'); g.addColorStop(1,'rgb(232,246,255)'); }
  ctx.fillStyle=g; ctx.fillRect(0,0,W,horizon);
  // sun on the horizon
  const sx=W*0.66, sy=horizon-H*0.06, r=H*0.075;
  const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,r*4);
  sg.addColorStop(0,'rgba(255,246,214,0.95)');
  sg.addColorStop(0.22,'rgba(255,206,140,0.55)');
  sg.addColorStop(1,'rgba(255,190,120,0)');
  ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,sy,r*4,0,Math.PI*2); ctx.fill();
  // glitter path on the water below the horizon
  const rnd=mulberry(3311);
  for(let i=0;i<160;i++){
    const gy=horizon+rnd()*(H-horizon);
    const spread=(gy-horizon)/(H-horizon||1);
    const gx=sx+(rnd()-0.5)*W*0.10*(1+spread*7);
    ctx.fillStyle='rgba(255,238,200,'+(0.30*(1-spread)).toFixed(3)+')';
    ctx.fillRect(gx, gy, lerp(4,26,rnd()), 1.4);
  }
  ctx.restore();
}

function sun(p, light){
  const d=depthAt(p);
  if(light<=0.18 || d>0.86) return;
  const y=-H*0.10+(1-d)*H*0.26;
  const x=W*0.62+Math.sin(p*4)*W*0.04;
  const r=H*(0.36-d*0.14);
  ctx.save(); ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,'rgba(255,252,235,'+(0.5*light).toFixed(3)+')');
  g.addColorStop(0.25,'rgba(210,238,255,'+(0.2*light).toFixed(3)+')');
  g.addColorStop(1,'rgba(150,205,255,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H); ctx.restore();
}

function surface(p, light){
  const d=depthAt(p);
  const y=-H*0.18+(1-d)*H*0.40;
  if(y>H*0.85 || d>0.95) return;
  ctx.save(); ctx.globalCompositeOperation='screen';
  const bandH=H*0.30*(1-d*0.6);
  const g=ctx.createLinearGradient(0,y-bandH,0,y+bandH);
  g.addColorStop(0,'rgba(238,250,255,'+(0.5*light).toFixed(3)+')');
  g.addColorStop(0.5,'rgba(170,215,255,'+(0.20*light).toFixed(3)+')');
  g.addColorStop(1,'rgba(120,180,240,0)');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.moveTo(0,y+bandH);
  for(let x=0;x<=W;x+=8){
    ctx.lineTo(x, y+Math.sin(x*0.008+p*22)*10+Math.sin(x*0.021-p*31)*6+Math.sin(x*0.004+p*12)*16);
  }
  ctx.lineTo(W,y+bandH); ctx.closePath(); ctx.fill(); ctx.restore();
}

function godRays(p, light){
  if(light<=0.03) return;
  const rnd=mulberry(4242);
  const oy=-H*0.35-p*H*0.15;
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let i=0;i<16;i++){
    const bx=rnd()*W, spread=lerp(60,280,rnd()), sway=Math.sin(p*14+i)*46;
    const a=light*lerp(0.018,0.07,rnd());
    const g=ctx.createLinearGradient(bx,oy,bx+sway,H);
    g.addColorStop(0,'rgba(225,242,255,'+a.toFixed(4)+')');
    g.addColorStop(0.55,'rgba(180,220,255,'+(a*0.45).toFixed(4)+')');
    g.addColorStop(1,'rgba(140,200,255,0)');
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(bx-spread*0.12,oy); ctx.lineTo(bx+spread*0.12,oy);
    ctx.lineTo(bx+sway+spread,H); ctx.lineTo(bx+sway-spread,H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function caustics(p, light){
  if(light<=0.06) return;
  ctx.save(); ctx.globalCompositeOperation='screen';
  ctx.globalAlpha=light*0.14; ctx.lineWidth=1.4;
  for(let i=0;i<26;i++){
    const yb=(i/26)*H+Math.sin(p*10+i)*24;
    ctx.strokeStyle='rgba(195,232,255,'+(0.5-i/60).toFixed(3)+')';
    ctx.beginPath();
    for(let x=0;x<=W;x+=14){
      const y=yb+Math.sin(x*0.012+p*18+i*0.6)*9+Math.sin(x*0.03-p*11)*4;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function particles(p){
  ctx.save();
  for(let li=0;li<LAYERS.length;li++){
    const L=LAYERS[li];
    for(const s of FIELD[li]){
      let y=(s.y-p*L.depth*3.4)%1; if(y<0)y+=1;
      const x=(s.x+Math.sin(p*7*s.sp+s.ph)*0.012)%1;
      const tw=0.6+0.4*Math.sin(p*46*s.sp+s.ph);
      ctx.fillStyle='rgba(214,235,255,'+(L.a*tw).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(x*W,y*H,s.r*(0.6+L.depth*0.8),0,Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

// Submerged Greco-Roman ruins at the deepest point — the origin-story beat.
function ruins(p){
  const vis=band(p,0.425,0.075);
  if(vis<=0) return;
  const rnd=mulberry(77713);
  ctx.save(); ctx.globalAlpha=vis;
  const sy=H*0.78+(1-vis)*H*0.22;
  const sg=ctx.createLinearGradient(0,sy-H*0.12,0,H);
  sg.addColorStop(0,'rgba(16,28,58,0)'); sg.addColorStop(1,'rgba(20,32,64,0.95)');
  ctx.fillStyle=sg; ctx.fillRect(0,sy-H*0.12,W,H);
  for(let i=0;i<8;i++){
    const cx=(i+0.5)/8*W+(rnd()-0.5)*W*0.07;
    const hgt=H*lerp(0.14,0.34,rnd()), wid=W*lerp(0.026,0.045,rnd());
    const base=sy+H*0.03*rnd();
    ctx.fillStyle='rgba(3,8,22,0.95)';
    ctx.fillRect(cx-wid/2, base-hgt, wid, hgt);
    ctx.fillRect(cx-wid*0.8, base-hgt-wid*0.28, wid*1.6, wid*0.28);
    ctx.fillStyle='rgba(120,160,220,0.05)';
    ctx.fillRect(cx-wid/2, base-hgt, wid*0.16, hgt);
  }
  ctx.restore();
}

// Coloured current: a drifting veil of the active initiative's colour.
function currents(p){
  const beats=[[0.53,[233,30,99]],[0.62,[16,185,129]],[0.71,[56,189,248]]];
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(const [at,col] of beats){
    const v=band(p,at,0.075); if(v<=0) continue;
    for(let i=0;i<5;i++){
      const yy=((i/5)+p*1.8+at)%1;
      const g=ctx.createLinearGradient(0,yy*H-H*0.25,0,yy*H+H*0.25);
      g.addColorStop(0,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
      g.addColorStop(0.5,'rgba('+col[0]+','+col[1]+','+col[2]+','+(v*0.10).toFixed(3)+')');
      g.addColorStop(1,'rgba('+col[0]+','+col[1]+','+col[2]+',0)');
      ctx.fillStyle=g; ctx.fillRect(0,yy*H-H*0.25,W,H*0.5);
    }
  }
  ctx.restore();
}

// Gold motes: the awards beat.
function motes(p){
  const v=Math.max(band(p,0.45,0.10), band(p,0.80,0.09));
  if(v<=0) return;
  const rnd=mulberry(20130213);
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let i=0;i<90;i++){
    const bx=rnd(), by=rnd(), r=0.6+rnd()*2.4, sp=0.4+rnd();
    let y=(by-p*sp*1.1)%1; if(y<0)y+=1;
    const tw=0.5+0.5*Math.sin(p*60*sp+i);
    ctx.fillStyle='rgba(255,215,0,'+(v*0.55*tw).toFixed(3)+')';
    ctx.beginPath(); ctx.arc(bx*W,y*H,r,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function bubbles(p){
  const v=band(p,0.93,0.09);
  if(v<=0) return;
  const rnd=mulberry(5150);
  ctx.save(); ctx.globalCompositeOperation='screen';
  for(let s=0;s<8;s++){
    const bx=rnd(), n=12+Math.floor(rnd()*12);
    for(let i=0;i<n;i++){
      const off=rnd();
      let y=(1.15-((p-0.86)*4.0+off*1.1))%1.3; if(y<0)y+=1.3;
      if(y>1) continue;
      const r=lerp(1.2,5,rnd())*(0.6+y*0.7);
      ctx.fillStyle='rgba(226,244,255,'+(v*0.38).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(bx*W+Math.sin(y*14+s*2)*W*0.012, y*H, r, 0, Math.PI*2); ctx.fill();
    }
  }
  ctx.restore();
}

// Optional AI plates, cross-dissolved beneath the procedural lighting.
window.__plates = [];
function plates(p){
  const list=window.__plates; if(!list.length) return;
  const n=list.length, seg=1/(n-1);
  for(let i=0;i<n;i++){
    const d=Math.abs(p-i*seg)/seg; if(d>=1) continue;
    const img=list[i]; if(!img||!img.complete) continue;
    const a=smooth(1-d)*0.8;
    const local=clamp((p-(i*seg-seg))/(2*seg),0,1);
    const z=lerp(1.0,1.14,smooth(local));
    const base=Math.max(W/img.naturalWidth,H/img.naturalHeight)*z;
    const w=img.naturalWidth*base,h=img.naturalHeight*base;
    ctx.save(); ctx.globalAlpha=a;
    ctx.drawImage(img,(W-w)/2,(H-h)/2-lerp(0,H*0.05,smooth(local)),w,h);
    ctx.restore();
  }
}

window.__renderFrame = (p) => {
  const wat=waterAt(p);
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,rgb(wat.top)); g.addColorStop(1,rgb(wat.bot));
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  plates(p);
  sky(p);
  sun(p, wat.light);
  surface(p, wat.light);
  godRays(p, wat.light);
  caustics(p, wat.light);
  ruins(p);
  currents(p);
  particles(p);
  motes(p);
  bubbles(p);

  const v=ctx.createRadialGradient(W/2,H*0.45,H*0.2,W/2,H*0.5,H*0.95);
  v.addColorStop(0,'rgba(0,0,0,0)');
  v.addColorStop(1,'rgba(2,8,26,'+(0.30+(1-wat.light)*0.35).toFixed(3)+')');
  ctx.fillStyle=v; ctx.fillRect(0,0,W,H);
};
`;
