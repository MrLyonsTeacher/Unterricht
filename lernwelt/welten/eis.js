// Klasse 10 · Ice Region – Frostpalast in einer Halle aus riesigen Eissäulen: spitze Türme, Spitzbögen, Eiszapfen, leuchtendes Tor; Frostfüchse und ein Eisbär laufen herum
import { polarBear, frostFox } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, terrain, tex, P, noise, stripes, bricks, rings, topEdge } = A;
  const T = {
    snow: noise(["#F4F8FF","#EAF2FC","#FFFFFF","#E2ECF8"], 6, ["#D4E2F2"]), snowSide: topEdge(["#9AB8D4","#8AAAC8","#A8C4DC"], ["#F4F8FF","#EAF2FC"], 5),
    frost: noise(["#9AB8D4","#8AAAC8","#A8C4DC","#7E9EBE"], 8, ["#C8DCEE"]),
    floorIce: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.5+y*.9)+rand()*.4; P(g,x,y, (x===0||y===0) ? "#6AA8D8" : v>1.2?"#E6F8FF":v>.2?"#A8D8F4":"#8AC4EC"); } }),
    iceBrick: bricks(["#BCDDF2","#AED4EE","#C8E4F6","#B4D8F0"], "#5A8ABE", 4, 8),
    iceTrim: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<2||y>13 ? "#2E6AA8" : (x+y)%7===0 ? "#8AD0F4" : pick(["#4A8AC8","#5A9AD4","#3E7EBE"])); }),
    carved: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=x<1||y<1||x>14||y>14, i=x>3&&x<12&&y>3&&y<12; P(g,x,y, e?"#7AAAD0":i?(Math.abs(x-7.5)+Math.abs(y-7.5)<4?"#F0FAFF":"#B8DCF2"):"#D8EEFA"); } }),
    pillar: tex(g=>{ for(let x=0;x<16;x++){ const c=pick(["#3A8AD8","#4AA0E6","#2A70C0","#5AB8F0","#6ACCF8"]); for(let y=0;y<16;y++) P(g,x,y, rand()<.03 ? "#E6FAFF" : (x%5===2 ? "#9AE6FF" : c)); } }),
    pillarTop: rings(["#BFF2FF","#6ACCF8","#3A8AD8","#2A70C0"]),
    spire: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, x%4===0 ? "#E8F8FF" : pick(["#A8DAF6","#9ACEF0","#B8E4FA"])); }),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<2||x>13||y>14||x===7||x===8||(y<6 && Math.abs(x-7.5)>y*1.3+1); P(g,x,y, fr ? "#2A5A98" : pick(["#8AF0FF","#6AE0FF","#BFF8FF"])); } }),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.1 ? "#FFFFFF" : v<.4?"#DFFCFF":v<.75?"#9AEEFF":"#5AD4FF"); } }),
    dark: noise(["#1E3E6A","#24487A","#1A365E"], 6, ["#3A6AA0"]),
    icicle: noise(["#DFF8FF","#BFEFFF","#FFFFFF"], 0), crystal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#E6FFFF":d<3?"#7FE6FF":"#3AB4F0"); } }),
    violet: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#F2E6FF":d<3?"#C8A0FF":"#9A6AF0"); } }),
    lamp: noise(["#DFFCFF","#BFF4FF","#FFFFFF"]), silver: noise(["#E8F0F8","#D0DCE8","#F4F8FC"])
  };
  const blocks = {
    snow:{side:T.snowSide, top:T.snow, bottom:T.frost}, snowB:{side:T.snow}, frost:{side:T.frost}, floorIce:{side:T.frost, top:T.floorIce, em:.08},
    iceBrick:{side:T.iceBrick}, iceTrim:{side:T.iceTrim}, carved:{side:T.carved, top:T.iceBrick}, pillar:{side:T.pillar, top:T.pillarTop, em:.38},
    spire:{side:T.spire, top:T.snow}, win:{side:T.win, em:.9}, door:{side:T.door, em:.7}, dark:{side:T.dark},
    icicle:{side:T.icicle, alpha:.85, em:.35}, crystal:{side:T.crystal, em:1.0}, violet:{side:T.violet, em:1.0}, lamp:{side:T.lamp, em:1.3}, silver:{side:T.silver}
  };
  const W=92, D=72, G=5;  // G: Boden
  // Boden: Schnee, eisiger Weg zum Tor, Schneewehen an den Rändern, hinten Eisklippen
  terrain(W, D, (x,z)=> { let h = G + Math.max(0, fbm(x*.1,z*.1)-.62)*10; h += Math.max(0, 6-z)*6*(.6+fbm(x*.1,3)); h += Math.max(0, Math.max(3-x, x-(W-4)))*4; return h; },
    (x,y,z,h) => y===h-1 ? ((Math.abs(x-46)<=6 && z>36 && h<=G+1) ? "floorIce" : "snow") : (y>h-3 ? "snowB" : "frost"));

  // ---------- Bausteine ----------
  // spitzes Türmchen (Fiale): schmaler Kegel mit heller Spitze
  const pinnacle = (x,y,z,h,r=1) => { for(let i=0;i<h;i++){ const rr=r*(1-i/h); if(rr>=.5) disk(x,y+i,z,rr,"spire"); else set(x,y+i,z,"spire"); } set(x,y+h,z,"icicle"); set(x,y+h+1,z,"lamp"); };
  // Turm mit spitzem Helm, Spitzbogenfenstern, Zinnenkranz
  const spireTower = (x,y,z,r,h,roof) => { cyl(x,y,z,r,h,(a,b,c)=> ((b-y)%6>=2 && (b-y)%6<=4 && Math.abs(((Math.atan2(c-z,a-x)+Math.PI)*8/Math.PI)%2-1)<.5) ? "win" : ((b-y)%6===0 ? "iceTrim" : "iceBrick"));
    ring(x,y+h,z,r+1,"carved"); for(let i=0;i<10;i++){ const an=i/10*Math.PI*2; pinnacle(Math.round(x+Math.cos(an)*(r+1)),y+h+1,Math.round(z+Math.sin(an)*(r+1)),3,.6); }
    cone(x,y+h+1,z,r+.4,roof,(a,b,c)=> (b-y-h)%5===0 ? "iceTrim" : "spire"); pinnacle(x,y+h+roof,z,4,.6); };
  // Spitzbogen-Öffnung in einer Wand, die nach +z zeigt
  const gothic = (x,y,z,w,h,fillT) => { const hw=w/2; for(let a=-Math.floor(hw);a<=Math.floor(hw);a++) for(let b=0;b<h+w;b++){ const top = h + (hw-Math.abs(a))*1.6; if(b<top){ set(x+a,y+b,z,fillT); } } };
  // Eiszapfen
  const icicles = (x0,x1,y,z0,z1,maxL) => { for(let x=x0;x<=x1;x++) for(let z=z0;z<=z1;z++){ if(rand()<.45){ const l=1+Math.floor(rand()*maxL); for(let k=1;k<=l;k++) if(!get(x,y-k,z)) set(x,y-k,z,"icicle"); } } };
  // riesige Eissäule mit Sockel, Kapitell, Schnee und Eiszapfen
  const bigPillar = (x,z,r,h) => { const y0=topAt(x,z,40)+1; cyl(x,y0,z,r+1.5,3,"carved"); ring(x,y0+3,z,r+1,"iceTrim");
    for(let y=y0+3;y<y0+h;y++){ const rr = r + (y%14===0 ? .8 : 0); disk(x,y,z,rr,"pillar"); }
    for(const k of [Math.round(h*.55), h]){ const cy=y0+k; cyl(x,cy,z,r+2,2,"carved"); ring(x,cy+2,z,r+2.6,"iceTrim"); disk(x,cy+3,z,r+2.4,"snowB"); for(let i=0;i<14;i++){ const an=i/14*Math.PI*2, ix=Math.round(x+Math.cos(an)*(r+2.6)), iz=Math.round(z+Math.sin(an)*(r+2.6)); const l=2+Math.floor(rand()*5); for(let q=1;q<=l;q++) set(ix,cy+1-q,iz,"icicle"); } }
    return y0+h+3; };

  const S = {
    grammar:   {x:46, z:22, col:0x7FE6FF, ort:"Frost Palace"},
    vocabulary:{x:18, z:50, col:0xC8A0FF, ort:"Crystal Chapel"},
    country:   {x:74, z:52, col:0xBFF4FF, ort:"Ice Garden"}
  };

  // ---------- Grammar: Frostpalast ----------
  { const x=46, z=22, y=G;
    // Terrasse mit Bogengang vorne und Treppe
    fill(x-22,y,z-12,x+22,y+4,z+14,"iceBrick"); fill(x-22,y+4,z-12,x+22,y+4,z+14,"carved");
    for(let a=-21;a<=21;a+=4){ if(Math.abs(a)<6) continue; gothic(x+a,y,z+14,2,2,"dark"); set(x+a,y+4,z+15,"iceTrim"); }
    for(let a=-22;a<=22;a++) if(a%2===0) set(x+a,y+5,z+14,"carved");
    for(let s=0;s<6;s++) fill(x-6,y+s-1,z+20-s,x+6,y+s-1,z+20-s,"carved"); for(let s=0;s<6;s++){ set(x-7,y+s,z+20-s,"iceTrim"); set(x+7,y+s,z+20-s,"iceTrim"); }
    for(const a of [-7,7]){ fill(x+a,y,z+21,x+a,y+3,z+21,"carved"); set(x+a,y+4,z+21,"lamp"); }
    // Untergeschoss mit Spitzbogenfenstern
    const b=y+5; walls(x-18,b,z-8,x+18,b+12,z+10,(a,yy,c)=> (yy===b+12 ? "iceTrim" : "iceBrick")); fill(x-17,b,z-7,x+17,b+11,z+9,"iceBrick");
    for(let a=-15;a<=15;a+=5){ if(Math.abs(a)<5) continue; gothic(x+a,b+3,z+10,2,4,"win"); fill(x+a-2,b+1,z+11,x+a+2,b+1,z+11,"carved"); }
    // großes Tor mit Spitzgiebel
    fill(x-6,b,z+11,x+6,b+15,z+12,"iceBrick"); gothic(x,b,z+12,6,8,"door"); gothic(x,b,z+11,6,8,"door");
    for(let i=0;i<10;i++){ const w=7-i*.7; fill(Math.round(x-w),b+15+i,z+11,Math.round(x+w),b+15+i,z+12, i%3===0?"iceTrim":"spire"); }
    pinnacle(x,b+25,z+12,7,.8); pinnacle(x-7,b+15,z+12,6,.8); pinnacle(x+7,b+15,z+12,6,.8);
    gothic(x,b+16,z+13,2,2,"win");
    icicles(x-18,x+18,b+12,z+11,z+11,4); icicles(x-6,x+6,b+15,z+13,z+13,3);
    // Mittelgeschoss mit Ecktürmchen
    const m=b+13; fill(x-12,m,z-6,x+12,m+11,z+6,"iceBrick"); for(let a=-10;a<=10;a+=4) gothic(x+a,m+3,z+7,2,4,"win"); fill(x-13,m+11,z-7,x+13,m+11,z+7,"iceTrim");
    for(let a=-13;a<=13;a+=2) set(x+a,m+12,z+7,"carved");
    for(const [a,c] of [[-12,-6],[12,-6],[-12,6],[12,6]]){ cyl(x+a,m,z+c,1.6,14,"iceBrick"); pinnacle(x+a,m+14,z+c,9,1.6); }
    icicles(x-13,x+13,m+11,z+7,z+7,3);
    // Hauptturm mit hohem Helm und Fialenkranz
    const t=m+12; fill(x-6,t,z-4,x+6,t+12,z+4,"iceBrick"); for(const a of [-3,3]) gothic(x+a,t+3,z+5,2,5,"win"); gothic(x,t+2,z+5,2,7,"win");
    for(const [a,c] of [[-6,-4],[6,-4],[-6,4],[6,4]]) pinnacle(x+a,t+12,z+c,7,1.2);
    for(let i=0;i<24;i++){ const w=5.6*(1-i/24); fill(Math.round(x-w),t+13+i,Math.round(z-w*.8),Math.round(x+w),t+13+i,Math.round(z+w*.8), i%4===0?"iceTrim":"spire"); }
    pinnacle(x,t+37,z,6,.6);
    // Seitentürme
    spireTower(x-19,b,z-2,3.2,22,16); spireTower(x+19,b,z-2,3.2,22,16);
    spireTower(x-25,y,z+6,2.4,16,12); spireTower(x+25,y,z+6,2.4,16,12);
    spireTower(x-10,m,z-9,2.2,14,12); spireTower(x+10,m,z-9,2.2,14,12);
    // Fialen auf den Dachkanten
    for(let a=-17;a<=17;a+=5) pinnacle(x+a,b+13,z-8,4,.6);
    for(let a=-16;a<=16;a+=4){ if(Math.abs(a)<8) continue; pinnacle(x+a,b+13,z+10,5,.7); }
    for(let a=-9;a<=9;a+=6) pinnacle(x+a,m+12,z+7,4,.6);
    for(const a of [-22,-14,14,22]) pinnacle(x+a,y+5,z+14,4,.6);
    for(const [a,c] of [[-18,-8],[18,-8],[-18,10],[18,10]]) pinnacle(x+a,b+13,z+c,8,1.2);
    S.grammar.top=[x, t+8, z+6]; S.grammar.base=y+20; S.grammar.cam={dist:72, up:.12, lookY:y+26, side:0}; }

  // ---------- Riesige Eissäulen und Bögen (wie eine Halle) ----------
  const cols = [[6,12],[86,12],[6,40],[86,40],[2,66],[90,66],[20,30],[72,30]];
  const colTops = cols.map(([x,z],i)=> bigPillar(x,z, i>=6 ? 2.6 : 3.4, i>=6 ? 46 : 62));
  // Spitzbögen zwischen den Säulen entlang jeder Seite
  for(const side of [[0,2,4],[1,3,5]]) for(let k=0;k<2;k++){ const [x0,z0]=cols[side[k]], [x1,z1]=cols[side[k+1]], y=G+52;
    for(let i=0;i<=40;i++){ const f=i/40, x=x0+(x1-x0)*f, z=z0+(z1-z0)*f, yy = y + Math.round((1-Math.abs(f-.5)*2)**.6*14); fill(Math.round(x)-1,yy,Math.round(z),Math.round(x)+1,yy+1,Math.round(z),"carved"); if(i%3===0) for(let q=1;q<=1+Math.floor(rand()*4);q++) set(Math.round(x),yy-q,Math.round(z),"icicle"); } }

  // ---------- Vocabulary: Kristallkapelle links ----------
  { const {x,z} = S.vocabulary, y=G;
    fill(x-6,y,z-5,x+6,y,z+5,"carved"); walls(x-5,y+1,z-4,x+5,y+9,z+4,(a,b,c)=> b===y+9 ? "iceTrim" : "iceBrick"); fill(x-4,y+1,z-3,x+4,y+8,z+3,null);
    gothic(x,y+1,z+4,2,4,"door"); for(const a of [-3,3]) gothic(x+a,y+3,z+4,0,3,"win"); for(const c of [-2,2]){ gothic(x-5,y+3,z+c,0,4,"win"); gothic(x+5,y+3,z+c,0,4,"win"); }
    for(let i=0;i<8;i++){ const w=6-i*.75; fill(x-5,y+10+i,Math.round(z-w),x+5,y+10+i,Math.round(z+w), i%3===0?"iceTrim":"spire"); }
    pinnacle(x,y+18,z+4,5,.8); pinnacle(x,y+17,z,10,1.4);
    for(const [a,c] of [[-5,-4],[5,-4],[-5,4],[5,4]]) pinnacle(x+a,y+10,z+c,6,.8);
    for(const [cx,cz,t] of [[x-8,z+6,"crystal"],[x+8,z+7,"violet"],[x-9,z-2,"violet"],[x+9,z-3,"crystal"],[x-3,z+9,"crystal"],[x+4,z+9,"violet"]]) for(let k=0;k<3+Math.floor(rand()*4);k++) set(cx+(k%2),y+k,cz+(k===2?1:0),t);
    icicles(x-5,x+5,y+9,z+5,z+5,2);
    S.vocabulary.top=[x, y+24, z]; S.vocabulary.base=y+8; S.vocabulary.cam={pos:[40,26,86], look:[28,13,44]}; }

  // ---------- Country & people: Eisgarten mit gefrorenem Brunnen und Eisfiguren ----------
  { const {x,z} = S.country, y=G;
    disk(x,y-1,z,9,"floorIce"); ring(x,y,z,9,(a,b,c)=>((a+c)%3===0?"carved":null));
    ring(x,y,z,3.4,"carved"); ring(x,y+1,z,3.4,"iceTrim"); disk(x,y,z,2.4,"floorIce"); cyl(x,y,z,1,6,"pillar"); disk(x,y+6,z,2.2,"carved"); ring(x,y+7,z,2.2,"iceTrim");
    cyl(x,y+7,z,.6,4,"pillar"); disk(x,y+11,z,1.2,"carved"); set(x,y+12,z,"lamp"); icicles(x-2,x+2,y+6,z-2,z+2,3);
    // Eisfiguren: Schwan, Stern, Kristallbaum
    { const sx=x-6, sz=z-5; ellip(sx,y+2,sz,2,1.2,1.2,"icicle"); line(sx+1,y+3,sz,sx+2,y+6,sz,"icicle"); set(sx+3,y+6,sz,"icicle"); fill(sx-1,y,sz-1,sx+1,y,sz+1,"carved"); }
    { const sx=x+6, sz=z-5; fill(sx-1,y,sz-1,sx+1,y,sz+1,"carved"); fill(sx,y+1,sz,sx,y+7,sz,"pillar"); for(const [a,b] of [[-2,4],[2,4],[-1,6],[1,6],[-2,2],[2,2]]) line(sx,y+b,sz,sx+a,y+b+2,sz,"crystal"); set(sx,y+8,sz,"lamp"); }
    for(const [lx,lz] of [[x-8,z+4],[x+8,z+4],[x,z-9],[x-6,z+8],[x+6,z+8]]){ fill(lx,y,lz,lx,y+3,lz,"silver"); set(lx,y+4,lz,"lamp"); }
    S.country.top=[x, y+16, z]; S.country.base=y+5; S.country.cam={pos:[56,24,86], look:[84,10,57]}; }

  // Schneehaufen, Kristalle, Eisspitzen auf dem Platz
  const busy = (x,z) => (x>20 && x<72 && z<42) || Math.hypot(x-S.vocabulary.x,z-S.vocabulary.z)<11 || Math.hypot(x-S.country.x,z-S.country.z)<11 || Math.abs(x-46)<8 || cols.some(([cx,cz])=>Math.hypot(cx-x,cz-z)<6);
  for(let i=0;i<70;i++){ const x=3+Math.floor(rand()*(W-6)), z=8+Math.floor(rand()*(D-9)); if(busy(x,z)) continue; const t=topAt(x,z,40)+1;
    const r=rand(); if(r<.35) ellip(x,t-1,z,1.5+rand()*1.5,1.2,1.5+rand(),"snowB"); else if(r<.6){ const h=3+Math.floor(rand()*6); for(let k=0;k<h;k++) disk(x,t+k,z,Math.max(0,(h-k)*.25),"icicle"); } else if(r<.75) set(x,t,z, rand()<.5?"crystal":"violet"); else if(r<.85){ fill(x,t,z,x,t+3,z,"silver"); set(x,t+4,z,"lamp"); } }

  // ---------- Landschaft bis zum Horizont: Eisklippen, weitere Säulenreihen, ferne Spitztürme ----------
  const F = A.far; F.cell = 3;
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const fh = (x,z) => { let h = G + fbm(x*.04,z*.04)*4; if(z<0) h += Math.min(90, -z*.9)*(.6+.6*fbm(x*.03,z*.03)); h += Math.max(0, away(x,z)-30)*.5*(.6+fbm(x*.05,z*.05)); return h; };
  A.farTerrain({ x0:-120, x1:W+120, z0:-130, z1:D+50, base:0, skip:(x,z)=> (x>-1 && x<W+1 && z>-1 && z<D+1) || (fh(x,z)<G+3 && away(x,z)<40),
    h: fh, top:(x,z,y,hc)=> y*3 > 40 ? (rand()<.5?"snowB":"frost") : "snowB", fill:(x,z,y,hc)=> rand()<.04 ? "crystal" : "frost" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  // Säulenreihen setzen sich in der Ferne fort
  for(const px of [-26,-58,W+26,W+58]) for(let pz=-40; pz<=D+40; pz+=28){ const b=fh(px,pz); for(let y=b;y<b+80;y+=3) for(const [a,c] of [[0,0],[3,0],[0,3],[3,3]]) fset(px+a,y,pz+c,"pillar"); for(const [a,c] of [[-3,0],[6,0],[0,-3],[0,6]]) fset(px+a,b+50,pz+c,"carved"); }
  // ferne Spitztürme hinter dem Palast
  for(const [tx,tz,hh] of [[20,-40,60],[72,-44,70],[46,-70,90],[-10,-80,70],[104,-84,76],[0,-30,40],[92,-28,46]]){ const b=fh(tx,tz); for(let y=b;y<b+hh;y+=3) fset(tx,y,tz, (y/3|0)%5===2 ? "win" : "iceBrick"); for(let k=0;k<6;k++) fset(tx,b+hh+k*3,tz,"spire"); fset(tx,b+hh+18,tz,"lamp"); }

  // Frostfüchse und Eisbär laufen herum
  const creatures = [
    { ...frostFox({walk:true, speed:10}), orbit:{c:[46,G,52], r:[14,7], speed:.32, ph:0, bob:.15}, scale:.55 },
    { ...frostFox({walk:true, speed:10, col:0xF4FAFF}), orbit:{c:[46,G,52], r:[14,7], speed:.32, ph:.5, bob:.15}, scale:.5 },
    { ...frostFox({walk:true, speed:9}), orbit:{c:[30,G,40], r:[9,5], speed:.28, ph:2, bob:.15, dir:-1}, scale:.5 },
    { ...frostFox({walk:true, speed:11, col:0xDCEEFF}), orbit:{c:[62,G,60], r:[10,6], speed:.35, ph:4, bob:.15, dir:-1}, scale:.5 },
    { ...frostFox({walk:false}), at:[S.vocabulary.x+7, G, S.vocabulary.z+7], yaw:-.6, scale:.5 },
    { ...polarBear({walk:true, speed:3.2}), orbit:{c:[S.country.x,G,S.country.z], r:[13,12], speed:.09, ph:1, bob:.08}, scale:.8 }
  ];
  return {
    W, D, blocks, spots:S, exposure:.95, fov:42, creatures,
    sky:[[0,"#1E4A8A"],[.4,"#4A80C0"],[.75,"#8AB8E4"],[1,"#BCD8F0"]], fog:[0x7EA6D2, 80, 290],
    hemi:[0xCFE6FF, 0x22406E, 1.05], sun:{color:0xEAF6FF, int:1.25, pos:[-40,90,70]}, bloom:[.35,.45,.85],
    lights:[{pos:[46,G+12,40], color:0x7FE6FF, int:200, dist:34},
            {pos:[S.vocabulary.x,G+5,S.vocabulary.z+6], color:0xC8A0FF, int:180, dist:22},
            {pos:[S.country.x,G+8,S.country.z], color:0xBFF4FF, int:180, dist:24}],
    rays:{n:16, color:0xFFFFFF, area:[16,76,0,40], y:60, len:100},
    particles:[{n:800, area:[-30,W+30,0,80,-30,D+30], vy:-2.2, wob:1.2, color:0xFFFFFF, size:.24, opacity:.9},
               {n:260, area:[0,W,4,50,0,D], vy:0, wob:.25, color:0xBFF8FF, size:.14, add:true, twinkle:true},
               {n:160, area:[30,62,G+14,G+40,24,36], vy:.6, wob:.4, color:0x9AF0FF, size:.22, add:true, twinkle:true}],
    puffs:[{n:18, pos:[-40,G+2,10], dx:170, dy:2, dz:20, s0:20, s1:18, color:0xD8E8F8, opacity:.3, speed:.01, spread:50, flat:.35},
           {n:12, pos:[10,50,-40], dx:70, dy:20, dz:0, s0:30, s1:30, color:0xFFFFFF, opacity:.45, speed:.008, spread:40, flat:.7}],
    home:{pos:[W/2,34,D+62], look:[W/2,30,D/2-14]}, homePortrait:{pos:[W/2,40,D+116], look:[W/2,34,D/2-14]},
    ui:{bg:"rgba(10,30,62,.86)", border:"#8AE6FF", glow:"rgba(138,230,255,.55)", text:"#EAF6FF", sub:"#A8C8E6", accent:"#8AE6FF", "accent-ink":"#06182E", chip:"rgba(8,26,54,.8)"}
  };
}
