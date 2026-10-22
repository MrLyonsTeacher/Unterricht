// Klasse 9 · Woodlands – Elbenwald mit Riesenbäumen, Mondbrunnen und Flussdorf
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, cone, line, topAt, terrain, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT } = A;
  const T = {
    grass: noise(["#3E8E3A","#479A40","#367F32","#52A446"], 10, ["#6CC058"]), grassSide: topEdge(["#6A4E32","#5E442A","#76583A"], ["#3E8E3A","#479A40"], 4),
    dirt: noise(["#6A4E32","#5E442A","#76583A"]), stone: noise(["#8A8E86","#7C807A","#969A92"], 6, ["#6E7A5E"]), moss: noise(["#5E7A4A","#6A8A52","#526E40","#7C807A"]),
    bark: stripes(["#5A4230","#4E3828","#664A36","#5E4632"], true, "#3E2E20"), barkTop: rings(["#9A7A52","#866844","#6E5436"]),
    birch: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (y%5===0 && x>3 && x<11) ? "#3A3A3A" : pick(["#F2F0E8","#E8E6DC","#FAF8F2"])); }),
    leaves: noise(["#2E7A3A","#368A42","#28703A","#3E9A4A"], 12, ["#5CB860"]), leavesG: noise(["#C8A83A","#D8B848","#B8982E","#E0C860"], 10, ["#F0E08A"]),
    leavesS: noise(["#BFE6C8","#D8F2DC","#A8D8B4"], 8, ["#FFFFFF"]),
    elf: noise(["#F2EEDC","#E8E2CC","#FAF6E6"], 6, ["#D8D0B4"]), elfB: bricks(["#EEE8D2","#E2DAC0"], "#C8BE9E"), elfP: stripes(["#F4F0E0","#E4DEC8","#FAF6EA"], true),
    roofG: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3?"#1E5A3A":((x+Math.floor(y/4)*4)%8<4?"#2E8A5A":"#277A4E")); }),
    gold: noise(["#E8C24A","#F5D46A","#D8AE30"]), lantern: noise(["#FFE6A0","#FFD27A","#FFF2CC"], 4, ["#E8A040"]),
    water: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.3)+rand()*.6; P(g,x,y, v>1.1?"#8AD8D0":v>.2?"#3A9AA0":"#2A7A88"); } }),
    moon: noise(["#BFF4FF","#8AE6FF","#E6FCFF"], 8, ["#FFFFFF"]), planks: planks(["#8A6236","#9A6E3E","#7A5530"], "#4E3820"), rope: stripes(["#C8A878","#B8986A"], false),
    flowerB: noise(["#6AC8FF","#8AD8FF"], 4, ["#FFFFFF"]), flowerW: noise(["#F4F4FF","#FFFFFF"], 4, ["#FFE27A"]), mush: noise(["#E84A4A","#F06060"], 6, ["#FFFFFF"]),
    rune: noise(["#7C807A","#8A8E86"], 0), runeGlow: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#7C807A","#8A8E86","#6E726C"])); for(const [a,b] of [[4,3],[5,4],[6,5],[7,6],[8,6],[9,5],[10,4],[7,7],[7,8],[7,9],[7,10],[6,11],[8,11]]) P(g,a,b,"#7FF0FF"); })
  };
  const blocks = {
    grass:{side:T.grassSide, top:T.grass, bottom:T.dirt}, dirt:{side:T.dirt}, stone:{side:T.stone}, moss:{side:T.moss},
    bark:{side:T.bark, top:T.barkTop}, birch:{side:T.birch, top:T.barkTop}, leaves:{side:T.leaves}, leavesG:{side:T.leavesG}, leavesS:{side:T.leavesS, em:.12},
    elf:{side:T.elf}, elfB:{side:T.elfB}, elfP:{side:T.elfP, top:T.elf}, roofG:{side:T.roofG}, gold:{side:T.gold, em:.25}, lantern:{side:T.lantern, em:1.2},
    water:{side:T.water, alpha:.82, anim:[.05,.02], em:.1}, moon:{side:T.moon, em:1.1, alpha:.9, anim:[.02,.03]}, planks:{side:T.planks}, rope:{side:T.rope},
    flowerB:{side:T.flowerB, em:.6}, flowerW:{side:T.flowerW, em:.3}, mush:{side:T.mush}, rune:{side:T.runeGlow, top:T.rune, em:.35}
  };
  const W=92, D=70;
  const riverZ = x => 44 + Math.sin(x*.09)*5 + Math.sin(x*.21)*1.5;
  const S = {
    grammar:   {x:46, z:20, r:13, col:0xE8C24A, ort:"Elven Palace"},
    vocabulary:{x:16, z:36, r:9,  col:0x7FF0FF, ort:"Moonlit Grove"},
    country:   {x:74, z:30, r:9,  col:0xFFB84A, ort:"River Village"}
  };
  const near = (x,z,r) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);
  const H = (x,z) => { let h = 6 + fbm(x*.07,z*.07)*5 + Math.max(0, 12-z)*.9; const rd = Math.abs(z-riverZ(x)); if(rd<5) h = Math.min(h, 3 + rd*.8); return h; };
  terrain(W, D, H, (x,y,z,h) => y===h-1 ? (h<=4 ? "dirt" : "grass") : y>h-4 ? "dirt" : (rand()<.3?"moss":"stone"));
  for(let x=0;x<W;x++) for(let z=0;z<D;z++){ if(Math.abs(z-riverZ(x))<3.4){ const t=topAt(x,z,30); for(let y=t+1;y<=4;y++) set(x,y,z,"water"); } }
  for(const s of Object.values(S)){ s.y = Math.round(H(s.x,s.z)); for(let z=s.z-s.r; z<=s.z+s.r; z++) for(let x=s.x-s.r; x<=s.x+s.r; x++) if(Math.hypot(x-s.x,z-s.z)<=s.r){ const t=topAt(x,z,40); for(let y=s.y;y<=t;y++) set(x,y,z,null); for(let y=t+1;y<s.y;y++) set(x,y,z,"dirt"); set(x,s.y-1,z,"grass"); } }

  // Riesenbaum
  const bigTree = (x,z,r,h,leaf="leaves",crown=8) => { const y0=topAt(x,z,40)+1;
    for(let y=y0; y<y0+h; y++){ const rr = r*(1 - (y-y0)/h*.45) + (y-y0<3 ? (3-(y-y0))*.6 : 0); disk(x,y,z,rr,"bark"); }
    for(let i=0;i<6;i++){ const a=i/6*Math.PI*2+rand(); line(x,y0+1,z, Math.round(x+Math.cos(a)*(r+3)), y0-1, Math.round(z+Math.sin(a)*(r+3)), "bark", 0); }
    const ct = y0+h; for(let i=0;i<5;i++){ const a=i/5*Math.PI*2, d=crown*.55; line(x,ct-6,z, Math.round(x+Math.cos(a)*d), ct-1, Math.round(z+Math.sin(a)*d), "bark");
      ball(Math.round(x+Math.cos(a)*d), ct+1, Math.round(z+Math.sin(a)*d), crown*.55, leaf); }
    ball(x, ct+3, z, crown*.7, leaf); return y0; };

  // Grammar: Elbenpalast um einen Riesenbaum
  { const {x,y,z} = S.grammar;
    const y0 = bigTree(x, z-2, 4.2, 36, "leavesG", 13);
    // Plattformen mit Hallen
    for(const [lv,r] of [[10,9],[20,7.5],[29,6]]){ const py = y0+lv;
      ring(x,py,z-2,r,"elfB",2.2); ring(x,py+1,z-2,r,(a,b,c)=>((a+c)%2?"elfP":null)); ring(x,py,z-2,r+.6,"gold");
      for(let i=0;i<6;i++){ const a=i/6*Math.PI*2+.3; const lx=Math.round(x+Math.cos(a)*r), lz=Math.round(z-2+Math.sin(a)*r); fill(lx,py+1,lz,lx,py+2,lz,"elfP"); set(lx,py+3,lz,"lantern"); } }
    // Halle vorne auf dem Boden
    fill(x-8,y,z+3,x+8,y,z+10,"elfB");
    for(const a of [-7,-3,3,7]){ fill(a+x,y+1,z+9,a+x,y+9,z+9,"elfP"); set(a+x,y+10,z+9,"gold"); }
    fill(x-8,y+1,z+3,x+8,y+8,z+4,"elfB"); for(let a=-6;a<=6;a+=3) fill(x+a,y+3,z+5,x+a,y+6,z+5,"lantern");
    fill(x-2,y+1,z+4,x+2,y+6,z+4,null); fill(x-2,y+1,z+3,x+2,y+6,z+3,"lantern");
    // geschwungenes Dach
    for(let i=0;i<6;i++){ const w=9-i*1.3; fill(Math.round(x-w),y+9+i,z+3+Math.floor(i/2),Math.round(x+w),y+9+i,z+10-Math.floor(i*1.1), "roofG"); }
    for(const a of [-10,10]){ set(x+a,y+9,z+3,"roofG"); set(x+a,y+9,z+10,"roofG"); set(x+a+(a>0?1:-1),y+10,z+10,"roofG"); }
    set(x,y+15,z+6,"gold"); set(x,y+16,z+6,"gold");
    // Wendeltreppe um den Stamm
    for(let k=0;k<30;k++){ const a=k*.42, r=5.4; const sx=Math.round(x+Math.cos(a)*r), sz=Math.round(z-2+Math.sin(a)*r); set(sx,y0+k,sz,"planks"); if(k%5===0) set(sx,y0+k+1,sz,"lantern"); }
    // Weg
    for(let s=0;s<6;s++) fill(x-1,y-1,z+11+s,x+1,y-1,z+11+s,"elf");
    S.grammar.top=[x-11,y+19,z+10]; S.grammar.base=y+10; S.grammar.cam={dist:66, up:.3, lookY:y+18}; }

  // Vocabulary: Mondhain mit Birken, Runensteinen und Mondbrunnen
  { const {x,y,z} = S.vocabulary;
    ring(x,y-1,z,2.8,"elf"); disk(x,y-1,z,2,"moon"); ring(x,y,z,3,"elfB");
    for(let i=0;i<7;i++){ const a=i/7*Math.PI*2, d=7; const bx=Math.round(x+Math.cos(a)*d), bz=Math.round(z+Math.sin(a)*d);
      if(i%2===0){ fill(bx,y,bz,bx,y+9+(i%3),bz,"birch"); ball(bx,y+11+(i%3),bz,2.6,"leavesS"); } else { fill(bx,y,bz,bx,y+2,bz,"rune"); set(bx,y+3,bz,"stone"); } }
    for(let i=0;i<40;i++){ const a=rand()*Math.PI*2, d=3.5+rand()*4.5, px=Math.round(x+Math.cos(a)*d), pz=Math.round(z+Math.sin(a)*d); if(!get(px,y,pz)) set(px,y,pz,pick(["flowerB","flowerW","flowerB"])); }
    S.vocabulary.top=[x,y+15,z]; S.vocabulary.base=y+4; S.vocabulary.cam={dist:34, up:.42}; }

  // Country & people: Flussdorf mit Baumhäusern, Brücke und Booten
  { const {x,y,z} = S.country;
    const treeHouse = (tx,tz,hh) => { const yy=bigTree(tx,tz,1.6,hh+8,"leaves",7); const py=yy+hh;
      fill(tx-3,py,tz-3,tx+3,py,tz+3,"planks"); walls(tx-3,py+1,tz-3,tx+3,py+3,tz+3,(a,b,c)=> b===py+2 && (a===tx||c===tz) ? "lantern" : "planks");
      for(let i=0;i<4;i++) fill(tx-4+i,py+4+i,tz-4+i,tx+4-i,py+4+i,tz+4-i,"roofG");
      fill(tx+4,yy,tz,tx+4,py,tz,"rope"); return py; };
    const p1 = treeHouse(x-4,z-3,7), p2 = treeHouse(x+5,z+2,10);
    line(x-1,p1+1,z-3,x+2,p2+1,z+2,"planks"); line(x-1,p1+2,z-2,x+2,p2+2,z+3,"rope");
    // Hütte am Boden
    fill(x-2,y,z+5,x+2,y+3,z+8,"planks"); fill(x-1,y,z+5,x,y+1,z+5,null); for(let i=0;i<3;i++) fill(x-3+i,y+4+i,z+4,x+3-i,y+4+i,z+9,"roofG"); set(x+2,y+2,z+5,"lantern");
    S.country.top=[x+1,y+15,z+6]; S.country.base=y+8; S.country.cam={dist:44, up:.36}; }
  // Brücke und Boote auf dem Fluss
  { const bx=70, rz=Math.round(riverZ(70)); for(let b=-5;b<=5;b++){ const by=5+Math.round(Math.cos(b/5*Math.PI/2)*1.5); fill(bx-1,by,rz+b,bx+1,by,rz+b,"planks"); set(bx-2,by+1,rz+b,"rope"); set(bx+2,by+1,rz+b,"rope"); }
    for(const ox of [30,52,84]){ const oz=Math.round(riverZ(ox)); fill(ox-2,5,oz,ox+2,5,oz,"planks"); set(ox-3,6,oz,"planks"); set(ox+3,6,oz,"planks"); set(ox,6,oz,"lantern"); } }

  // Weitere Bäume, Pilze, Laternen
  const corridor = (x,z) => Object.values(S).some(s=> z>s.z && Math.abs(x-s.x) < 8 + (z-s.z)*.35);
  for(let i=0;i<110;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D); if(near(x,z,4) || Math.abs(z-riverZ(x))<5) continue;
    const r=rand(), tall = !corridor(x,z) && z<D-14;
    if(r<.14 && tall && (z<14 || x<7 || x>W-8)) bigTree(x,z,2.4,18+Math.floor(rand()*10),"leaves",9);
    else if(r<.45 && tall){ const t=topAt(x,z,40)+1, hh=5+Math.floor(rand()*5); fill(x,t,z,x,t+hh,z, rand()<.25?"birch":"bark"); ball(x,t+hh+1,z,2.4, rand()<.2?"leavesG":"leaves"); }
    else if(r<.6){ const t=topAt(x,z,40)+1; set(x,t,z,"mush"); }
    else if(r<.7){ const t=topAt(x,z,40)+1; fill(x,t,z,x,t+2,z,"elfP"); set(x,t+3,z,"lantern"); }
    else { const t=topAt(x,z,40)+1; set(x,t,z,pick(["flowerB","flowerW"])); } }

  return {
    W, D, blocks, spots:S, exposure:1.15, fov:40, seed:9,
    sky:[[0,"#0E2A3A"],[.4,"#2E5E6A"],[.75,"#C89A5A"],[1,"#F2C478"]], fog:[0x2E4E48, 60, 180],
    hemi:[0xBFE6D8, 0x2A3A1E, 1.4], sun:{color:0xFFD8A0, int:1.7, pos:[-60,70,60]}, bloom:[.5,.5,.82],
    lights:[{pos:[S.grammar.x,S.grammar.y+8,S.grammar.z+12], color:0xFFD27A, int:260, dist:34},
            {pos:[S.vocabulary.x,S.vocabulary.y+3,S.vocabulary.z], color:0x7FF0FF, int:220, dist:22},
            {pos:[S.country.x,S.country.y+12,S.country.z], color:0xFFB84A, int:200, dist:28, flicker:true}],
    rays:{n:12, color:0xFFE6A8},
    particles:[{n:360, area:[0,W,5,32,0,D], vy:0, wob:.9, color:0xD8FF8A, size:.22, opacity:.95, add:true, twinkle:true},
               {n:120, area:[S.vocabulary.x-4,S.vocabulary.x+4,S.vocabulary.y,S.vocabulary.y+14,S.vocabulary.z-4,S.vocabulary.z+4], vy:1.2, wob:.4, color:0x9AF4FF, size:.2, add:true, twinkle:true},
               {n:140, area:[30,62,20,50,8,30], vy:-.6, wob:1.4, color:0xF0D060, size:.26, opacity:.9}],
    home:{pos:[W/2,50,D+62], look:[W/2,19,D/2-8]}, homePortrait:{pos:[W/2,60,D+98], look:[W/2,14,D/2-8]},
    ui:{bg:"rgba(14,36,30,.88)", border:"#E8C24A", glow:"rgba(232,194,74,.45)", text:"#F4F0DC", sub:"#B8D0B4", accent:"#E8C24A", "accent-ink":"#1E1A06", chip:"rgba(12,30,24,.8)"}
  };
}
