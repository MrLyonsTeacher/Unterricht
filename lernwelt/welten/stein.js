// Klasse 7 · Stone World – Zwergenhöhle mit Edelsteinen, Mine und Schmiede
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks } = A;
  const ore = (base, spot) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(base)); for(let i=0;i<5;i++){ const x=1+Math.floor(rand()*13), y=1+Math.floor(rand()*13); P(g,x,y,spot[0]); P(g,x+1,y,spot[1]); P(g,x,y+1,spot[1]); } });
  const crystal = cols => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?cols[0]:d<3?cols[1]:cols[2]); } });
  const STONE = ["#7A7A80","#6E6E74","#85858C","#646469"];
  const T = {
    stone: noise(STONE), deep: noise(["#3A3A44","#45454F","#30303A","#4C4C56"], 8, ["#2A2A32"]),
    floor: noise(["#5A5046","#665A4F","#4E463E","#61564B"]),
    sbrick: bricks(["#8A8A92","#7C7C84","#95959C"], "#4E4E55"), chisel: rings(["#9A9AA2","#7C7C84","#8A8A92","#6E6E74"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    planks: planks(["#9A6E3E","#A87A48","#8A6236"], "#5A3E22"), log: stripes(["#5E4024","#6E4C2C","#4E361E"], true),
    iron: noise(["#B9BDC4","#A8ACB4","#C8CCD2"]), dark: noise(["#2A2A30","#34343A","#222228"]),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFD24A":v>.3?"#FF9A1E":v>-.6?"#FF6A0A":"#D9430A"); } }),
    glow: noise(["#FFD27A","#FFB84A","#FFE6A8","#F0A030"], 10, ["#A8642A"]),
    amethyst: crystal(["#E2C8FF","#B88AFF","#8A4FE8"]), emerald: crystal(["#C8FFE2","#4AF0A0","#18B868"]),
    sapphire: crystal(["#D2E6FF","#6AA8FF","#2A62E0"]), ruby: crystal(["#FFD2DA","#FF6A80","#D2203A"]),
    goldOre: ore(STONE, ["#FFD24A","#E8A81C"]), emOre: ore(STONE, ["#4AF0A0","#18B868"]), diaOre: ore(["#3A3A44","#45454F","#30303A"], ["#8AF0FF","#3FC8E8"]),
    woolR: noise(["#B8302A","#C83A32","#A8261F"]), woolB: noise(["#2F5DA8","#3A6AC0","#244E90"]),
    shroom: noise(["#5AF0FF","#8AF6FF","#2AC8E8"], 6, ["#E6FFFF"]), beard: noise(["#D8D2C8","#E8E2D8","#C8C2B8"])
  };
  const blocks = {
    stone:{side:T.stone}, deep:{side:T.deep}, floor:{side:T.floor}, sbrick:{side:T.sbrick}, chisel:{side:T.chisel, top:T.sbrick}, gold:{side:T.gold, em:.3},
    planks:{side:T.planks}, log:{side:T.log, top:T.planks}, iron:{side:T.iron}, dark:{side:T.dark}, lava:{side:T.lava, em:1.25, anim:[.1,.06]}, glow:{side:T.glow, em:1.3},
    amethyst:{side:T.amethyst, em:1.0}, emerald:{side:T.emerald, em:.9}, sapphire:{side:T.sapphire, em:1.0}, ruby:{side:T.ruby, em:.95},
    goldOre:{side:T.goldOre}, emOre:{side:T.emOre}, diaOre:{side:T.diaOre, em:.15}, woolR:{side:T.woolR}, woolB:{side:T.woolB}, shroom:{side:T.shroom, em:1.0}, beard:{side:T.beard}
  };
  const W=84, D=64, CEIL=34;
  const S = {
    grammar:   {x:42, z:14, r:12, col:0xFFD24A, ort:"Dwarven Great Hall"},
    vocabulary:{x:15, z:40, r:7,  col:0xB88AFF, ort:"Crystal Mine"},
    country:   {x:68, z:42, r:8,  col:0xFF8A3A, ort:"Forge Market"}
  };
  const near = (x,z,r) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);
  const lavaRiver = (x) => 34 + Math.sin(x*.12)*4;
  // Höhlenboden, Wände und Decke
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    let h = 4 + fbm(x*.1,z*.1)*2.5;
    const wallB = Math.max(0, (10 - z))*4, wallS = Math.max(0, Math.max(8 - x, x - (W-9)))*4.5 * (z<44 ? 1 : Math.max(0,1-(z-44)/14));
    h = Math.max(h, Math.min(CEIL+6, 4 + wallB + wallS + fbm(x*.2,z*.2)*6));
    if(Math.abs(z - lavaRiver(x)) < 1.6 && x>8 && x<W-9 && !near(x,z,1)) h = 2;
    h = Math.round(h);
    for(let y=0;y<h;y++){ let t = y===h-1 && h<=8 ? "floor" : (h>10 && rand()<.04 ? pick(["goldOre","emOre","diaOre"]) : (y<3 || rand()<.35 ? "deep" : "stone")); set(x,y,z,t); }
    if(h===2) set(x,2,z,"lava");
    // Decke über dem hinteren Teil
    if(z < 30){ const cy = CEIL + Math.floor(fbm(x*.15,z*.15)*3); fill(x,cy,z,x,cy+3,z, rand()<.3?"deep":"stone");
      if(rand()<.06 && z>12){ const len=2+Math.floor(rand()*6); for(let i=1;i<=len;i++) set(x,cy-i,z,"stone"); } }
  }
  for(const k in S) S[k].y = 5;
  for(const s of Object.values(S)){ for(let z=s.z-s.r; z<=s.z+s.r; z++) for(let x=s.x-s.r; x<=s.x+s.r; x++) if(Math.hypot(x-s.x,z-s.z)<=s.r && topAt(x,z,12)<9){ for(let y=1;y<12;y++) set(x,y,z,null); fill(x,0,z,x,4,z,"deep"); set(x,4,z,"floor"); } }
  // Säulen von Boden bis Decke
  for(const [px,pz] of [[28,22],[56,22],[30,8+4],[54,12]]){ const t=topAt(px,pz,12); for(let y=Math.max(4,t);y<CEIL;y++) disk(px,y,pz,1.4, (y%6===0)?"chisel":"sbrick"); }

  // Grammar: Große Zwergenhalle mit Tor und zwei Statuen
  { const {x,y,z} = S.grammar;
    fill(x-12,y,z-6,x+12,y,z+6,"sbrick");
    for(let s=0;s<4;s++) fill(x-5+s,y-s+3,z+7+s,x+5-s,y-s+3,z+7+s,null);
    for(let s=1;s<=3;s++) fill(x-5,y+1-s,z+6+s,x+5,y+1-s,z+6+s,"chisel");
    // Fassade
    for(let a=-11;a<=11;a++) for(let hh=1;hh<=24;hh++){ const arch = Math.abs(a)<=4 && (hh<=10 || Math.hypot(a, hh-10) < 4.6); if(arch) continue;
      set(x+a,y+hh,z-5, (hh%6===0)?"chisel": (Math.abs(a)===11||hh===24 ? "chisel" : "sbrick")); }
    for(let a=-11;a<=11;a++) set(x+a,y+25,z-5, a%2?"sbrick":"gold");
    for(let a=-4;a<=4;a++) for(let hh=1;hh<=14;hh++) if(Math.hypot(a,hh-10)<4.6 || hh<=10) set(x+a,y+hh,z-7,"dark");
    for(let hh=1;hh<=14;hh++){ const a = hh<=10 ? 5 : Math.round(Math.sqrt(Math.max(0,4.6**2-(hh-10)**2)))+1; set(x-a,y+hh,z-4,"gold"); set(x+a,y+hh,z-4,"gold"); }
    // Säulen mit Feuerschalen
    for(const a of [-9,-6,6,9]){ for(let hh=1;hh<=16;hh++) fill(x+a,y+hh,z-4,x+a,y+hh,z-3, hh%5===0?"chisel":"sbrick"); fill(x+a-1,y+17,z-4,x+a+1,y+17,z-2,"iron"); set(x+a,y+18,z-3,"glow"); }
    // Zwergen-Statuen
    const dwarf = (sx,sz) => { fill(sx-2,y+1,sz,sx-1,y+4,sz+1,"stone"); fill(sx+1,y+1,sz,sx+2,y+4,sz+1,"stone"); fill(sx-3,y+5,sz-1,sx+3,y+10,sz+2,"stone");
      fill(sx-2,y+6,sz+3,sx+2,y+10,sz+3,"beard"); fill(sx-1,y+5,sz+3,sx+1,y+5,sz+3,"beard");
      fill(sx-2,y+11,sz-1,sx+2,y+14,sz+2,"stone"); fill(sx-2,y+15,sz-1,sx+2,y+15,sz+2,"gold"); set(sx,y+16,sz,"gold"); set(sx-3,y+15,sz,"gold"); set(sx+3,y+15,sz,"gold");
      fill(sx+4,y+1,sz+1,sx+4,y+12,sz+1,"log"); fill(sx+3,y+12,sz+1,sx+6,y+14,sz+1,"iron"); };
    dwarf(x-16, z-2); dwarf(x+16, z-2);
    S.grammar.top=[x,y+27,z-4]; S.grammar.cam={dist:46, up:.32, lookY:y+10}; }

  // Vocabulary: Kristallmine mit Gleisen und Lore
  const cluster = (cx,cy,cz,t,n) => { for(let i=0;i<n;i++){ const ang=rand()*Math.PI*2, len=1+Math.floor(rand()*3), dx=Math.cos(ang)*.5, dz=Math.sin(ang)*.5;
      for(let k=0;k<len;k++) set(Math.round(cx+dx*k), cy+k, Math.round(cz+dz*k), t); } };
  { const {x,y,z} = S.vocabulary;
    // Stolleneingang in der linken Wand
    fill(x-8,y+1,z-3,x-5,y+7,z+3,"stone"); fill(x-8,y+1,z-2,x-5,y+5,z+2,null); fill(x-8,y+1,z-2,x-7,y+5,z+2,"dark");
    for(const b of [-3,3]) fill(x-4,y+1,z+b,x-4,y+6,z+b,"log"); fill(x-4,y+6,z-3,x-4,y+6,z+3,"log");
    for(let a=-6;a<=6;a++){ set(x+a,y,z,"iron"); if(a%2===0){ set(x+a,y,z-1,"planks"); set(x+a,y,z+1,"planks"); } }
    fill(x+1,y+1,z-1,x+3,y+2,z+1,"iron"); fill(x+2,y+2,z,x+2,y+2,z,null); set(x+1,y+3,z,"amethyst"); set(x+2,y+3,z-1,"emerald"); set(x+3,y+3,z+1,"sapphire"); set(x+2,y+3,z,"ruby");
    for(const [t,dx,dz] of [["amethyst",-3,-5],["emerald",4,-5],["sapphire",-2,5],["ruby",5,4],["amethyst",6,-1],["sapphire",-6,6]]) cluster(x+dx,y+1,z+dz,t,3);
    for(let i=0;i<5;i++){ set(x-6+i*3, y+1, z+6, "shroom"); }
    for(const [lx,lz] of [[x-3,z+3],[x+4,z-3]]){ fill(lx,y+1,lz,lx,y+4,lz,"log"); set(lx,y+5,lz,"glow"); }
    S.vocabulary.top=[x,y+10,z]; S.vocabulary.cam={dist:34, up:.5, side:-.1}; }

  // Country & people: Schmiede-Markt
  { const {x,y,z} = S.country;
    // Schmiede: Ofen mit Glut und Kamin
    fill(x-3,y+1,z-6,x+3,y+6,z-3,"sbrick"); fill(x-1,y+1,z-3,x+1,y+3,z-3,"lava"); fill(x-1,y+4,z-3,x+1,y+4,z-3,"glow");
    for(let hh=7;hh<CEIL-y;hh++) fill(x-1,y+hh,z-5,x+1,y+hh,z-4, hh%4===0?"chisel":"sbrick");
    // Ambosse
    for(const [ax,az] of [[x-3,z],[x+3,z]]){ set(ax,y+1,az,"dark"); fill(ax-1,y+2,az,ax+1,y+2,az,"dark"); set(ax-2,y+2,az,"dark"); }
    // Marktstände
    for(const [sx,sz,t] of [[x-5,z+4,"woolR"],[x+2,z+5,"woolB"]]){ for(const [a,b] of [[0,0],[3,0],[0,2],[3,2]]) fill(sx+a,y+1,sz+b,sx+a,y+3,sz+b,"log"); fill(sx,y+4,sz-1,sx+3,y+4,sz+3,t); fill(sx,y+1,sz,sx+3,y+1,sz+2,"planks"); set(sx+1,y+2,sz+1,"gold"); set(sx+2,y+2,sz+1,"ruby"); }
    for(const [bx,bz] of [[x+6,z-1],[x+7,z+1],[x-7,z-2]]) fill(bx,y+1,bz,bx,y+2,bz,"planks");
    S.country.top=[x,y+10,z]; S.country.cam={dist:32, up:.42}; }

  // Steinbrücke über den Lavafluss, Laternen, Stalagmiten, Kristalle
  for(const bx of [24,60]){ const bz=Math.round(lavaRiver(bx)); for(let b=-3;b<=3;b++){ fill(bx-1,4,bz+b,bx+1,4,bz+b,"sbrick"); } set(bx-2,5,bz-3,"sbrick"); set(bx+2,5,bz+3,"sbrick"); }
  for(let i=0;i<90;i++){ const x=8+Math.floor(rand()*(W-16)), z=12+Math.floor(rand()*(D-14)); if(near(x,z,2)) continue; const t=topAt(x,z,12)+1; if(t<4||t>9) continue;
    const r=rand(); if(r<.4){ const hh=1+Math.floor(rand()*4); for(let k=0;k<hh;k++) set(x,t+k,z,"stone"); }
    else if(r<.47) cluster(x,t,z,pick(["amethyst","emerald","sapphire","ruby"]),2);
    else if(r<.53) set(x,t,z,"shroom");
    else if(r<.57){ fill(x,t,z,x,t+3,z,"log"); set(x,t+4,z,"glow"); } }
  // Kristalle in den Wänden
  for(let i=0;i<90;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*36); const y=8+Math.floor(rand()*22); if(get(x,y,z) && !get(x,y,z+1)) cluster(x,y,z+1,pick(["amethyst","sapphire","emerald","ruby"]),2); }

  return {
    W, D, blocks, spots:S, exposure:1.25, fov:40,
    sky:[[0,"#05040A"],[.5,"#140E18"],[1,"#2A1A10"]], fog:[0x1A120E, 70, 170],
    hemi:[0xB8A8D8, 0x2A1A0E, 1.05], sun:{color:0xFFD8A8, int:1.0, pos:[30,60,110]}, bloom:[.6,.45,.8],
    lights:[{pos:[S.grammar.x,S.grammar.y+12,S.grammar.z+4], color:0xFFB84A, int:520, dist:42, flicker:true},
            {pos:[S.country.x,S.country.y+4,S.country.z-2], color:0xFF7A2A, int:320, dist:30, flicker:true},
            {pos:[S.vocabulary.x,S.vocabulary.y+5,S.vocabulary.z], color:0xB88AFF, int:260, dist:28},
            {pos:[W/2,8,34], color:0xFF6A1A, int:300, dist:40, flicker:true}],
    particles:[{n:420, area:[0,W,3,CEIL,0,D], vy:0, wob:.25, color:0xFFE6A8, size:.15, opacity:.8, add:true, twinkle:true},
               {n:220, area:[S.country.x-4,S.country.x+4,S.country.y+4,CEIL,S.country.z-6,S.country.z-2], vy:3, wob:.5, color:0xFF9A3A, size:.25, add:true}],
    home:{pos:[W/2,28,D+42], look:[W/2,12,D/2-8]}, homePortrait:{pos:[W/2,36,D+86], look:[W/2,12,D/2-8]},
    ui:{bg:"rgba(26,20,30,.9)", border:"#C9A6FF", glow:"rgba(184,138,255,.5)", text:"#F4EEFF", sub:"#C8BCD8", accent:"#FFC24A", "accent-ink":"#24180A", chip:"rgba(20,14,24,.82)"}
  };
}
