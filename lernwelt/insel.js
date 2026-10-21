/* FRS Lernwelten – Inselkarte im Block-Stil.
   INSEL.render(k, {bereiche, counts, mini}) liefert ein SVG.
   Die Insel wird aus Klötzchen gebaut und wächst mit der Klassenstufe (5 klein → 10 groß, mit Hügeln und Nebeninseln). */
(function(){
"use strict";
const S = 14, L = 5, C = 48, R = 30, VW = C*S, VH = R*S + 24;
const NAMES = {5:"Starter Island",6:"Explorer Island",7:"Adventure Island",8:"Discovery Island",9:"Challenge Island",10:"Champion Island"};

function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function shade(hex, f){
  const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255; const t=f<0?0:255, p=Math.abs(f);
  r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b);
  return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Gelände ---------- */
function terrain(k){
  const rand = rng(k*7919 + 13);
  const rx = 10.5 + (k-5)*2.1, ry = Math.min(rx*0.7, 12.6), cx = C/2, cy = R/2 - .5;
  const maxH = k<=6 ? 2 : k<=8 ? 3 : 4;
  const waves = Array.from({length:6}, () => ({fx:.18+rand()*.4, fy:.18+rand()*.4, px:rand()*6.3, py:rand()*6.3, a:.06+rand()*.09}));
  const noise = (x,y) => waves.reduce((s,w)=>s + w.a*Math.sin(x*w.fx+w.px)*Math.cos(y*w.fy+w.py), 0);
  const H = [], D = [];
  const islets = [];
  if(k >= 7){
    const cand = [[5,5,2.3],[C-6,R-5,2.6],[C-6,4,2],[5,R-5,2.2]];
    for(const c of cand){ if(islets.length >= Math.min(3, k-6)) break;
      const d = Math.hypot((c[0]-cx)/rx, (c[1]-cy)/ry); if(d > 1.3) islets.push(c); }
  }
  for(let y=0;y<R;y++){ H.push([]); D.push([]);
    for(let x=0;x<C;x++){
      const d = Math.hypot((x+.5-cx)/rx, (y+.5-cy)/ry) - noise(x,y);
      let h = d < 1 ? 1 : 0;
      for(const [ix,iy,ir] of islets){ const di = Math.hypot(x+.5-ix, (y+.5-iy)*1.3)/ir - noise(x*1.7,y*1.7)*.8; if(di < 1) h = 1; }
      H[y].push(h); D[y].push(d);
    }
  }
  // Höhenstufen folgen der Küste: Abstand zum Wasser bestimmt Strand, Wiese, Hochebene, Hügel
  const dw = H.map(r=>r.map(h=>h?99:0));
  for(let it=0; it<14; it++) for(let y=0;y<R;y++) for(let x=0;x<C;x++){
    if(!dw[y][x]) continue; let m = 99;
    for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const yy=y+dy, xx=x+dx; const v = (yy<0||yy>=R||xx<0||xx>=C) ? 0 : dw[yy][xx]; m = Math.min(m, v+1); }
    dw[y][x] = Math.min(dw[y][x], m);
  }
  for(let y=0;y<R;y++) for(let x=0;x<C;x++){
    const w = dw[y][x]; if(!w) continue;
    let h = w<=1 ? 1 : w<=3 ? 2 : w<=6 ? 3 : 4;
    H[y][x] = Math.min(h, maxH);
  }
  return {H, D, rx, ry, cx, cy, rand, maxH, k};
}
const land = (T,x,y) => y>=0 && y<R && x>=0 && x<C && T.H[y][x] > 0;

/* ---------- Bausteine ---------- */
const box = (x,y,w,h,front,top,dt) => { dt = dt ?? Math.max(3, Math.min(6, w*.3));
  return `<rect x="${x}" y="${y-h}" width="${w}" height="${h}" fill="${front}"/><rect x="${x}" y="${y-h-dt}" width="${w}" height="${dt}" fill="${top}"/>`; };

function tree(x, y, sc, rand){
  const g = ["#3F9B3B","#4FAE45","#3A8F3A"][Math.floor(rand()*3)];
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc.toFixed(2)})">
    ${box(-1.8,0,3.6,6,"#7A4E2A","#9A6638",2)}${box(-7,-6,14,10,shade(g,-.12),shade(g,.18),4)}${box(-4.5,-16,9,6,g,shade(g,.28),3)}</g>`;
}
function rock(x,y,sc){ return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})">${box(-4,0,8,4,"#8C909B","#B8BCC6",2)}</g>`; }
function house(x,y,sc,c){
  return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})">${box(-6,0,12,8,"#EDE3D2","#F8F1E6",2)}
    <polygon points="-7.5,-8 7.5,-8 0,-15" fill="${c}"/><rect x="-1.5" y="-5" width="3" height="5" fill="#6B4A2E"/></g>`;
}
function flower(x,y,c){ return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="2.4" height="2.4" fill="${c}"/>`; }

/* Wahrzeichen der Bereiche (Ursprung: Mitte unten) */
const LM = {
  grammar: () => `
    ${box(-22,0,44,12,"#B7B1C7","#E2DEEA")}
    ${box(-25,0,11,30,"#C3BDD2","#EAE6F1")}${box(14,0,11,30,"#C3BDD2","#EAE6F1")}
    ${box(-8,-12,16,18,"#CAC4D8","#EFEBF5")}
    <polygon points="-26.5,-34 -12.5,-34 -19.5,-47" fill="#3E63DD"/><polygon points="12.5,-34 26.5,-34 19.5,-47" fill="#3E63DD"/>
    <polygon points="-10,-34 10,-34 0,-52" fill="#2F4FC4"/>
    <line x1="0" y1="-52" x2="0" y2="-61" stroke="#2A2540" stroke-width="1.4"/><polygon points="0,-61 10,-58 0,-55" fill="#E0362C"/>
    <rect x="-4" y="-9" width="8" height="9" rx="3" fill="#5A4636"/>
    <rect x="-21.5" y="-24" width="4" height="5" fill="#3B3552"/><rect x="17.5" y="-24" width="4" height="5" fill="#3B3552"/><rect x="-2" y="-24" width="4" height="5" fill="#3B3552"/>`,
  vocabulary: (r) => `
    ${tree(-17,2,.8,r)}${tree(17,1,.85,r)}
    <g>${box(-2.5,-2,5,12,"#7A4E2A","#9A6638",2)}${box(-13,-14,26,14,"#2F8A36","#4FB548",5)}${box(-9,-33,18,11,"#38983C","#5CC452",4)}${box(-5,-48,10,9,"#42A842","#6CD15C",3)}</g>
    ${[["A","#E5484D",-16],["B","#FFC233",-4],["C","#3E63DD",8]].map(([t,c,x])=>`${box(x,8,9,9,c,shade(c,.3),3)}<text x="${x+4.5}" y="5.7" text-anchor="middle" font-size="7.5" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">${t}</text>`).join("")}`,
  reading: () => `
    ${box(-17,0,34,6,"#878B96","#B1B5BF")}
    ${[0,1,2,3].map(i=>{ const w=15-i*1.6, c=i%2?"#FFFFFF":"#E5484D"; return box(-w/2,-6-i*9,w,9,i%2?"#E9EDF3":c,i%2?"#FFFFFF":shade(c,.3),2.5); }).join("")}
    <circle cx="0" cy="-49" r="11" fill="#FFE27A" opacity=".45"/>
    ${box(-5.5,-42,11,7,"#FFD34D","#FFF1B0",2)}
    <polygon points="-7.5,-51 7.5,-51 0,-60" fill="#B3262C"/>
    <g transform="translate(13,-1)"><polygon points="0,0 9,-3 9,-11 0,-8" fill="#FFFFFF" stroke="#2A2540" stroke-width=".8"/><polygon points="0,0 -9,-3 -9,-11 0,-8" fill="#F4F0E6" stroke="#2A2540" stroke-width=".8"/>
      <line x1="2" y1="-5" x2="7" y2="-6.8" stroke="#9AA3AF" stroke-width=".7"/><line x1="-2" y1="-5" x2="-7" y2="-6.8" stroke="#9AA3AF" stroke-width=".7"/></g>`,
  listening: () => `
    ${box(-21,0,42,26,"#6E8F5A","#8FCB6A",5)}
    <rect x="-7" y="-26" width="14" height="26" fill="#7FD3F5"/><rect x="-4" y="-26" width="2.2" height="26" fill="#D3F4FF"/><rect x="2.5" y="-26" width="1.8" height="26" fill="#BFEFFF"/>
    <ellipse cx="0" cy="1" rx="14" ry="3.5" fill="#FFFFFF" opacity=".9"/>
    <text class="bob" x="15" y="-33" font-size="15" fill="#1E1B4B" font-family="system-ui,sans-serif">♪</text>
    <text class="bob b2" x="-22" y="-30" font-size="13" fill="#1E1B4B" font-family="system-ui,sans-serif">♫</text>`,
  writing: () => `
    ${box(-19,0,38,7,"#5FAF41","#86D15A")}
    ${box(-7,-7,14,6,"#F28CB1","#F8B8D0",2)}${box(-7,-13,14,3,"#B9BFC9","#DDE2E8",1.5)}
    <rect x="-7" y="-42" width="14" height="26" fill="#FFC233"/><rect x="-2.6" y="-42" width="1.8" height="26" fill="#E9A81C"/><rect x="2.2" y="-42" width="1.4" height="26" fill="#FFD866"/>
    <polygon points="-7,-42 7,-42 0,-58" fill="#F2C99A"/><polygon points="-2.4,-52.5 2.4,-52.5 0,-58" fill="#3A3A48"/>`,
  speaking: () => `
    ${box(-23,0,46,8,"#A86F3E","#C98B52")}
    ${box(-20,-8,40,24,"#7B2D3F","#9C3B52",3)}
    ${[-16,-8,0,8].map(x=>`<rect x="${x}" y="-32" width="3" height="24" fill="#62233A"/>`).join("")}
    <line x1="10" y1="-8" x2="10" y2="-21" stroke="#2A2540" stroke-width="1.6"/><circle cx="10" cy="-23" r="3" fill="#4A4A58"/>
    <g class="bob"><rect x="-27" y="-60" width="30" height="16" rx="7" fill="#FFFFFF" stroke="#2A2540" stroke-width="1.4"/><polygon points="-12,-44.7 -6,-44.7 -10,-38" fill="#FFFFFF" stroke="#2A2540" stroke-width="1.4" stroke-linejoin="round"/>
    <rect x="-13" y="-46" width="8" height="2.5" fill="#FFFFFF"/><text x="-12" y="-48.5" text-anchor="middle" font-size="9" font-weight="800" fill="#1E1B4B" font-family="system-ui,sans-serif">Hi!</text></g>`,
  country: () => `
    ${box(-24,2,24,5,"#9A6638","#C08850",3)}
    ${[-22,-14,-6].map(x=>`<rect x="${x}" y="2" width="2.5" height="6" fill="#6E4524"/>`).join("")}
    <line x1="-20" y1="-7" x2="-20" y2="-30" stroke="#5C3B1E" stroke-width="1.6"/>
    <polyline points="-20,-28 -12,-24 -4,-28" fill="none" stroke="#2A2540" stroke-width=".7"/>
    <polygon points="-18,-27 -16,-22 -14,-25.6" fill="#E5484D"/><polygon points="-13,-24.3 -11,-19.5 -9,-24.4" fill="#FFC233"/><polygon points="-8,-25.8 -6,-21 -4,-27.5" fill="#3E63DD"/>
    <polygon points="4,-3 34,-3 29,6 9,6" fill="#C8413A"/><rect x="6" y="-6" width="26" height="3" fill="#F4F0E6"/>
    <line x1="19" y1="-6" x2="19" y2="-40" stroke="#5C3B1E" stroke-width="1.8"/>
    <polygon points="20,-37 20,-9 33,-11" fill="#FFFFFF" stroke="#C9CED8" stroke-width=".6"/><polygon points="18,-35 18,-11 8,-13" fill="#F4F0E6" stroke="#C9CED8" stroke-width=".6"/>
    <g transform="translate(19,-46)"><rect width="10" height="6" fill="#012169"/><path d="M0,0 L10,6 M10,0 L0,6" stroke="#fff" stroke-width="1.4"/><path d="M5,0 V6 M0,3 H10" stroke="#fff" stroke-width="2.2"/><path d="M5,0 V6 M0,3 H10" stroke="#C8102E" stroke-width="1.2"/></g>`,
  exam: () => `
    ${box(-28,0,56,10,"#7F8593","#A3A9B5")}${box(-20,-10,40,12,"#8D93A1","#B2B8C3")}${box(-12,-22,24,12,"#9AA0AD","#C3C8D1")}${box(-5,-34,10,8,"#E6EAF0","#FFFFFF",3)}
    <line x1="0" y1="-45" x2="0" y2="-64" stroke="#2A2540" stroke-width="1.6"/><polygon points="0,-64 13,-60 0,-56" fill="#FFC233" stroke="#B57F00" stroke-width=".7"/>
    <text x="5.5" y="-58.3" text-anchor="middle" font-size="5" fill="#8A5A00" font-family="system-ui,sans-serif">★</text>`
};

/* ---------- Karte ---------- */
function render(k, opt){
  opt = opt || {};
  const T = terrain(k), rand = T.rand, out = [];
  const bereiche = opt.bereiche || [], counts = opt.counts || {}, names = opt.names || {};
  // Wasser
  out.push(`<defs>
    <linearGradient id="wg${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#47B2EC"/><stop offset="1" stop-color="#2A8DD5"/></linearGradient>
    <pattern id="gr${k}" width="7" height="7" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="3.5" height="3.5" fill="#fff" opacity=".07"/><rect x="3.5" y="3.5" width="3.5" height="3.5" fill="#000" opacity=".045"/></pattern>
  </defs><rect x="${-VW}" y="${-VH}" width="${VW*3}" height="${VH*3}" fill="#3A9FE0"/><rect width="${VW}" height="${VH}" fill="url(#wg${k})"/>`);
  for(let i=0;i<70;i++){ const x=Math.floor(rand()*C)*S, y=Math.floor(rand()*R)*S; out.push(`<rect x="${x}" y="${y}" width="${S}" height="${S/2}" fill="#fff" opacity="${(.04+rand()*.05).toFixed(3)}"/>`); }
  // flaches Wasser an der Küste
  for(let y=0;y<R;y++) for(let x=0;x<C;x++){
    if(T.H[y][x]) continue;
    let near = 9;
    for(let dy=-2;dy<=2;dy++) for(let dx=-2;dx<=2;dx++) if(land(T,x+dx,y+dy)) near = Math.min(near, Math.max(Math.abs(dx),Math.abs(dy)));
    if(near===1) out.push(`<rect x="${x*S}" y="${y*S}" width="${S}" height="${S}" fill="#CFF3FF"/>`);
    else if(near===2) out.push(`<rect x="${x*S}" y="${y*S}" width="${S}" height="${S}" fill="#8FDCF6" opacity=".7"/>`);
  }
  // Land (zeilenweise von hinten nach vorne)
  const TOP = {1:"#F2D27C", 2:"#7DCB4F", 3:"#69BD45", 4:"#8FD65E"}, SIDE = {1:"#D3AA56", 2:"#9C6C3C", 3:"#8A5D33", 4:"#7C542E"};
  for(let y=0;y<R;y++) for(let x=0;x<C;x++){
    const h = T.H[y][x]; if(!h) continue;
    const j = (rand()-.5)*.1, top = shade(TOP[h], j), ty = y*S - h*L;
    out.push(`<rect x="${x*S}" y="${ty}" width="${S}" height="${S}" fill="${top}"/>`);
    const hb = y+1<R ? T.H[y+1][x] : 0;
    if(h > hb){ const sh = (h-hb)*L + (hb===0 ? 4 : 0); out.push(`<rect x="${x*S}" y="${ty+S}" width="${S}" height="${sh}" fill="${shade(SIDE[h], j*.6)}"/>`); }
    if(h>=2 && rand()<.07) out.push(flower(x*S+3+rand()*8, ty+3+rand()*8, ["#FFFFFF","#FFD23F","#FF7AA2","#B9A8FF"][Math.floor(rand()*4)]));
  }
  out.push(`<rect width="${VW}" height="${VH}" fill="url(#gr${k})" pointer-events="none"/>`);

  // Plätze für die Wahrzeichen: Ring um die Inselmitte, "exam" in der Mitte, "country" an der Küste unten
  const ring = bereiche.filter(b => b!=="exam");
  const sc = Math.max(.72, Math.min(1.15, T.rx/14));
  const spots = {};
  const order = ring.slice().sort((a,b)=>(a==="country")-(b==="country"));   // country zuletzt → unten
  const n = order.length;
  // gleichmäßig im Kreis verteilt; country sitzt unten (π/2), die anderen folgen im Uhrzeigersinn
  order.forEach((b,i)=>{
    const a = b==="country" ? Math.PI/2 : Math.PI/2 + (i+1)*2*Math.PI/n;
    const rr = b==="country" ? .86 : .68;
    const px = T.cx + Math.cos(a)*T.rx*rr, py = T.cy + Math.sin(a)*T.ry*rr*1.12;
    // nächstgelegene passende Landzelle
    let best = null, bd = 1e9;
    for(let y=1;y<R-1;y++) for(let x=1;x<C-1;x++){
      const h = T.H[y][x]; if(!h || (b!=="country" && h<2)) continue;
      const dd = (x+.5-px)**2 + (y+.5-py)**2; if(dd<bd){ bd=dd; best=[x,y]; }
    }
    spots[b] = best;
  });
  if(bereiche.includes("exam")){
    let best=null, bh=-1, bd=1e9;
    for(let y=0;y<R;y++) for(let x=0;x<C;x++){ const h=T.H[y][x], dd=(x-T.cx)**2+(y-T.cy)**2; if(h>bh || (h===bh && dd<bd)){ bh=h; bd=dd; best=[x,y]; } }
    spots.exam = best;
  }
  const P = b => { const [x,y] = spots[b]; return [x*S + S/2, y*S + S - T.H[y][x]*L - 2]; };

  // Weg zwischen den Wahrzeichen
  if(!opt.mini && order.length > 1){
    const pts = order.map(P).sort((a,b)=>Math.atan2(a[1]-T.cy*S,a[0]-T.cx*S)-Math.atan2(b[1]-T.cy*S,b[0]-T.cx*S));
    const d = pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+","+(p[1]+4).toFixed(1)).join("")+"Z";
    out.push(`<path d="${d}" fill="none" stroke="#C9A75A" stroke-width="5.5" stroke-linejoin="round" opacity=".45"/><path d="${d}" fill="none" stroke="#FFF3C9" stroke-width="3" stroke-dasharray="1 7" stroke-linecap="round"/>`);
  }

  // Deko + Wahrzeichen nach Tiefe sortiert
  const objs = [];
  const taken = Object.values(spots).filter(Boolean);
  const free = (x,y,r) => taken.every(([sx,sy]) => Math.hypot(x-sx,(y-sy)*1.4) > r);
  const treeP = opt.mini ? .05 : .045 + (k-5)*.012;
  for(let y=0;y<R;y++) for(let x=0;x<C;x++){
    const h = T.H[y][x]; if(!h) continue;
    const bx = x*S + S/2, by = y*S + S - h*L - 1;
    if(h>=2 && free(x,y,3.6*sc) && rand()<treeP) objs.push([by, tree(bx, by, .75+rand()*.35, rand)]);
    else if(h===1 && free(x,y,3) && rand()<.05) objs.push([by, rock(bx, by, .8+rand()*.5)]);
    else if(k>=8 && h===2 && free(x,y,4) && rand()<.012) objs.push([by, house(bx, by, .9, ["#E5484D","#3E63DD","#E9A81C"][Math.floor(rand()*3)])]);
  }
  const labels = [];
  for(const b of bereiche){
    if(!spots[b]) continue;
    const [x,y] = P(b), s2 = b==="exam" ? sc*1.1 : sc, cnt = counts[b]||0, nm = names[b] || b;
    const aria = `${esc(nm)}: ${cnt} ${cnt===1?"quest":"quests"}`;
    objs.push([y, `<g class="lm${cnt?"":" empty"}" data-kat="${b}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <ellipse cx="0" cy="2" rx="${24*s2}" ry="${5*s2}" fill="#000" opacity=".16"/>
      <g class="lm-art" transform="scale(${s2.toFixed(2)})">${LM[b](rand)}</g></g>`]);
    if(!opt.mini){
      const w = nm.length*5.6 + 26, ls = Math.max(.8, Math.min(.92, s2));
      labels.push(`<g class="lm-lbl${cnt?"":" empty"}" data-kat="${b}" role="button" tabindex="0" aria-label="${aria}" transform="translate(${x.toFixed(1)},${(y+12*s2).toFixed(1)}) scale(${ls.toFixed(2)})">
        <rect x="${-w/2}" y="-9" width="${w}" height="18" rx="9" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="1.6"/>
        <text x="-8" y="4" text-anchor="middle" font-size="10" font-weight="700" fill="#1E1B4B" font-family="Fredoka, Lexend, system-ui, sans-serif">${esc(nm)}</text>
        <circle cx="${w/2-10}" cy="0" r="6.5" fill="${cnt?"#FF5A4E":"#C9D3E0"}"/><text x="${w/2-10}" y="3.3" text-anchor="middle" font-size="8.5" font-weight="800" fill="#fff" font-family="system-ui,sans-serif">${cnt}</text></g>`);
    }
  }
  objs.sort((a,b)=>a[0]-b[0]).forEach(o=>out.push(o[1]));
  out.push(labels.join(""));

  // Wolken
  if(!opt.mini){
    const cl = [[.08,.12],[.78,.08],[.88,.7],[.12,.82],[.5,.04]];
    cl.forEach(([fx,fy],i)=>{ const x=fx*VW, y=fy*VH;
      out.push(`<g class="cloud c${i%3}" transform="translate(${x.toFixed(0)},${y.toFixed(0)})" opacity=".92">${box(-14,0,28,8,"#E4EEF7","#FFFFFF",4)}${box(-6,-8,16,7,"#EAF2FA","#FFFFFF",3)}</g>`); });
  }
  let x0=VW, x1=0, y0=VH, y1=0;
  for(let y=0;y<R;y++) for(let x=0;x<C;x++) if(T.H[y][x]){ x0=Math.min(x0,x*S); x1=Math.max(x1,(x+1)*S); y0=Math.min(y0,y*S); y1=Math.max(y1,(y+1)*S); }
  const AR = VW/(VH+30), mx = 34;
  let vw = Math.max(x1-x0+2*mx, (y1-y0+110)*AR, VW*(opt.mini?.7:.62)); vw = Math.min(vw, VW); const vh = vw/AR;
  let vx = (x0+x1)/2 - vw/2, vy = (y0+y1)/2 - vh/2 - 14;
  vx = Math.max(0, Math.min(VW-vw, vx)); vy = Math.max(-30, Math.min(VH-vh, vy));
  return `<svg class="insel-svg" viewBox="${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="${esc(NAMES[k]||"Island")}">${out.join("")}</svg>`;
}

window.INSEL = { render, NAMES, VW, VH };
})();
