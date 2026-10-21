// Klasse 10 · Ice World – Frostburg, Kristallhöhlen und Polarhafen unter Polarlichtern
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, cone, line, topAt, terrain, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT } = A;
  const T = {
    snow: noise(["#F4F8FF","#EAF2FC","#FFFFFF","#E2ECF8"], 6, ["#D4E2F2"]), snowSide: topEdge(["#8A96A8","#7C889A","#96A2B4"], ["#F4F8FF","#EAF2FC"], 5),
    rock: noise(["#8A96A8","#7C889A","#96A2B4","#6E7A8C"], 6, ["#A8B4C4"]),
    ice: noise(["#A8E0FF","#BFE8FF","#96D4F8","#CFEFFF"], 8, ["#FFFFFF"]), packed: noise(["#7AB8F0","#8AC4F6","#6AA8E4","#9ACEF8"], 6, ["#CFEFFF"]),
    ibrick: bricks(["#BFE4FA","#AED8F4","#CCEAFC"], "#7AA8D0"), ipillar: stripes(["#D2ECFC","#BFE2F8","#E2F4FF"], true),
    glow: noise(["#8AF0FF","#5AD8FF","#BFF8FF"], 6, ["#FFFFFF"]), crystal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#E6FFFF":d<3?"#7FE6FF":"#3AB4F0"); } }),
    violet: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#F2E6FF":d<3?"#C8A0FF":"#9A6AF0"); } }),
    water: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.6+y*.4)+rand()*.6; P(g,x,y, v>1.1?"#6AA8D8":v>.2?"#2A5E90":"#1E4A78"); } }),
    planks: planks(["#7A5A3E","#8A684A","#6E5034"], "#4A3624"), frost: planks(["#A8B4C0","#B8C4D0","#98A4B0"], "#7A8696"),
    lamp: noise(["#FFE6A8","#FFD27A","#FFF2CC"]), woolR: noise(["#C83A3A","#D84A4A","#B82E2E"]), fur: noise(["#FAFAF4","#F0F0E8","#FFFFFF"]), black: noise(["#1A1E26","#22262E"]),
    orange: noise(["#FF9A2A","#FFAA40"]), pine: noise(["#2E5A4A","#365E50","#264E40"], 10, ["#F4F8FF","#EAF2FC"]), log: stripes(["#5A4230","#4E3828","#664A36"], true)
  };
  const blocks = {
    snow:{side:T.snowSide, top:T.snow, bottom:T.rock}, snowB:{side:T.snow}, rock:{side:T.rock}, ice:{side:T.ice, alpha:.82}, packed:{side:T.packed},
    ibrick:{side:T.ibrick}, ipillar:{side:T.ipillar, top:T.ice}, glow:{side:T.glow, em:1.1}, crystal:{side:T.crystal, em:1.0}, violet:{side:T.violet, em:1.0},
    water:{side:T.water, alpha:.9, anim:[.02,.01]}, planks:{side:T.planks}, frost:{side:T.frost}, lamp:{side:T.lamp, em:1.2}, woolR:{side:T.woolR},
    fur:{side:T.fur}, black:{side:T.black}, orange:{side:T.orange}, pine:{side:T.pine}, log:{side:T.log}
  };
  const W=90, D=68, SEA=4;
  const S = {
    grammar:   {x:45, z:20, r:12, col:0x7FE6FF, ort:"Frost Castle"},
    vocabulary:{x:15, z:40, r:8,  col:0xC8A0FF, ort:"Crystal Caves"},
    country:   {x:69, z:45, r:10, col:0xFFC24A, ort:"Polar Harbour"}
  };
  const near = (x,z,r) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);
  // Gelände: Berge hinten, Bucht rechts vorne (gefrorenes Meer)
  const H = (x,z) => { let h = 7 + fbm(x*.08,z*.08)*4 + Math.max(0,14-z)*1.6*(.6+fbm(x*.2,1)) + Math.max(0,10-x)*1.2;
    const bay = Math.hypot((x-78)/18,(z-58)/16); if(bay<1) h = Math.min(h, SEA-1 + bay*4); return h; };
  terrain(W, D, H, (x,y,z,h) => y===h-1 ? (h<=SEA ? "packed" : "snow") : (y>h-3 ? "snowB" : "rock"));
  for(let z=0;z<D;z++) for(let x=0;x<W;x++){ const t=topAt(x,z,60); if(t<SEA){ for(let y=t+1;y<SEA;y++) set(x,y,z,"water"); set(x,SEA,z, rand()<.82?"ice":"water"); } }
  for(const s of Object.values(S)){ s.y = Math.max(SEA+1, Math.round(H(s.x,s.z))); for(let z=s.z-s.r; z<=s.z+s.r; z++) for(let x=s.x-s.r; x<=s.x+s.r; x++) if(Math.hypot(x-s.x,z-s.z)<=s.r){ const t=topAt(x,z,60); for(let y=s.y;y<=t;y++) set(x,y,z,null); for(let y=Math.max(0,t+1);y<s.y;y++) set(x,y,z,"snowB"); set(x,s.y-1,z,"snow"); } }

  // Grammar: Frostburg mit Eisspitzen
  { const {x,y,z} = S.grammar;
    const spire = (sx,sz,r,h,ch) => { cyl(sx,y,sz,r,h,"ibrick"); for(let hh=4;hh<h;hh+=5){ set(sx+Math.round(r),y+hh,sz,"glow"); set(sx-Math.round(r),y+hh,sz,"glow"); set(sx,y+hh,sz+Math.round(r),"glow"); }
      ring(sx,y+h,sz,r+.8,"ipillar"); cone(sx,y+h+1,sz,r+.4,ch,"ice"); set(sx,y+h+ch+1,sz,"crystal"); set(sx,y+h+ch+2,sz,"crystal"); };
    walls(x-10,y,z-6,x+10,y+7,z+6,(a,b,c)=> b===y+7 ? ((a+c)%2?"ipillar":null) : b===y+3 && (a+c)%4===0 ? "glow" : "ibrick");
    fill(x-2,y,z+6,x+2,y+4,z+6,null); fill(x-3,y+5,z+6,x+3,y+5,z+6,"crystal"); fill(x-2,y,z+5,x+2,y+3,z+5,"glow");
    fill(x-5,y,z-5,x+5,y+16,z+1,"ibrick"); for(let hh=3;hh<=14;hh+=4) for(let a=-4;a<=4;a+=2) set(x+a,y+hh,z+2,"glow");
    for(let i=0;i<7;i++){ const w=6-i*.8; if(w<.5) break; fill(Math.round(x-w),y+17+i,Math.round(z-2-w),Math.round(x+w),y+17+i,Math.round(z-2+w),"packed"); }
    spire(x,z-2,2.2,26,12);
    for(const [a,b] of [[-10,-6],[10,-6],[-10,6],[10,6]]) spire(x+a,z+b,2.2,13,8);
    // Eisstufen und Kristalle
    for(let s=0;s<5;s++) fill(x-2,y-1,z+7+s,x+2,y-1,z+7+s,"packed");
    for(const [a,b] of [[-13,2],[13,2],[-6,10],[6,10]]){ line(x+a,y,z+b,x+a+(a>0?1:-1),y+5,z+b,"crystal"); line(x+a,y,z+b,x+a,y+3,z+b+1,"crystal"); }
    S.grammar.top=[x-12,y+21,z+6]; S.grammar.base=y+10; S.grammar.cam={dist:56, up:.32, lookY:y+14}; }

  // Vocabulary: Kristallhöhle im Schneehügel
  { const {x,y,z} = S.vocabulary;
    dome(x-2,y,z-3,8,"rock"); dome(x-2,y,z-3,6.6,null);
    for(let a=-8;a<=8;a++) for(let c=-8;c<=8;c++){ const t=topAt(x-2+a,z-3+c,y+12); if(t>=y && !get(x-2+a,t+1,z-3+c) && Math.hypot(a,c)<8.5) set(x-2+a,t+1,z-3+c,"snowB"); }
    // Eingang zur Kamera hin
    for(let a=-5;a<=5;a++) for(let hh=0;hh<=6;hh++) if(Math.hypot(a*.85,hh)<5.4) for(let c=0;c<=10;c++) set(x-2+a,y+hh,z-3+c,null);
    for(const [cx,cz,t] of [[x-5,z-5,"crystal"],[x+1,z-6,"violet"],[x-3,z-1,"violet"],[x+2,z-2,"crystal"],[x-6,z-1,"crystal"]]) for(let k=0;k<3+Math.floor(rand()*3);k++) set(cx+(k%2),y+k,cz,t);
    for(const a of [-6,6]){ for(let k=0;k<9;k++) disk(x-2+a,y+k,z+5,Math.max(0,1.1-k*.16),k%3?"crystal":"violet"); }
    for(let a=-4;a<=4;a+=2) set(x-2+a,y+6,z+5,"ice");
    for(const [cx,cz] of [[x+5,z+4],[x-8,z+5],[x+6,z-1]]) for(let k=0;k<3;k++) set(cx,y+k,cz, k%2?"violet":"crystal");
    S.vocabulary.top=[x-2,y+10,z]; S.vocabulary.base=y+5; S.vocabulary.cam={dist:34, up:.26, lookY:y+4}; }

  // Country & people: Polarhafen mit eingefrorenem Schiff und Iglus
  { const {x,y,z} = S.country;
    const igloo = (ix,iz,r) => { dome(ix,y,iz,r,"snowB",true); for(let c=0;c<3;c++) fill(ix-1,y,iz+r-1+c,ix+1,y+1,iz+r-1+c,c===2?"snowB":null); fill(ix-1,y,iz+r+1,ix+1,y+2,iz+r+1,"snowB"); fill(ix,y,iz+r+1,ix,y+1,iz+r+1,null); set(ix,y,iz,"lamp"); };
    igloo(x-5,z-4,3.4); igloo(x+1,z-6,2.6);
    // Steg ins Eis
    for(let a=0;a<12;a++) fill(x+2+a,y-1,z+2,x+2+a,y-1,z+3,"planks");
    // eingefrorenes Schiff
    const sx=x+8, sy=SEA, sz=z+9;
    for(let a=-8;a<=8;a++){ const r=Math.round(3*Math.sqrt(Math.max(0,1-(a/9)**2))); for(let b=-r;b<=r;b++) for(let hh=0;hh<=3;hh++) if(Math.abs(b)===r || hh===0) set(sx+a,sy+hh,sz+b,"frost"); }
    for(let a=-6;a<=6;a++) fill(sx+a,sy+3,sz-2,sx+a,sy+3,sz+2,"frost");
    fill(sx,sy+4,sz,sx,sy+16,sz,"log"); fill(sx,sy+12,sz-4,sx,sy+15,sz+4,"fur"); fill(sx-5,sy+4,sz,sx-5,sy+11,sz,"log"); fill(sx-5,sy+9,sz-3,sx-5,sy+11,sz+3,"fur");
    for(let a=-8;a<=8;a+=4) set(sx+a,sy+4,sz-3,"ice"); set(sx+8,sy+4,sz,"woolR");
    // Pinguine
    const peng = (px,pz) => { set(px,y,pz,"black"); set(px,y+1,pz,"black"); set(px,y+2,pz,"black"); set(px,y,pz+1,"fur"); set(px,y+1,pz+1,"fur"); set(px,y+2,pz+1,"orange"); };
    peng(x-1,z+3); peng(x+1,z+4); peng(x-3,z+5);
    // Laternen und Fischloch
    for(const [lx,lz] of [[x-8,z+2],[x+3,z-1],[x+13,z+1]]){ fill(lx,y,lz,lx,y+3,lz,"log"); set(lx,y+4,lz,"lamp"); }
    S.country.top=[x+2,y+14,z+2]; S.country.base=y+6; S.country.cam={dist:46, up:.45, side:-.15}; }

  // Tannen, Eisspitzen, Felsen
  const corridor = (x,z) => Object.values(S).some(s=> z>s.z && Math.abs(x-s.x) < 8 + (z-s.z)*.35);
  for(let i=0;i<120;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D); if(near(x,z,3) || corridor(x,z)) continue; const t=topAt(x,z,60)+1; if(t<=SEA+1) continue;
    const r=rand(); if(r<.5){ const h=5+Math.floor(rand()*6); fill(x,t,z,x,t+1,z,"log"); for(let k=0;k<h;k++) disk(x,t+2+k,z,Math.max(0,(h-k)*.42),"pine"); set(x,t+2+h,z,"snowB"); }
    else if(r<.7){ const h=3+Math.floor(rand()*5); for(let k=0;k<h;k++) disk(x,t+k,z,Math.max(0,(h-k)*.3),"ice"); }
    else if(r<.8) set(x,t,z, rand()<.5?"crystal":"violet");
    else ball(x,t,z,1.4,"snowB"); }
  // Eisschollen im Meer
  for(let i=0;i<10;i++){ const x=62+Math.floor(rand()*28), z=52+Math.floor(rand()*16); if(topAt(x,z,20)<=SEA) disk(x,SEA+1,z,1+rand()*2,"snowB"); }

  return {
    W, D, blocks, spots:S, exposure:1.15, fov:40,
    sky:[[0,"#030818"],[.45,"#0C1E44"],[.8,"#1E4A78"],[1,"#5A8AB8"]], fog:[0x14284A, 80, 200],
    hemi:[0xBFE0FF, 0x2A3A5A, 1.5], sun:{color:0xCFE6FF, int:1.4, pos:[-40,80,70]}, bloom:[.5,.5,.82],
    lights:[{pos:[S.grammar.x,S.grammar.y+10,S.grammar.z+8], color:0x7FE6FF, int:300, dist:36},
            {pos:[S.vocabulary.x-2,S.vocabulary.y+3,S.vocabulary.z-1], color:0xC8A0FF, int:240, dist:20},
            {pos:[S.country.x,S.country.y+3,S.country.z], color:0xFFD27A, int:180, dist:24, flicker:true}],
    ribbons:[{w:180, h:22, pos:[W/2,46,-12], rot:[.1,0,0], color:0x4AF0A0, opacity:.32}, {w:160, h:16, pos:[W/2-10,52,-22], rot:[.1,.2,0], color:0x8A6AF0, opacity:.26},
             {w:140, h:12, pos:[W/2+20,42,-6], rot:[.1,-.15,0], color:0x5AE6FF, opacity:.22}],
    particles:[{n:700, area:[-10,W+10,0,60,-10,D+20], vy:-2.4, wob:1.2, color:0xFFFFFF, size:.22, opacity:.9},
               {n:200, area:[0,W,4,40,0,D], vy:0, wob:.2, color:0xBFF8FF, size:.12, add:true, twinkle:true}],
    home:{pos:[W/2,44,D+50], look:[W/2,12,D/2-8]}, homePortrait:{pos:[W/2,58,D+96], look:[W/2,12,D/2-8]},
    ui:{bg:"rgba(10,26,54,.88)", border:"#8AE6FF", glow:"rgba(138,230,255,.5)", text:"#EAF6FF", sub:"#A8C8E6", accent:"#8AE6FF", "accent-ink":"#06182E", chip:"rgba(8,22,46,.82)"}
  };
}
