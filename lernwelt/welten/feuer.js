// Klasse 5 · Fire World – Vulkaninsel im Lavameer, ringsum glühende Vulkane, darüber kreist ein Drache
import { dragon } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, tex, P, noise, stripes, bricks, rings, topEdge, planks } = A;
  const T = {
    netherrack: noise(["#6E2424","#7E2C2A","#5A1C1E","#8E3A34","#6A2222"]),
    blackstone: noise(["#2B2630","#35303A","#221E26","#3E3842","#2E2933"]),
    basaltS: stripes(["#56555F","#47464F","#605F6A","#4C4B55"], true, "#3A3940"),
    basaltT: rings(["#5E5D68","#4E4D57","#666571","#44434C"]),
    obsidian: noise(["#140C22","#1E1330","#0E0818","#22163A"], 10, ["#5A3496","#7A4FC2"]),
    magma: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(["#4A140C","#5A1A10","#3E100A"]));
      for(let k=0;k<5;k++){ let x=Math.floor(rand()*16), y=Math.floor(rand()*16); for(let s=0;s<9;s++){ P(g,x,y,pick(["#FF7A1A","#FFA030","#FF5A10"])); x=(x+(rand()<.5?1:15))%16; y=(y+(rand()<.5?1:0))%16; } } }),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFD24A":v>.3?"#FF9A1E":v>-.6?"#FF6A0A":"#D9430A"); } }),
    lavaSea: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.7+y*.45)+Math.sin(y*.9-x*.4)+rand()*.5; P(g,x,y, v>1.5?"#FF9A1E":v>.9?"#E2530A":v>0?"#7A1E08":"#4A1006"); } }),
    glow: noise(["#F8D46A","#E8B848","#FFE89A","#FFD060"], 14, ["#A8742A"]),
    brick: bricks(["#3A1418","#46191D","#401619"], "#1E080A"),
    nylT: noise(["#8E1E2E","#A82838","#7A1626","#B83A44","#951F30"]),
    nylS: topEdge(["#6E2424","#7E2C2A","#5A1C1E","#8E3A34"], ["#8E1E2E","#A82838","#7A1626"], 3),
    stemS: stripes(["#5A1E36","#6E2644","#4A162C","#7A3050"], true, "#3A1022"),
    stemT: rings(["#B85A6A","#A04A5A","#5A1E36"]),
    wart: noise(["#8A0E14","#A0161C","#740A10","#B0242A","#960F18"]),
    shroom: noise(["#FFB04A","#FFD27A","#F0902A","#FFC25A"], 8, ["#FFF0B8"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    planks: planks(["#6A2A3A","#7A3244","#62263A"], "#3A1622"),
    shelf: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const band=y<2||y>13||y===7||y===8; P(g,x,y, band?pick(["#6A2A3A","#7A3244"]):(x%3===2?"#2A0E14":["#C8413A","#3E63DD","#E9A81C","#3FA34D","#7C5CFF"][((x/3|0)+(y>8?2:0))%5])); } }),
    soil: noise(["#4E3B32","#5C463B","#3E2E27","#55413A"]),
    iron: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,(x%4===0||y%4===0)?"#3A3A40":"rgba(0,0,0,0)"); }), woolR: noise(["#C8302A","#D63A32","#B8261F"]), woolY: noise(["#F2C230","#FFD24A","#E0AE20"]), woolW: noise(["#F2EBE2","#FFFFFF","#E4DCD2"])
  };
  const blocks = {
    netherrack:{side:T.netherrack}, blackstone:{side:T.blackstone}, basalt:{side:T.basaltS, top:T.basaltT}, obsidian:{side:T.obsidian},
    magma:{side:T.magma, em:.9}, lava:{side:T.lava, em:1.25, anim:[.11,.07]}, glow:{side:T.glow, em:1.15}, brick:{side:T.brick},
    nylium:{side:T.nylS, top:T.nylT, bottom:T.netherrack}, stem:{side:T.stemS, top:T.stemT}, wart:{side:T.wart}, shroom:{side:T.shroom, em:1.1},
    gold:{side:T.gold, em:.15}, planks:{side:T.planks}, shelf:{side:T.shelf, top:T.planks}, soil:{side:T.soil},
    woolR:{side:T.woolR}, iron:{side:T.iron, alpha:.95, cross:true}, woolY:{side:T.woolY}, woolW:{side:T.woolW}
  };
  const W=96, D=72, LL=3, VX=48, VZ=13;
  const S = {
    grammar:   {x:48, z:45, r:7, col:0xB56CFF, ort:"Ember Fortress"},
    vocabulary:{x:20, z:40, r:6, col:0xFF4A6A, ort:"Crimson Woods"},
    country:   {x:74, z:50, r:6, col:0xFFE14A, ort:"Ember Market"}
  };
  const deco = { library:{x:30,z:24,r:4}, falls:{x:70,z:26,r:5}, arena:{x:28,z:58,r:5} };
  const all = Object.values(S).concat(Object.values(deco));
  const Hm = [];
  for(let z=0; z<D; z++){ Hm.push([]); for(let x=0; x<W; x++){
    const dx=(x-W/2)/(W*.47), dz=(z-D*.52)/(D*.47), d=Math.sqrt(dx*dx+dz*dz) - (fbm(x*.07,z*.07)-.5)*.35;
    let h = d<1 ? 4 + (1-d)*4.5 + fbm(x*.11+3,z*.11)*3.5 : 1;
    const vr = Math.hypot(x-VX,(z-VZ)*1.15), vh = 44 - vr*2.2 + fbm(x*.3,z*.3)*2.5; if(vh>h) h=vh; if(vr<4.5) h=Math.min(h,35);
    Hm[z].push(Math.max(1, Math.round(h))); } }
  const flows = [[[VX-2,VZ+8],[40,26],[14,32],[4,40]], [[VX+3,VZ+8],[58,28],[86,34],[94,42]]];
  const near = (x,z,r) => all.some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);
  const isLava = new Set();
  for(const path of flows) for(let i=0;i<path.length-1;i++){ const a=path[i], b=path[i+1], n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2);
    for(let s=0;s<=n;s++){ const t=s/n, cx=a[0]+(b[0]-a[0])*t+Math.sin(s*.5+i)*1.2, cz=a[1]+(b[1]-a[1])*t;
      for(let ox=-1.6;ox<=1.6;ox+=.5) for(let oz=-1.6;oz<=1.6;oz+=.5){ const x=Math.round(cx+ox), z=Math.round(cz+oz);
        if(x<0||z<0||x>=W||z>=D||near(x,z,1.5)) continue; if(Hm[z][x]<14){ Hm[z][x]=Math.min(Hm[z][x],LL); isLava.add(x+","+z); } } } }
  for(const s of all){ const lvl = Math.max(6, Math.min(9, Hm[s.z][s.x]));
    for(let z=s.z-s.r-1; z<=s.z+s.r+1; z++) for(let x=s.x-s.r-1; x<=s.x+s.r+1; x++) if(Hm[z]&&Hm[z][x]!==undefined&&Math.hypot(x-s.x,z-s.z)<=s.r+1.5) Hm[z][x]=lvl; s.y=lvl; }
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    const h=Hm[z][x], biome = x<36?"crimson":x>62?"basalt":"black", volcano = Math.hypot(x-VX,(z-VZ)*1.15)<18 && h>10;
    for(let y=0;y<h;y++){ let t;
      if(volcano) t = y>h-2 ? (rand()<.04?"magma":"blackstone") : (rand()<.15?"basalt":"blackstone");
      else if(y===h-1) t = biome==="crimson" ? "nylium" : biome==="basalt" ? (rand()<.15?"magma":"basalt") : (rand()<.08?"magma":rand()<.3?"soil":"blackstone");
      else t = biome==="basalt" ? "basalt" : "netherrack";
      set(x,y,z,t); }
    if(h<=LL && isLava.has(x+","+z)) set(x,LL-1,z,"lava"); }
  for(let z=VZ-5; z<=VZ+5; z++) for(let x=VX-5; x<=VX+5; x++) if(Math.hypot(x-VX,(z-VZ)*1.15)<4.2){ for(let y=32;y<46;y++) set(x,y,z,null); set(x,32,z,"lava"); }
  for(const path of flows.concat([[[VX-14,VZ+6]],[[VX+14,VZ+4]],[[VX,VZ+16]]])){ const a=[VX,VZ], b=path[0];
    for(let s=0;s<=18;s++){ const t=s/18, x=Math.round(a[0]+(b[0]-a[0])*t), z=Math.round(a[1]+(b[1]-a[1])*t+t*3); const top=A.topAt(x,z,50); if(top>LL) set(x,top,z,"lava"); } }

  // Grammar: Glut-Festung
  { const {x,y,z} = S.grammar;
    fill(x-6,y,z-6,x+6,y,z+6,"brick");
    for(let a=-6;a<=6;a++) for(let b=-6;b<=6;b++){ if(Math.abs(a)!==6&&Math.abs(b)!==6) continue; if(b===6&&Math.abs(a)<=1) continue;
      fill(x+a,y+1,z+b,x+a,y+5,z+b,"brick"); if((a+b)%2===0) set(x+a,y+6,z+b,"brick"); if((Math.abs(a)===6?b:a)%4===2) set(x+a,y+3,z+b,"glow"); }
    for(const [a,b] of [[-6,-6],[6,-6],[-6,6],[6,6]]){ fill(x+a-1,y+1,z+b-1,x+a+1,y+11,z+b+1,"brick"); for(const [c,d] of [[-1,-1],[1,-1],[-1,1],[1,1]]) set(x+a+c,y+12,z+b+d,"brick"); set(x+a,y+12,z+b,"glow"); set(x+a,y+8,z+b+2,"glow"); }
    fill(x-2,y+1,z-2,x+2,y+15,z+2,"brick"); fill(x-3,y+15,z-3,x+3,y+15,z+3,"brick");
    for(let a=-3;a<=3;a++) for(let b=-3;b<=3;b++) if((Math.abs(a)===3||Math.abs(b)===3)&&(a+b)%2===0) set(x+a,y+16,z+b,"brick");
    for(const hh of [5,9,13]){ set(x,y+hh,z+3,"glow"); set(x-3,y+hh,z,"glow"); set(x+3,y+hh,z,"glow"); }
    fill(x-1,y+1,z+3,x+1,y+3,z+3,null); set(x,y+16,z,"gold"); set(x,y+17,z,"gold"); set(x,y+18,z,"glow");
    fill(x-1,y,z+7,x+1,y,z+12,"brick"); for(let b=7;b<=12;b+=2){ set(x-2,y+1,z+b,"brick"); set(x+2,y+1,z+b,"brick"); }
    S.grammar.top=[x,y+19,z]; }
  // Vocabulary: Purpurwald mit Riesenpilzen
  const fungus = (x,y,z,hh,r) => { fill(x,y,z,x+(r>3?1:0),y+hh,z+(r>3?1:0),"stem");
    for(let a=-r;a<=r+1;a++) for(let b=-r;b<=r+1;b++){ const d=Math.hypot(a-.5,b-.5); if(d<=r+.4){ set(x+a,y+hh+1,z+b,"wart"); if(d<r-.6) set(x+a,y+hh+2,z+b,"wart"); if(d<r-1.8) set(x+a,y+hh+3,z+b,"wart"); }
      if(d>r-.8&&d<=r+.4&&rand()<.35) set(x+a,y+hh,z+b, rand()<.4?"shroom":"wart"); } };
  { const {x,y,z} = S.vocabulary; fungus(x,y,z,10,5); fungus(x-6,y,z+4,5,2); fungus(x+6,y,z+3,6,2); fungus(x+2,y,z-6,4,2); S.vocabulary.top=[x,y+15,z]; }
  // Country & people: Glut-Markt
  { const {x,y,z} = S.country;
    const tent = (cx,cz,t) => { for(let hh=0;hh<4;hh++) for(let a=-(3-hh);a<=3-hh;a++) fill(cx+a,y+hh,cz-2,cx+a,y+hh,cz+2,t); fill(cx,y,cz+2,cx,y+1,cz+2,null); };
    tent(x-3,z-2,"woolR"); tent(x+3,z-2,"woolY");
    for(const [a,b,t] of [[-3,3,"woolW"],[2,3,"woolR"]]){ fill(x+a,y,z+b,x+a,y+2,z+b,"planks"); fill(x+a+2,y,z+b,x+a+2,y+2,z+b,"planks"); fill(x+a,y+3,z+b-1,x+a+2,y+3,z+b+1,t); set(x+a+1,y,z+b,"gold"); }
    for(const [a,b] of [[-6,6],[6,6],[-6,-5],[6,-5]]){ fill(x+a,y,z+b,x+a,y+5,z+b,"planks"); set(x+a,y+6,z+b,"glow"); }
    S.country.top=[x,y+8,z]; }
  // Deko: Bibliotheksturm, Lavafall, Arena
  { const {x,y,z} = deco.library; for(let hh=0;hh<11;hh++) for(let a=-3;a<=3;a++) for(let b=-3;b<=3;b++){ if(Math.abs(a)!==3&&Math.abs(b)!==3) continue; set(x+a,y+hh,z+b, (Math.abs(a)===3&&Math.abs(b)===3)?"blackstone":(hh%4===0?"blackstone":"shelf")); }
    for(let s=0;s<4;s++) fill(x-3+s,y+11+s,z-3+s,x+3-s,y+11+s,z+3-s, s%2?"brick":"blackstone"); set(x,y+15,z,"glow"); }
  { const {x,y,z} = deco.falls; for(let a=-5;a<=5;a++) for(let b=-5;b<=-2;b++){ const hh=12+Math.floor(fbm(a*.5,b*.5)*4); fill(x+a,y,z+b,x+a,y+hh,z+b,"basalt"); }
    for(let hh=0;hh<13;hh++) fill(x-1,y+hh,z-1,x+1,y+hh,z-1,"lava"); fill(x-2,y,z,x+2,y,z+2,"lava"); }
  { const {x,y,z} = deco.arena; for(let a=-5;a<=5;a++) for(let b=-5;b<=5;b++){ const d=Math.hypot(a,b); if(d>2.5&&d<5.5){ const hh=Math.floor(d-2.5); fill(x+a,y,z+b,x+a,y+hh,z+b, hh%2?"blackstone":"brick"); } } set(x,y,z,"glow"); }
  for(let i=0;i<150;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D), h=Hm[z][x]; if(h<=LL||h>11||near(x,z,2.5)||isLava.has(x+","+z)) continue;
    if(x>60&&rand()<.7) fill(x,h,z,x,h+1+Math.floor(rand()*6),z,"basalt"); else if(x<36){ if(rand()<.5) fungus(x,h,z,3+Math.floor(rand()*3),1); else set(x,h,z,"wart"); }
    else if(rand()<.4) set(x,h,z,"magma"); else fill(x,h,z,x,h+Math.floor(rand()*3),z,"blackstone"); }
  for(const [fx,fz,fy,r] of [[14,14,26,4],[84,12,30,3],[92,28,22,2]]){
    for(let a=-r;a<=r;a++) for(let b=-r;b<=r;b++){ const d=Math.hypot(a,b); if(d>r+.3) continue; const dep=Math.max(1,Math.round((r-d)*1.4)); fill(fx+a,fy-dep,fz+b,fx+a,fy,fz+b,"blackstone"); set(fx+a,fy,fz+b, rand()<.25?"magma":"blackstone"); }
    set(fx,fy+1,fz,"glow"); }
  // mehr Details: Banner und Fallgitter an der Festung, Kohlebecken, Waren auf dem Markt
  { const {x,y,z} = S.grammar;
    for(const a of [-4,4]){ fill(x+a,y+9,z+3,x+a,y+13,z+3,"woolR"); set(x+a,y+11,z+3,"woolY"); set(x+a,y+14,z+3,"gold"); }
    for(const a of [-6,6]){ fill(x+a,y+7,z+7,x+a,y+10,z+7,"woolR"); set(x+a,y+8,z+7,"gold"); }
    for(let a=-1;a<=1;a++) set(x+a,y+3,z+6, "iron"); fill(x-1,y+4,z+6,x+1,y+4,z+6,"iron");
    for(const a of [-3,3]){ set(x+a,y+1,z+13,"blackstone"); set(x+a,y+2,z+13,"magma"); set(x+a,y+3,z+13,"glow"); } }
  { const {x,y,z} = S.country;
    for(const [a,b,t] of [[-5,1,"gold"],[-4,1,"woolY"],[4,1,"woolR"],[5,2,"gold"],[0,5,"planks"],[1,5,"planks"],[0,6,"planks"],[-1,-6,"planks"],[0,-6,"gold"]]) set(x+a,y,z+b,t);
    for(const [a,b] of [[-3,4],[3,4]]){ fill(x+a,y,z+b,x+a,y+1,z+b,"planks"); set(x+a,y+2,z+b,"shroom"); } }
  for(const k in S){ S[k].base = S[k].y; }

  // Landschaft bis zum Horizont: Vulkane mit glühenden Kratern, Felsinseln im Lavameer
  const F = A.far; F.cell = 3;
  const volcs = [[-74,-58,34,46],[172,-62,34,50],[48,-124,52,112],[-120,-10,30,44],[218,-10,30,48],[-74,-132,34,68],[172,-142,34,74],[-170,-70,30,52],[262,-80,34,58]];
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const fh = (x,z) => { const m = Math.min(1, Math.max(0,(away(x,z)-28)/40)); let h = LL-4 + (fbm(x*.03+7,z*.03)-.5)*44*m;
    for(const [vx,vz,r,ph] of volcs){ const d=Math.hypot(x-vx,z-vz); if(d<r){ const v = d<r*.2 ? ph*.8 : ph*Math.pow(1-d/r,1.15); if(v>h) h=v; } }
    return h; };
  const inCrater = (x,z) => volcs.some(([vx,vz,r])=>Math.hypot(x-vx,z-vz)<r*.2);
  const nearCrater = (x,z) => volcs.some(([vx,vz,r])=>{ const d=Math.hypot(x-vx,z-vz); return d>=r*.2 && d<r*.25; });
  const lavaStreak = (x,z) => volcs.some(([vx,vz,r])=>{ const d=Math.hypot(x-vx,z-vz); if(d>r*.95) return false; const a=Math.atan2(z-vz,x-vx)*6+vx; return d<r*.75 && Math.abs(Math.sin(a+d*.06))>.992; });
  A.farTerrain({ x0:-260, x1:W+260, z0:-260, z1:D+70, base:0,
    skip:(x,z)=> (x>-6 && x<W+6 && z>-6 && z<D+90) || fh(x,z) < LL+1,
    h: fh,
    top:(x,z,y,hc)=> inCrater(x,z) ? "lava" : nearCrater(x,z) ? "magma" : lavaStreak(x,z) ? "lava" : (rand()<.7 ? "blackstone" : "basalt"),
    fill:(x,z,y,hc)=> lavaStreak(x,z) && y>=hc-2 ? "magma" : (y%3===0 ? "basalt" : "blackstone") });
  S.grammar.cam = {dist:38}; S.vocabulary.cam = {dist:30}; S.country.cam = {dist:28};
  return {
    W, D, blocks, spots:S, exposure:1.15,
    sky:[[0,"#1E0404"],[.35,"#6A1608"],[.55,"#C2460F"],[.7,"#F08A30"],[1,"#7A1C0A"]], fog:[0x6A1E0A,90,340],
    hemi:[0xFFC8A0, 0x5A1A0E, 1.7], sun:{color:0xFFC890, int:2.0, pos:[-50,80,60]}, bloom:[.55,.4,.86],
    lights:[{pos:[VX,40,VZ], color:0xFF6A1A, int:850, dist:60, flicker:true}, {pos:[S.grammar.x,S.grammar.y+5,S.grammar.z+3], color:0xFF8A3A, int:160, dist:22}, {pos:[S.country.x,S.country.y+5,S.country.z], color:0xFF8A3A, int:120, dist:20}],
    planes:[{y:LL-.02, tex:T.lavaSea, repeat:450, size:900, em:.9, anim:[.033,.022]}],
    particles:[{n:900, area:[0,W,LL,42,0,D], vy:2.4, wob:.6, color:0xFF9A3A, size:.32, add:true}, {n:500, area:[-120,W+120,LL,90,-150,0], vy:3, wob:1, color:0xFF8A2A, size:.9, add:true, soft:true}],
    puffs:[{n:14, pos:[VX,36,VZ], dx:8, dy:22, dz:-4, s0:4, s1:14, color:0x5A5050, opacity:.55, speed:.05},
           {n:12, pos:[48,96,-120], dx:30, dy:60, dz:-10, s0:16, s1:40, color:0x4A3A36, opacity:.5, speed:.03, spread:8},
           {n:10, pos:[146,60,-40], dx:-20, dy:50, dz:-10, s0:12, s1:34, color:0x4A3A36, opacity:.45, speed:.035, spread:6},
           {n:10, pos:[-46,52,-26], dx:20, dy:46, dz:-10, s0:12, s1:30, color:0x4A3A36, opacity:.45, speed:.035, spread:6},
           {n:8, pos:[48,96,-120], dx:0, dy:6, dz:0, s0:22, s1:10, color:0xFF6A1A, opacity:.35, speed:.05, spread:4, add:true}],
    creatures:[{ ...dragon(), orbit:{c:[48,40,14], r:[50,26], speed:.16, ph:1.2, bob:2.5, bank:-.28} }],
    home:{pos:[W/2+4,54,D+66], look:[W/2,15,D/2-6]}, homePortrait:{pos:[W/2+4,84,D+116], look:[W/2,10,D/2-6]},
    ui:{bg:"rgba(34,8,4,.9)", border:"#FF9A4A", glow:"rgba(255,110,30,.55)", text:"#FFF1E2", sub:"#E8B48C", accent:"#FFB23A", "accent-ink":"#2A0A04", chip:"rgba(30,8,4,.8)"}
  };
}
