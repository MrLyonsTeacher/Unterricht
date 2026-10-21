// Klasse 8 · Sky Castle – schwebende Inseln über einem Wolkenmeer
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT } = A;
  const T = {
    grass: noise(["#6BCB4A","#7AD858","#5FBE40","#86E063"], 10, ["#A8F07A"]), grassSide: topEdge(["#8A6A44","#7C5E3A","#96744C"], ["#6BCB4A","#7AD858"], 4),
    dirt: noise(["#8A6A44","#7C5E3A","#96744C","#6E5232"]), rock: noise(["#A4A8B4","#9498A4","#B2B6C0","#8A8E9A"], 6, ["#C8CCD4"]),
    quartz: noise(["#F4F2EC","#ECEAE2","#FAF8F2"], 6, ["#E0DED4"]), qbrick: bricks(["#F6F4EE","#EEECE4"], "#D4D0C4"), qpillar: stripes(["#F4F2EC","#E6E4DA","#FAF8F2"], true),
    roof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3?"#1E4FA8":((x+Math.floor(y/4)*4)%8<4?"#3A78E0":"#2E66CC")); }),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]), window: glassT("#E8B030","#FFE9A0"),
    water: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(y*.8+x*.3)+rand()*.7; P(g,x,y, v>1.1?"#E8FBFF":v>.2?"#8AD8FF":"#5AB8F0"); } }),
    cloud: noise(["#FFFFFF","#F4F8FF","#EAF2FF"]), leaves: noise(["#FFB8D8","#FF9AC8","#FFD2E6","#F286B8"], 8, ["#FFFFFF"]),
    leavesG: noise(["#4FAE3A","#5CBE44","#449E30"], 8, ["#78D458"]), log: stripes(["#7A5532","#8A6238","#6A4828"], true), logTop: rings(["#B8894E","#A47840","#8A6236"]),
    planks: planks(["#C08A50","#CC965C","#B07C44"], "#7A5530"), woolR: noise(["#E04848","#EC5A5A","#C83636"]), woolW: noise(["#F4F4F4","#FFFFFF","#E8E8E8"]),
    woolY: noise(["#F5C542","#FFD95A","#E8B030"]), iron: noise(["#C4C8D0","#B4B8C0","#D2D6DC"]), rope: stripes(["#C8A878","#B8986A"], false),
    flowerR: noise(["#FF4A6A","#FF6A80"], 4, ["#FFE27A"]), flowerY: noise(["#FFE27A","#FFD24A"], 4, ["#FF9A3A"]), flowerB: noise(["#7AA8FF","#9AC0FF"], 4, ["#FFFFFF"]),
    crystal: noise(["#BFF8FF","#8AEAFF","#E6FFFF"], 6, ["#FFFFFF"]), lamp: noise(["#FFE6A8","#FFD27A","#FFF2CC"])
  };
  const blocks = {
    grass:{side:T.grassSide, top:T.grass, bottom:T.dirt}, dirt:{side:T.dirt}, rock:{side:T.rock},
    quartz:{side:T.quartz}, qbrick:{side:T.qbrick}, qpillar:{side:T.qpillar, top:T.quartz}, roof:{side:T.roof}, gold:{side:T.gold, em:.25}, window:{side:T.window, em:.9},
    water:{side:T.water, alpha:.75, anim:[0,-.6], em:.2}, pool:{side:T.water, alpha:.8, anim:[.05,.03], em:.15}, cloud:{side:T.cloud, alpha:.92, em:.15},
    blossom:{side:T.leaves}, leaves:{side:T.leavesG}, log:{side:T.log, top:T.logTop}, planks:{side:T.planks},
    woolR:{side:T.woolR}, woolW:{side:T.woolW}, woolY:{side:T.woolY}, iron:{side:T.iron}, rope:{side:T.rope},
    flowerR:{side:T.flowerR}, flowerY:{side:T.flowerY}, flowerB:{side:T.flowerB}, crystal:{side:T.crystal, em:1.0}, lamp:{side:T.lamp, em:1.1}
  };
  const W=92, D=70;
  // Schwebende Insel: Oberfläche bei yt, darunter ein zerklüfteter Felskegel
  const island = (cx,cz,r,yt,deep=1) => { const cells=[];
    for(let z=Math.floor(cz-r-3); z<=cz+r+3; z++) for(let x=Math.floor(cx-r-3); x<=cx+r+3; x++){
      const a=Math.atan2(z-cz,x-cx), rr=r*(.82+.3*vn(Math.cos(a)*2+cx, Math.sin(a)*2+cz)), d=Math.hypot(x-cx,z-cz); if(d>rr) continue;
      const f=1-d/rr, depth=Math.round((2+Math.pow(f,.8)*rr*1.1*deep)*(.75+.5*fbm(x*.3,z*.3))), top=yt+Math.round(fbm(x*.15+cx,z*.15)*1.4*f);
      for(let y=top-depth;y<=top;y++) set(x,y,z, y===top?"grass": y>top-3?"dirt": (rand()<.05?"crystal":"rock"));
      cells.push([x,z,top]); }
    return cells; };
  const S = {
    grammar:   {x:46, z:26, r:18, y:24, col:0x6AA8FF, ort:"Sky Castle"},
    vocabulary:{x:16, z:46, r:11, y:18, col:0xFF9AC8, ort:"Floating Gardens"},
    country:   {x:76, z:48, r:10, y:16, col:0xFFC24A, ort:"Airship Dock"}
  };
  for(const s of Object.values(S)){ island(s.x,s.z,s.r,s.y);
    // Bauplatz ebnen
    for(let z=s.z-s.r+3; z<=s.z+s.r-3; z++) for(let x=s.x-s.r+3; x<=s.x+s.r-3; x++) if(Math.hypot(x-s.x,z-s.z)<=s.r-4){ for(let y=s.y+1;y<s.y+4;y++) set(x,y,z,null); set(x,s.y,z,"grass"); set(x,s.y-1,z,"dirt"); } }
  // Kleine Inseln
  const smalls = [[8,16,5,28],[84,18,6,30],[28,10,4,34],[64,8,4,36],[34,60,4,12],[58,62,5,10],[90,36,3,24],[4,32,3,22]];
  for(const [x,z,r,y] of smalls){ island(x,z,r,y,.9); if(rand()<.7){ const t=topAt(x,z,y+4); fill(x,t+1,z,x,t+4,z,"log"); ball(x,t+6,z,2.3, rand()<.5?"blossom":"leaves"); } }

  // Grammar: Luftschloss aus Quarz mit blauen Dächern
  { const {x,y,z} = S.grammar;
    const tower = (tx,tz,r,h,roofH) => { cyl(tx,y+1,tz,r,h,"qbrick"); for(let hh=4; hh<h; hh+=5){ set(tx+Math.round(r),y+hh,tz,"window"); set(tx-Math.round(r),y+hh,tz,"window"); set(tx,y+hh,tz+Math.round(r),"window"); }
      ring(tx,y+h,tz,r+1,"quartz"); for(let i=0;i<8;i++){ const a=i/8*Math.PI*2; set(Math.round(tx+Math.cos(a)*(r+1)),y+h+1,Math.round(tz+Math.sin(a)*(r+1)),"gold"); }
      cone(tx,y+h+1,tz,r+.6,roofH,"roof"); set(tx,y+h+roofH+1,tz,"gold"); set(tx,y+h+roofH+2,tz,"gold"); };
    // Ringmauer
    walls(x-11,y+1,z-8,x+11,y+7,z+7, (a,b,c)=> b===y+7 ? ((a+c)%2?"quartz":null) : (b===y+4 && (a===x-11||a===x+11||c===z-8||c===z+7) && (a+c)%3===0 ? "window" : "qbrick"));
    fill(x-11,y+7,z-8,x+11,y+7,z-8,"quartz"); fill(x-2,y+1,z+7,x+2,y+5,z+7,null); fill(x-3,y+6,z+7,x+3,y+6,z+7,"gold");
    fill(x-2,y+1,z+7,x+2,y+1,z+7,"gold");
    // Weg und Treppe zum Tor
    for(let s=0;s<6;s++) fill(x-2,y,z+8+s,x+2,y,z+8+s,"quartz");
    // Haupt-Bergfried
    fill(x-5,y+1,z-5,x+5,y+18,z+3,"qbrick");
    for(let hh=3; hh<=16; hh+=4) for(let a=-4;a<=4;a+=2) set(x+a,y+hh,z+4,"window");
    for(const a of [-5,5]) fill(x+a,y+1,z+4,x+a,y+18,z+4,"qpillar");
    fill(x-6,y+19,z-6,x+6,y+19,z+4,"quartz"); for(let a=-6;a<=6;a+=2){ set(x+a,y+20,z+4,"gold"); set(x+a,y+20,z-6,"gold"); }
    for(let i=0;i<10;i++){ const w=6-i*.6; if(w<1) break; fill(Math.round(x-w),y+20+i,Math.round(z-1-w),Math.round(x+w),y+20+i,Math.round(z-1+w)*1,"roof"); }
    // Mittelturm
    tower(x,z-1,2.2,38-20+10,8);
    // Ecktürme
    for(const [a,b] of [[-11,-8],[11,-8],[-11,7],[11,7]]) tower(x+a,z+b,2.4,12,7);
    // Banner
    for(const a of [-7,7]){ fill(x+a,y+8,z+8,x+a,y+12,z+8,"woolR"); set(x+a,y+11,z+8,"woolY"); }
    S.grammar.top=[x-13,y+22,z+8]; S.grammar.base=y+12; S.grammar.cam={dist:56, up:.34, lookY:y+16}; }

  // Vocabulary: Schwebende Gärten mit Kirschbaum und Brunnen
  { const {x,y,z} = S.vocabulary;
    const tx=x-3, tz=z-3;
    for(let hh=1;hh<=8;hh++) fill(tx,y+hh,tz,tx+1,y+hh,tz+1,"log"); line(tx,y+6,tz,tx-4,y+9,tz-2,"log"); line(tx+1,y+6,tz+1,tx+5,y+9,tz+3,"log");
    ball(tx,y+11,tz,4.8,"blossom"); ball(tx-4,y+10,tz-2,3,"blossom"); ball(tx+5,y+10,tz+3,3.2,"blossom");
    // Brunnen
    const fx=x+4, fz=z+3; ring(fx,y+1,fz,3.2,"quartz"); disk(fx,y+1,fz,2.2,"pool"); fill(fx,y+1,fz,fx,y+4,fz,"qpillar"); disk(fx,y+5,fz,1.2,"quartz"); set(fx,y+6,fz,"pool");
    // Beete und Hecken
    for(let i=0;i<60;i++){ const a=rand()*Math.PI*2, d=2+rand()*(S.vocabulary.r-5); const px=Math.round(x+Math.cos(a)*d), pz=Math.round(z+Math.sin(a)*d); if(get(px,y+1,pz)) continue; if(Math.hypot(px-fx,pz-fz)<4) continue; set(px,y+1,pz,pick(["flowerR","flowerY","flowerB","leaves"])); }
    for(const [lx,lz] of [[x-7,z+3],[x+2,z-6]]){ fill(lx,y+1,lz,lx,y+4,lz,"qpillar"); set(lx,y+5,lz,"lamp"); }
    S.vocabulary.top=[x,y+17,z]; S.vocabulary.base=y+6; S.vocabulary.cam={dist:34, up:.42}; }

  // Country & people: Luftschiff-Hafen
  { const {x,y,z} = S.country;
    // Steg
    for(let a=0;a<16;a++) fill(x+2+a,y,z-1,x+2+a,y,z+1,"planks"); for(let a=2;a<18;a+=4){ fill(x+a,y+1,z-2,x+a,y+2,z-2,"log"); fill(x+a,y+1,z+2,x+a,y+2,z+2,"log"); }
    // Hafenhäuschen
    fill(x-6,y+1,z-5,x-1,y+5,z-1,"planks"); fill(x-5,y+2,z-1,x-2,y+3,z-1,"window"); fill(x-4,y+1,z-1,x-3,y+2,z-1,null);
    for(let i=0;i<4;i++) fill(x-7+i,y+6+i,z-6+i,x+i*0,y+6+i,z-0-i, "woolR");
    // Kisten, Fässer
    for(const [bx,bz] of [[x+1,z+4],[x+2,z+4],[x+1,z+5],[x-3,z+4]]) set(bx,y+1,bz,"planks"); set(x+1,y+2,z+4,"planks");
    // Luftschiff am Steg
    const ax=x+12, ay=y+6, az=z;
    for(let a=-7;a<=7;a++){ const r=Math.round(2.2*Math.sqrt(Math.max(0,1-(a/8)**2))); for(let b=-r;b<=r;b++){ set(ax+a,ay-r+Math.abs(b)*0,az+b,"planks"); } fill(ax+a,ay-r,az,ax+a,ay,az,"planks"); set(ax+a,ay+1,az-r,"planks"); set(ax+a,ay+1,az+r,"planks"); }
    for(let a=-8;a<=8;a++) for(let b=-4;b<=4;b++) for(let c=-4;c<=4;c++){ if((a/9)**2+(b/4.2)**2+(c/4.2)**2<=1) set(ax+a,ay+9+b,az+c, (a+20)%4<2 ? "woolW":"woolR"); }
    for(const [a,c] of [[-5,-2],[5,-2],[-5,2],[5,2]]) line(ax+a,ay+1,az+c,ax+a,ay+5,az+c,"rope");
    fill(ax-9,ay+8,az,ax-9,ay+10,az,"iron"); fill(ax-10,ay+6,az,ax-10,ay+12,az,"iron"); fill(ax+8,ay+1,az,ax+9,ay+2,az,"gold");
    set(ax+2,ay+1,az,"lamp");
    S.country.top=[x+2,y+12,z-3]; S.country.base=y+8; S.country.cam={dist:50, up:.42, side:.1}; }

  // Wasserfälle von den Inselrändern
  for(const [wx,wz,yt] of [[30,24,24],[62,32,24],[8,48,18],[84,54,16]]){ const t=topAt(wx,wz,yt+3); if(t<0) continue; for(let y=t;y>2;y--) fill(wx,y,wz,wx+1,y,wz,"water"); }
  // Brücken zwischen den Inseln
  const bridge = (x0,z0,x1,z1,y0,y1) => { const n=Math.ceil(Math.hypot(x1-x0,z1-z0)); for(let i=0;i<=n;i++){ const f=i/n, x=Math.round(x0+(x1-x0)*f), z=Math.round(z0+(z1-z0)*f), y=Math.round(y0+(y1-y0)*f - Math.sin(f*Math.PI)*2);
      if(!get(x,y,z)) set(x,y,z,"planks"); if(i%3===0){ set(x,y+1,z+1,"rope"); set(x,y+1,z-1,"rope"); } } };
  bridge(31,34,25,42,24,18); bridge(61,34,68,42,24,16);
  // Wolken als Blöcke
  for(let i=0;i<16;i++){ const cx=rand()*W, cz=rand()*D, cy=6+rand()*30; if(Object.values(S).some(s=>Math.hypot(s.x-cx,s.z-cz)<s.r+4)) continue;
    for(let k=0;k<4;k++){ const ox=cx+(rand()-.5)*8, oz=cz+(rand()-.5)*5; fill(Math.round(ox-2),Math.round(cy),Math.round(oz-1),Math.round(ox+2),Math.round(cy+1),Math.round(oz+1),"cloud"); } }
  // Kristalle unter den Inseln
  for(const s of Object.values(S)) for(let i=0;i<6;i++){ const a=rand()*Math.PI*2, x=Math.round(s.x+Math.cos(a)*s.r*.5), z=Math.round(s.z+Math.sin(a)*s.r*.5); let y=s.y-4; while(get(x,y,z) && y>s.y-40) y--; for(let k=0;k<3;k++) set(x,y-k,z,"crystal"); }

  // Vögel
  const bird = [[0,0,0,0xFFFFFF],[1,0,0,0xFFFFFF],[-1,0,0,0xF0A030],[0,0,1,0xE8E8E8],[0,0,-1,0xE8E8E8],[0,1,2,0xE8E8E8],[0,1,-2,0xE8E8E8]];
  const movers=[]; for(let i=0;i<9;i++) movers.push({cubes:bird, center:[46+(i%3)*2,40+(i%4),30+(i%2)*3], radius:[40,24], speed:.12, ph:i*.1, scale:.5, bob:1, face:Math.PI/2});
  const ship=[]; for(let a=-4;a<=4;a++){ ship.push([a,0,0,0xC08A50],[a,0,1,0xC08A50],[a,0,-1,0xC08A50]); for(let b=-2;b<=2;b++) for(let c=-2;c<=2;c++) if((a/4.6)**2+(b/2.2)**2+(c/2.2)**2<=1) ship.push([a,4+b,c, (a+8)%3?0xF4F4F4:0x3A78E0]); }
  movers.push({cubes:ship, center:[46,44,-6], radius:[56,8], speed:.04, ph:1, scale:1, bob:1.5, face:Math.PI/2});

  return {
    W, D, blocks, spots:S, exposure:1.1, fov:40,
    sky:[[0,"#2E7BE8"],[.45,"#7EC0FF"],[.75,"#FFD8C0"],[1,"#FFF2E6"]], fog:[0xE6F0FF, 110, 260],
    hemi:[0xDDEBFF, 0x8A9AB0, 1.7], sun:{color:0xFFF4E0, int:2.1, pos:[60,120,90]}, bloom:[.32,.5,.9],
    lights:[{pos:[S.grammar.x,S.grammar.y+14,S.grammar.z+8], color:0xFFE6A8, int:120, dist:30}],
    planes:[{y:2, tex:T.cloud, repeat:80, size:600, color:0xFFFFFF, em:.35, anim:[.01,0]}],
    puffs:[{n:26, pos:[-60,3,-40], dx:220, dy:2, dz:0, s0:16, s1:20, color:0xFFFFFF, opacity:.85, speed:.012, spread:60, flat:.45},
           {n:18, pos:[-60,8,40], dx:220, dy:1, dz:0, s0:12, s1:14, color:0xFFFFFF, opacity:.7, speed:.016, spread:50, flat:.5}],
    particles:[{n:180, area:[0,W,4,60,0,D], vy:.2, wob:.6, color:0xFFFFFF, size:.18, opacity:.7, add:true, twinkle:true},
               {n:90, area:[S.vocabulary.x-8,S.vocabulary.x+8,S.vocabulary.y+2,S.vocabulary.y+16,S.vocabulary.z-8,S.vocabulary.z+8], vy:-1, wob:1.2, color:0xFFB8D8, size:.3, opacity:.9}],
    movers,
    home:{pos:[W/2,50,D+66], look:[W/2,19,D/2-4]}, homePortrait:{pos:[W/2,66,D+104], look:[W/2,20,D/2-6]},
    ui:{bg:"rgba(255,255,255,.9)", border:"#6AA8FF", glow:"rgba(106,168,255,.45)", text:"#16305A", sub:"#4A6A98", accent:"#FFC24A", "accent-ink":"#2A1E06", chip:"rgba(255,255,255,.85)"}
  };
}
