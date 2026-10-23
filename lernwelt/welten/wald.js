// Klasse 9 · Woodlands – Elbenstadt in Riesenbäumen: Baumhäuser auf Plattformen, Hängebrücken, Wasserfälle, Mondbrunnen, Nebel und Glühwürmchen
import { unicorn, bird } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, terrain, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT } = A;
  const T = {
    grass: noise(["#3E7E3A","#46883F","#367132","#52964A"], 10, ["#6CB058"]), grassSide: topEdge(["#5A4630","#4E3C28","#664E36"], ["#3E7E3A","#46883F"], 4),
    dirt: noise(["#5A4630","#4E3C28","#664E36"]), stone: noise(["#7A8278","#6C746A","#868E84"], 8, ["#5E6E50"]), moss: noise(["#4E6A3E","#5A7646","#445E36","#6A7268"]),
    bark: tex(g=>{ for(let x=0;x<16;x++){ const c=pick(["#5A4230","#4E3828","#664A36","#5E4632"]); for(let y=0;y<16;y++) P(g,x,y, rand()<.12?"#3A2A1C":(x%5===0?"#46321F":c)); } for(let i=0;i<6;i++) P(g,Math.floor(rand()*16),Math.floor(rand()*16),"#6E8A4A"); }),
    barkTop: rings(["#9A7A52","#866844","#6E5436"]),
    leaves: noise(["#2E6E36","#367E3E","#286434","#3E8A44"], 14, ["#5CAA58","#1E5028"]), leaves2: noise(["#4A8A3A","#56984A","#3E7A34"], 10, ["#7ABA5A"]),
    leafRoof: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const vein = x===7||x===8||Math.abs((y-2)-Math.abs(x-7.5)*.9)<.6; P(g,x,y, vein?"#9AD860":pick(["#5AAE3A","#4E9E32","#64B844"])); } }),
    mossRoof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3?"#2E5A26":(rand()<.3?pick(["#6A9A3A","#7AAA44"]):pick(["#4E8030","#5A8C36","#46762C"]))); }),
    elfWood: planks(["#9A6E40","#A87A48","#8E6438"], "#5E4022"), elfWoodD: stripes(["#6A4A2C","#5E4026","#74522F"], true),
    elfStone: bricks(["#E8E2CE","#DCD4BC","#EEE8D6"], "#B8AE92"), elfPillar: stripes(["#F0EAD8","#E2DAC4","#F6F0E2"], true), elfFloor: rings(["#E6E0CC","#D8D0B8","#EEE8D6"]),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=Math.hypot(x-7.5,y-7.5); P(g,x,y, d>7.2?"#5E4022": d>6 ? "#8A6236" : (x===7||x===8||y===7||y===8) ? "#8A6236" : pick(["#FFD27A","#FFC860","#FFE09A"])); } }),
    lantern: noise(["#FFE6A0","#FFD27A","#FFF2CC"], 4, ["#E8A040"]), gold: noise(["#E8C24A","#F5D46A","#D8AE30"]),
    water: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.3)+rand()*.4; P(g,x,y, v>1.3?"#6AB0A8":v>.2?"#2E6E70":"#245C62"); } }),
    fall: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*1.3)+rand()*.8; P(g,x,y, v>1.2?"#FFFFFF":v>.3?"#CFF6F6":"#8ADCE0"); } }),
    moon: noise(["#BFF4FF","#8AE6FF","#E6FCFF"], 8, ["#FFFFFF"]), planks: planks(["#8A6236","#9A6E3E","#7A5530"], "#4E3820"),
    rope: stripes(["#C8A878","#B8986A","#D4B484"], false), flowerB: noise(["#6AC8FF","#8AD8FF"], 4, ["#FFFFFF"]), flowerW: noise(["#F4F4FF","#FFFFFF"], 4, ["#FFE27A"]),
    mush: noise(["#E84A4A","#F06060"], 6, ["#FFFFFF"]), glowMush: noise(["#7AF0E0","#5AD8D0","#AAFFF0"], 6, ["#FFFFFF"]),
    rune: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#7C807A","#8A8E86","#6E726C"])); for(const [a,b] of [[4,3],[5,4],[6,5],[7,6],[8,6],[9,5],[10,4],[7,7],[7,8],[7,9],[7,10],[6,11],[8,11]]) P(g,a,b,"#7FF0FF"); })
  };
  const blocks = {
    grass:{side:T.grassSide, top:T.grass, bottom:T.dirt}, dirt:{side:T.dirt}, stone:{side:T.stone}, moss:{side:T.moss},
    bark:{side:T.bark, top:T.barkTop}, leaves:{side:T.leaves}, leaves2:{side:T.leaves2}, leafRoof:{side:T.leafRoof}, mossRoof:{side:T.mossRoof},
    elfWood:{side:T.elfWood}, elfWoodD:{side:T.elfWoodD}, elfStone:{side:T.elfStone}, elfPillar:{side:T.elfPillar, top:T.elfFloor}, elfFloor:{side:T.elfStone, top:T.elfFloor},
    win:{side:T.win, em:.95}, lantern:{side:T.lantern, em:1.25}, gold:{side:T.gold, em:.25},
    water:{side:T.water, anim:[.04,.02], em:.12}, fall:{side:T.fall, alpha:.8, anim:[0,-.9], em:.35}, moon:{side:T.moon, em:.6, anim:[.02,.03]},
    planks:{side:T.planks}, rope:{side:T.rope}, flowerB:{side:T.flowerB, em:.6}, flowerW:{side:T.flowerW, em:.3}, mush:{side:T.mush}, glowMush:{side:T.glowMush, em:1.0},
    rune:{side:T.rune, top:T.stone, em:.35}
  };
  const W=96, D=72, WL=3;
  // Tal mit Wasser unten, Klippen hinten mit Wasserfällen
  const H = (x,z) => { let h = 2 + fbm(x*.08,z*.08)*3.5;
    const back = Math.max(0, 16 - z); if(back>0) h += back*1.5 + fbm(x*.12,z*.2)*7;
    const side = Math.max(0, Math.max(5 - x, x - (W-6))); if(side>0) h += side*2.2 + fbm(x*.2,z*.1)*4;
    return h; };
  terrain(W, D, H, (x,y,z,h) => y===h-1 ? (h<=WL+1 ? "dirt" : (h>14 ? (rand()<.5?"moss":"grass") : "grass")) : y>h-3 ? "dirt" : (rand()<.35?"moss":"stone"));
  for(let z=0;z<D;z++) for(let x=0;x<W;x++){ const t=topAt(x,z,60); for(let y=t+1;y<=WL;y++) set(x,y,z,"water"); }

  // ---------- Bausteine ----------
  // Riesenbaum mit Wurzeln, leicht gedrehtem Stamm, Ästen und Krone
  const giantTree = (x,z,r,h,crown) => { const y0 = Math.max(1, topAt(x,z,80)-1);
    for(let y=y0; y<y0+h; y++){ const f=(y-y0)/h, rr = r*(1-f*.35) + Math.max(0,4-(y-y0))*.9, ox=Math.sin(y*.07+x)*1.2, oz=Math.cos(y*.06+z)*1.2; disk(x+ox,y,z+oz,rr,"bark"); }
    for(let i=0;i<7;i++){ const a=i/7*Math.PI*2+rand(); line(x+Math.cos(a)*r*.7,y0+4,z+Math.sin(a)*r*.7, x+Math.cos(a)*(r+6), y0-1, z+Math.sin(a)*(r+6), "bark", 1); }
    const ct = y0+h;
    if(crown){ for(let i=0;i<5;i++){ const a=i/5*Math.PI*2+rand()*.5, d=crown*.6; line(x,ct-8,z, x+Math.cos(a)*d, ct-1, z+Math.sin(a)*d, "bark", 1);
        ellip(x+Math.cos(a)*d, ct+1, z+Math.sin(a)*d, crown*.55, crown*.32, crown*.55, ()=> rand()<.25?"leaves2":"leaves"); }
      ellip(x, ct+3, z, crown*.7, crown*.4, crown*.7, ()=> rand()<.25?"leaves2":"leaves"); }
    return y0; };
  // runde Plattform um einen Stamm mit Geländer, Stützbalken und Laternen
  const platform = (x,z,y,R,rIn) => { for(let a=Math.floor(x-R);a<=x+R;a++) for(let b=Math.floor(z-R);b<=z+R;b++){ const d=Math.hypot(a-x,b-z); if(d<=R+.3 && d>=rIn-1) set(a,y,b,"planks"); }
    ring(x,y+1,z,R,(a,yy,b)=> ((a+b)%3===0) ? "elfWoodD" : null); ring(x,y+2,z,R,"rope");
    for(let i=0;i<8;i++){ const ang=i/8*Math.PI*2; line(x+Math.cos(ang)*rIn,y-6,z+Math.sin(ang)*rIn, x+Math.cos(ang)*(R-1),y-1,z+Math.sin(ang)*(R-1),"elfWoodD"); }
    for(let i=0;i<6;i++){ const ang=i/6*Math.PI*2+.4, lx=Math.round(x+Math.cos(ang)*R), lz=Math.round(z+Math.sin(ang)*R); fill(lx,y+1,lz,lx,y+3,lz,"elfWoodD"); set(lx,y+4,lz,"lantern"); set(lx,y-1,lz,"rope"); set(lx,y-2,lz,"lantern"); } };
  // Elbenhaus mit geschwungenem, spitzem Moosdach und runden Fenstern; Tür zeigt nach dir (dz=+1) oder zur Seite
  const elfHouse = (x,y,z,w,d,h,face="z") => { const hw=Math.floor(w/2), hd=Math.floor(d/2);
    fill(x-hw,y,z-hd,x+hw,y,z+hd,"planks");
    walls(x-hw,y+1,z-hd,x+hw,y+h,z+hd,(a,b,c)=> (a===x-hw||a===x+hw)&&(c===z-hd||c===z+hd) ? "elfWoodD" : (b===y+h ? "elfWoodD" : "elfWood"));
    // runde Fenster und Tür
    if(face==="z"){ for(const a of [-hw+1, hw-1].filter(v=>Math.abs(v)>1)){ set(x+a,y+Math.ceil(h/2)+1,z+hd,"win"); set(x+a,y+Math.ceil(h/2),z+hd,"win"); }
      fill(x,y+1,z+hd,x,y+2,z+hd,null); set(x,y+3,z+hd,"win"); set(x-1,y+3,z+hd+1,"lantern"); set(x+1,y+3,z+hd+1,"lantern"); for(const c of [-hd+1,hd-1]) { set(x-hw,y+Math.ceil(h/2)+1,z+c,"win"); set(x+hw,y+Math.ceil(h/2)+1,z+c,"win"); } }
    else { for(const c of [-hd+1, hd-1]) set(x+hw,y+Math.ceil(h/2)+1,z+c,"win"); fill(x+hw,y+1,z,x+hw,y+2,z,null); set(x+hw,y+3,z,"win"); set(x-hw,y+Math.ceil(h/2)+1,z,"win"); }
    // Dach: geschwungen, First entlang z (bzw. x), Traufen biegen sich nach außen
    const R = Math.round(w*.75)+2, along = face==="z";
    for(let i=0;i<=R;i++){ const half = (hw+2) * Math.pow(1 - i/R, .65);
      for(let s=-(along?hd+2:hw+2); s<=(along?hd+2:hw+2); s++){ const curl = Math.abs(s) >= (along?hd+1:hw+1) ? 1 : 0;
        for(const sg of [-1,1]){ const o = Math.round(sg*half); if(along) set(x+o, y+h+1+i+curl*(i<2?1:0), z+s, "mossRoof"); else set(x+s, y+h+1+i+curl*(i<2?1:0), z+o, "mossRoof"); } } }
    for(let i=0;i<=R;i++){ const half=(hw+2)*Math.pow(1-i/R,.65); for(let o=-Math.floor(half)+1;o<Math.floor(half);o++){ if(along){ set(x+o,y+h+1+i,z-hd-1,"elfWood"); set(x+o,y+h+1+i,z+hd+1,"elfWood"); } else { set(x-hw-1,y+h+1+i,z+o,"elfWood"); set(x+hw+1,y+h+1+i,z+o,"elfWood"); } } }
    if(along){ set(x,y+h+R+2,z-hd-2,"mossRoof"); set(x,y+h+R+3,z-hd-3,"mossRoof"); set(x,y+h+R+2,z+hd+2,"mossRoof"); set(x,y+h+R+3,z+hd+3,"mossRoof"); set(x,y+h+Math.round(R*.5)+1,z+hd+1,"win"); }
    else { set(x-hw-2,y+h+R+2,z,"mossRoof"); set(x+hw+2,y+h+R+2,z,"mossRoof"); set(x+hw+3,y+h+R+3,z,"mossRoof"); set(x+hw+1,y+h+Math.round(R*.5)+1,z,"win"); }
    return y+h+R+3; };
  // rundes Blatthaus (wie ein großes Blatt als Dach)
  const leafHut = (x,y,z,r) => { disk(x,y,z,r,"planks"); tube(x,y+1,z,r,4,(a,b,c)=> (b===y+3 && (a+c)%3===0) ? "win" : "elfWood");
    fill(x,y+1,z+r,x,y+2,z+r,null); set(x,y+3,z+r,"lantern");
    const R=r+3, Hh=r+5; for(let i=0;i<Hh;i++){ const rr = R*Math.pow(1-i/Hh,1.3); ring(x,y+5+i,z,rr,"leafRoof",2); if(rr<1.2) set(x,y+5+i,z,"leafRoof"); }
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ set(x+a*(R+1),y+4,z+b*(R+1),"leafRoof"); set(x+a*(R+2),y+3,z+b*(R+2),"leafRoof"); }
    set(x,y+5+Hh,z,"leafRoof"); set(x,y+6+Hh,z,"leafRoof"); return y+6+Hh; };
  // Hängebrücke mit Seilen, Pfosten und hängenden Laternen
  const ropeBridge = (x0,y0,z0,x1,y1,z1,lamps=true) => { const n=Math.ceil(Math.hypot(x1-x0,z1-z0)), nx=-(z1-z0)/n, nz=(x1-x0)/n;
    for(let i=0;i<=n;i++){ const f=i/n, sag=Math.sin(f*Math.PI)*Math.min(4,n*.08), x=x0+(x1-x0)*f, z=z0+(z1-z0)*f, y=Math.round(y0+(y1-y0)*f-sag);
      for(const w of [-1,0,1]) set(x+nx*w, y, z+nz*w, (i%4===0 && w===0) ? "elfWoodD" : "planks");
      set(x+nx*2, y+2, z+nz*2, "rope"); set(x-nx*2, y+2, z-nz*2, "rope");
      if(i%5===0){ set(x+nx*2,y+1,z+nz*2,"elfWoodD"); set(x-nx*2,y+1,z-nz*2,"elfWoodD"); }
      if(lamps && i%8===4){ set(x,y-1,z,"rope"); set(x,y-2,z,"lantern"); } } };
  // steinerne Bogenbrücke
  const archBridge = (x0,y0,z0,x1,y1,z1) => { const n=Math.ceil(Math.hypot(x1-x0,z1-z0)), nx=-(z1-z0)/n, nz=(x1-x0)/n;
    for(let i=0;i<=n;i++){ const f=i/n, x=x0+(x1-x0)*f, z=z0+(z1-z0)*f, y=Math.round(y0+(y1-y0)*f + Math.sin(f*Math.PI)*2);
      for(const w of [-1,0,1]) set(x+nx*w,y,z+nz*w,"elfFloor"); for(const w of [-2,2]){ set(x+nx*w,y,z+nz*w,"elfStone"); if(i%2===0) set(x+nx*w,y+1,z+nz*w,"elfPillar"); }
      const ay = y - 1 - Math.round(Math.abs(Math.sin(f*Math.PI*2))*3); for(let yy=ay; yy<y; yy++) for(const w of [-2,0,2]) set(x+nx*w,yy,z+nz*w,"elfStone");
      if(i%Math.ceil(n/2)===0 && i>0 && i<n){ for(let yy=WL-1;yy<ay;yy++) for(const w of [-1,0,1]) set(x+nx*w,yy,z+nz*w,"elfPillar"); }
      if(i===0||i===n){ for(const w of [-2,2]){ set(x+nx*w,y+2,z+nz*w,"elfPillar"); set(x+nx*w,y+3,z+nz*w,"lantern"); } } } };
  // Wasserfall
  const waterfall = (x,z,w) => { const t=topAt(x,z,80); for(let y=t; y>WL; y--) for(let a=0;a<w;a++){ const zz = z + Math.max(0, Math.floor((t-y)*.08)); set(x+a,y,zz+1,"fall"); } for(let a=-1;a<=w;a++) set(x+a,t+1,z,"water"); };

  // ---------- Grammar: Elbenpalast im Riesenbaum ----------
  const S = {
    grammar:   {x:48, z:30, col:0xE8C24A, ort:"Elven Palace"},
    vocabulary:{x:21, z:50, col:0x7FF0FF, ort:"Moonlit Fountain"},
    country:   {x:80, z:36, col:0xFFB84A, ort:"Treetop Village"}
  };
  const TX=48, TZ=30;
  giantTree(TX,TZ,6.5,56,25);
  platform(TX,TZ,18,13.5,6); platform(TX,TZ,34,10.5,5);
  const r1 = elfHouse(TX,19,TZ+9,11,6,6,"z");
  elfHouse(TX-10,19,TZ+1,6,8,5,"x"); elfHouse(TX+10,19,TZ-1,6,8,5,"x");
  // Pavillon mit Kuppel oben
  { const y=35, px=TX, pz=TZ+7; disk(px,y,pz,3.6,"elfFloor"); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2; fill(Math.round(px+Math.cos(a)*3),y+1,Math.round(pz+Math.sin(a)*3),Math.round(px+Math.cos(a)*3),y+5,Math.round(pz+Math.sin(a)*3),"elfPillar"); }
    ring(px,y+6,pz,3.6,"gold"); dome(px,y+6,pz,3.6,"mossRoof",true); set(px,y+10,pz,"gold"); set(px,y+11,pz,"lantern"); set(px,y+2,pz,"lantern"); }
  // Wendeltreppe um den Stamm
  for(let k=0;k<34;k++){ const a=k*.36+1.2, r=8.2; const sx=Math.round(TX+Math.cos(a)*r), sz=Math.round(TZ+Math.sin(a)*r); set(sx,1+k,sz,"planks"); set(sx+Math.sign(Math.cos(a)),1+k,sz,"planks"); if(k%6===0){ set(sx,2+k,sz,"elfWoodD"); set(sx,3+k,sz,"lantern"); } }
  S.grammar.top=[TX, 42, TZ+7]; S.grammar.base=28; S.grammar.cam={dist:58, up:.22, lookY:30, side:.08};

  // ---------- Vocabulary: Mondbrunnen auf einer Steininsel mit Bogenbrücken ----------
  { const {x,z} = S.vocabulary, y=12;
    for(const [a,b] of [[-4,-4],[4,-4],[-4,4],[4,4]]) for(let yy=0;yy<y;yy++) disk(x+a,yy,z+b,1.3,"elfPillar");
    for(let yy=y-3;yy<y;yy++) disk(x,yy,z,7.5-(y-yy)*1.2,"elfStone");
    disk(x,y,z,8,"elfFloor"); ring(x,y,z,8,"elfStone"); ring(x,y+1,z,8,(a,b,c)=>((a+c)%2?"elfPillar":null));
    ring(x,y+1,z,3,"elfStone"); disk(x,y+1,z,2.2,"moon"); fill(x,y+1,z,x,y+4,z,"elfPillar"); disk(x,y+5,z,1.3,"elfStone"); set(x,y+5,z,"moon"); set(x,y+6,z,"moon");
    for(const [a,b] of [[-6,-3],[6,-3],[-3,6],[3,6]]){ fill(x+a,y+1,z+b,x+a,y+3,z+b,"rune"); set(x+a,y+4,z+b,"lantern"); }
    for(let i=0;i<22;i++){ const a=rand()*Math.PI*2, d=4+rand()*3, px=Math.round(x+Math.cos(a)*d), pz=Math.round(z+Math.sin(a)*d); if(!get(px,y+1,pz)) set(px,y+1,pz,pick(["flowerB","flowerW","flowerB"])); }
    archBridge(x-8,y,z+1, 3,13,z+4);
    archBridge(x+6,y,z-5, TX-11,18,TZ+8);
    S.vocabulary.top=[x,y+9,z]; S.vocabulary.base=y+2; S.vocabulary.cam={pos:[4,30,86], look:[32,14,48]}; }

  // ---------- Country & people: Baumdorf mit Blatthäusern und Hängebrücken ----------
  const V1=[80,20], V2=[88,46], V3=[69,52];
  giantTree(V1[0],V1[1],4.2,44,16); platform(V1[0],V1[1],22,9,4); const h1 = leafHut(V1[0],23,V1[1]+5.5,3);
  giantTree(V2[0],V2[1],3.8,36,14); platform(V2[0],V2[1],15,8,4); const h2 = leafHut(V2[0]-1,16,V2[1]+5,3);
  giantTree(V3[0],V3[1],3.4,38,13); platform(V3[0],V3[1],27,7.5,3.5); leafHut(V3[0],28,V3[1]+4,2.6);
  ropeBridge(TX+13,18,TZ+3, V1[0]-8,22,V1[1]+3);
  ropeBridge(V1[0]+3,22,V1[1]+8, V2[0]-2,15,V2[1]-7);
  ropeBridge(V2[0]-7,15,V2[1]+2, V3[0]+6,27,V3[1]-1);
  ropeBridge(V3[0]-7,27,V3[1]-2, TX+9,34,TZ+5);
  S.country.top=[V2[0]-1, h2+1, V2[1]+5]; S.country.base=24; S.country.cam={pos:[82,34,94], look:[98,24,52]};

  // ---------- Hängebrücke von vorne zum Palast (wie ein Eingang) ----------
  { for(let y=0;y<16;y++) disk(48,y,70,2.6,y>12?"elfStone":"stone"); disk(48,16,70,3.2,"elfFloor");
    for(const a of [-3,3]){ fill(48+a,17,72,48+a,21,72,"elfPillar"); set(48+a,22,72,"lantern"); }
    ropeBridge(48,16,67, 48,18,TZ+14); }

  // Linker Riesenbaum mit Haus, Klippenpavillons, Wasserfälle
  giantTree(13,22,4.6,46,16); platform(13,22,24,9,4.6); elfHouse(13,25,28,7,5,5,"z");
  ropeBridge(13+9,24,22, TX-13,18,TZ-2);
  for(const [wx,wz] of [[22,8],[60,6],[84,9],[36,5]]) waterfall(wx,wz,3);
  for(const [px,pz] of [[30,4],[72,5]]){ const t=topAt(px,pz,80)+1; disk(px,t-1,pz,3.4,"elfFloor"); for(let i=0;i<5;i++){ const a=i/5*Math.PI*2; fill(Math.round(px+Math.cos(a)*2.6),t,Math.round(pz+Math.sin(a)*2.6),Math.round(px+Math.cos(a)*2.6),t+4,Math.round(pz+Math.sin(a)*2.6),"elfPillar"); } dome(px,t+5,pz,3.2,"mossRoof",true); set(px,t+9,pz,"gold"); set(px,t+1,pz,"lantern"); }

  // Kleinkram am Talboden und auf den Klippen
  const free = (x,z,r) => Math.hypot(x-TX,z-TZ)>12+r && Math.hypot(x-S.vocabulary.x,z-S.vocabulary.z)>9+r && Math.hypot(x-V1[0],z-V1[1])>7+r && Math.hypot(x-V2[0],z-V2[1])>6+r && Math.hypot(x-V3[0],z-V3[1])>6+r && Math.hypot(x-13,z-22)>7+r && Math.abs(x-48)>4;
  for(let i=0;i<140;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D); if(!free(x,z,2)) continue; const t=topAt(x,z,80)+1; if(t<=WL+1) continue;
    const r=rand(); if(r<.3 && (z<18 || x<8 || x>W-9)){ const hh=6+Math.floor(rand()*7); fill(x,t,z,x,t+hh,z,"bark"); ellip(x,t+hh+1,z,2.6,2,2.6,()=>rand()<.3?"leaves2":"leaves"); }
    else if(r<.5) set(x,t,z, rand()<.6?"glowMush":"mush"); else if(r<.62){ fill(x,t,z,x,t+2,z,"elfPillar"); set(x,t+3,z,"lantern"); } else set(x,t,z,pick(["flowerB","flowerW"])); }

  A.clearView([82,34,94],[86,24,51],3,["leaves","leaves2"]); A.clearView([4,30,86],[21,14,50],3,["leaves","leaves2","bark"]);
  // ---------- Landschaft bis zum Horizont: Riesenbäume im Nebel, Klippen ----------
  const F = A.far; F.cell = 3;
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const fh = (x,z) => { let h = 3 + fbm(x*.04,z*.04)*5; if(z<0) h += Math.min(40, -z*.4) * (.6+.6*fbm(x*.03,z*.05)); else if(away(x,z)>8) h += (fbm(x*.05+3,z*.05)-.4)*16; return h; };
  A.farTerrain({ x0:-150, x1:W+150, z0:-160, z1:D+60, base:0, skip:(x,z)=> (x>-1 && x<W+1 && z>-1 && z<D+1) || fh(x,z) < 9,
    h: fh, top:(x,z,y,hc)=> y*3>30 ? (rand()<.5?"moss":"stone") : "grass", fill:()=> "stone" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  const farTree = (x,z,r,h) => { const y0=0; for(let y=y0;y<h;y+=3) for(let a=-r;a<=r;a+=3) for(let b=-r;b<=r;b+=3) if(a*a+b*b<=r*r+2) fset(x+a,y,z+b,"bark");
    for(let k=0;k<2;k++){ const py = 18 + k*16 + Math.floor(rand()*6); if(py>h-6) break; const R=r+6; for(let a=-R;a<=R;a+=3) for(let b=-R;b<=R;b+=3) if(a*a+b*b<=R*R && a*a+b*b>r*r) fset(x+a,py,z+b,"planks"); if(rand()<.8) fset(x+R-2,py+3,z, "win"); if(rand()<.6) fset(x-R+2,py+3,z+3,"lantern"); }
    const C=r+9; for(let a=-C;a<=C;a+=3) for(let b=-C;b<=C;b+=3) for(let c=-6;c<=6;c+=3) if((a/C)**2+(b/C)**2+(c/7)**2<=1) fset(x+a,h+c,z+b, rand()<.25?"leaves2":"leaves"); };
  for(let i=0;i<28;i++){ const x=-150+rand()*(W+340), z=-170+rand()*(D+200); const aw=away(x,z); if(aw<14 || z>D+10 && Math.abs(x-W/2)<W*.7) continue; farTree(x,z, 4+Math.floor(rand()*2)*3, 46+Math.floor(rand()*36)); }

  // Glühwürmchen, Nebel, Lichtstrahlen, Einhorn, Vögel
  const creatures = [{ ...unicorn(), at:[S.vocabulary.x+1, 13, S.vocabulary.z-5], yaw:.35, scale:.85 }];
  for(let i=0;i<6;i++) creatures.push({ ...bird(0xF4F0DC), orbit:{c:[48+i*2,52+(i%3)*2,22+(i%2)*4], r:[44,26], speed:.11, ph:i*.15, bob:1}, scale:.5, noShadow:true });
  return {
    W, D, blocks, spots:S, exposure:1.18, fov:40, creatures,
    sky:[[0,"#0E2A34"],[.35,"#2A5A5E"],[.7,"#9AB89A"],[1,"#E8D8A0"]], fog:[0x3E625A, 70, 300],
    hemi:[0xCFE8D8, 0x2A3A22, 1.45], sun:{color:0xFFDCA8, int:1.8, pos:[-60,80,50]}, bloom:[.55,.5,.8],
    lights:[{pos:[TX,24,TZ+14], color:0xFFC870, int:300, dist:36},
            {pos:[S.vocabulary.x,15,S.vocabulary.z], color:0x7FF0FF, int:110, dist:20},
            {pos:[V1[0],28,V1[1]+6], color:0xFFB84A, int:220, dist:30, flicker:true}],
    planes:[{y:WL+.4, tex:T.water, repeat:300, size:1000, em:.1, anim:[.02,.01]}],
    rays:{n:18, color:0xFFE6A8, area:[-30,W+30,-30,D], y:46, len:90},
    particles:[{n:420, area:[-10,W+10,3,40,-10,D+10], vy:0, wob:1.1, color:0xE8FF7A, size:.9, blink:1.3},
               {n:160, area:[-120,W+120,4,50,-140,-10], vy:0, wob:1.4, color:0xE8FF7A, size:1.8, blink:1},
               {n:70, area:[S.vocabulary.x-3,S.vocabulary.x+3,13,24,S.vocabulary.z-3,S.vocabulary.z+3], vy:1.4, wob:.4, color:0x6AD4E0, size:.25, add:true, twinkle:true},
               {n:120, area:[20,76,30,62,10,44], vy:-.5, wob:1.4, color:0xB8E070, size:.3, opacity:.85}],
    puffs:[{n:30, pos:[-60,5,-30], dx:220, dy:1, dz:30, s0:22, s1:20, color:0xCFE6DA, opacity:.42, speed:.01, spread:70, flat:.35, sz:1.2},
           {n:18, pos:[-20,8,40], dx:140, dy:2, dz:0, s0:14, s1:14, color:0xDDEEE4, opacity:.25, speed:.014, spread:30, flat:.4}],
    home:{pos:[W/2,48,D+78], look:[W/2,22,D/2-8]}, homePortrait:{pos:[W/2,62,D+108], look:[W/2,20,D/2-8]},
    ui:{bg:"rgba(14,36,30,.88)", border:"#E8C24A", glow:"rgba(232,194,74,.45)", text:"#F4F0DC", sub:"#B8D0B4", accent:"#E8C24A", "accent-ink":"#1E1A06", chip:"rgba(12,30,24,.8)"}
  };
}
