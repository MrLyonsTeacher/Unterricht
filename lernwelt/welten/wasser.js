// Klasse 6 · Water World – Unterwasser-Königreich mit Korallen, Kelp und Schiffswrack; ringsum Meeresboden mit Felsen, Bögen und einem großen Wrack
import { whale, fish, jelly } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, line, topAt, tex, P, noise, stripes, bricks, rings, planks, glassT } = A;
  const T = {
    sand: noise(["#E7D7A2","#DCCB92","#EFE2B4","#D4C083","#E2D19B"]),
    sandstone: stripes(["#D9C28A","#CDB57C","#E2CC96"], false),
    rock: noise(["#5E6F7A","#6B7C86","#53636D","#61727D"]),
    prism: noise(["#5FB3A2","#4FA595","#6DC1AE","#3E8F82"]),
    pbrick: bricks(["#6FC3B0","#5FB3A2","#7ACCB8"], "#3E8F82"),
    dark: noise(["#2E5E57","#264F49","#356A62"]),
    lantern: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const e=x<2||y<2||x>13||y>13; P(g,x,y, e?pick(["#8EDCE0","#A6E6EA"]):pick(["#F2FFFF","#DFFAFF","#FFFFFF"])); } }),
    glass: glassT("#CFF6FF","#8FDCF0"),
    coralP: noise(["#FF6FA0","#FF8AB3","#E85A8C","#FF9DC0"]), coralO: noise(["#FF8A3A","#FFA15A","#E8742A"]),
    coralV: noise(["#9A6CFF","#B08AFF","#7F52E8"]), coralY: noise(["#FFD23F","#FFE06A","#E8BC2A"]), coralB: noise(["#3FA0FF","#5AB4FF","#2A86E8"]),
    kelp: stripes(["#2F7A3A","#3A8F45","#27693A","#45A050"], true),
    planks: planks(["#7A5A3A","#866444","#6E5032"], "#4A3420"),
    sail: noise(["#E8E4D8","#DAD5C6","#F2EFE6"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    pearl: noise(["#FFFFFF","#F2F6FF","#E6EEFF"]),
    shell: noise(["#F2D5C8","#E8C2B4","#FBE6DC","#EFCBBE"]),
    iron: noise(["#6A6E74","#5E6268","#767A80"]),
    surface: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.8+y*.3)+Math.sin(y*.7-x*.5); P(g,x,y, v>1?"#BFF4FF":v>0?"#6FD3F0":"#3FB0DD"); } })
  };
  const blocks = {
    sand:{side:T.sand}, sandstone:{side:T.sandstone, top:T.sand}, rock:{side:T.rock}, prism:{side:T.prism}, pbrick:{side:T.pbrick}, dark:{side:T.dark},
    lantern:{side:T.lantern, em:.75}, glass:{side:T.glass, alpha:.24}, coralP:{side:T.coralP, em:.12}, coralO:{side:T.coralO, em:.12}, coralV:{side:T.coralV, em:.18},
    coralY:{side:T.coralY, em:.12}, coralB:{side:T.coralB, em:.15}, kelp:{side:T.kelp}, planks:{side:T.planks}, sail:{side:T.sail}, gold:{side:T.gold, em:.35},
    pearl:{side:T.pearl, em:1.3}, shell:{side:T.shell}, iron:{side:T.iron}
  };
  const W=88, D=66;
  const S = {
    grammar:   {x:44, z:28, r:10, col:0x7FE3FF, ort:"Coral Palace"},
    vocabulary:{x:17, z:42, r:7,  col:0x7CFF9A, ort:"Kelp Garden"},
    country:   {x:70, z:45, r:8,  col:0xFFC44A, ort:"Sunken Ship"}
  };
  const near = (x,z,r) => Object.values(S).some(s=>Math.hypot(s.x-x,s.z-z) < s.r + r);
  // Meeresboden mit Dünen, hinten Felsklippen
  A.terrain(W, D, (x,z) => {
    let h = 4 + fbm(x*.08,z*.08)*4;
    const back = Math.max(0, 1 - z/(D*.32)); h += back * (6 + fbm(x*.15+5,z*.15)*14);
    const side = Math.max(0, Math.abs(x-W/2)/(W/2) - .78) * 30; h += side * (.6+fbm(x*.2,z*.2));
    for(const s of Object.values(S)){ const d=Math.hypot(x-s.x,z-s.z); if(d < s.r+2) h = 5 + (d>s.r ? (d-s.r)*.8 : 0); }
    return Math.max(1,h); },
    (x,y,z,h) => y===h-1 ? (h>9 ? pick(["rock","rock","prism"]) : "sand") : (y>h-3 && h<=9 ? "sandstone" : pick(["rock","rock","dark"])));
  for(const k in S) S[k].y = 5;

  // Grammar: Korallenpalast mit Glaskuppeln
  { const {x,y,z} = S.grammar;
    disk(x,y,z,9.5,"pbrick"); ring(x,y+1,z,9.5,"prism");
    tube(x,y+1,z,7,5,(xx,yy,zz)=> (yy===y+3 && (xx+zz)%3===0) ? "glass" : "pbrick");
    ring(x,y+6,z,7,(xx,yy,zz)=> (xx+zz)%2 ? "pbrick" : "lantern");
    cyl(x,y+1,z,3,15,(xx,yy,zz)=> (yy-y)%4===0 ? "lantern" : "pbrick");
    dome(x,y+16,z,4.5,"glass",true); set(x,y+21,z,"lantern"); set(x,y+22,z,"gold");
    for(const [a,b] of [[-7,-7],[7,-7],[-7,7],[7,7]]){ cyl(x+a,y+1,z+b,2,10,(xx,yy,zz)=>(yy-y)%3===0?"lantern":"prism"); dome(x+a,y+11,z+b,2.6,"glass",true); set(x+a,y+14,z+b,"gold"); }
    fill(x-1,y+1,z+7,x+1,y+4,z+7,null); fill(x-2,y+5,z+7,x+2,y+5,z+7,"lantern");
    for(let b=8;b<=13;b++){ set(x-2,y,z+b,"pbrick"); set(x+2,y,z+b,"pbrick"); fill(x-1,y,z+b,x+1,y,z+b,"prism"); if(b%2===0){ set(x-3,y+1,z+b,"prism"); set(x-3,y+2,z+b,"lantern"); set(x+3,y+1,z+b,"prism"); set(x+3,y+2,z+b,"lantern"); } }
    S.grammar.top=[x,y+23,z]; S.grammar.cam={dist:48, up:.42}; }

  // Vocabulary: Kelpgarten mit Riesenmuschel und Korallen
  const coral = (x,y,z,t,kind) => { if(kind===0){ ball(x,y+1,z,1.6,t); } else if(kind===1){ for(let i=0;i<4;i++){ line(x,y,z,x+Math.round(Math.cos(i*1.6)*2),y+3+i%2,z+Math.round(Math.sin(i*1.6)*2),t); } }
    else { for(let a=-2;a<=2;a++) for(let hh=0;hh<4-Math.abs(a);hh++) set(x+a,y+hh,z,t); } };
  const kelp = (x,y,z,hh) => { let cx=x, cz=z; for(let i=0;i<hh;i++){ set(cx,y+i,cz,"kelp"); if(i%4===3) cx += rand()<.5?1:-1; } };
  { const {x,y,z} = S.vocabulary;
    // Muschel: zwei Halbschalen, Perle in der Mitte
    for(let a=-4;a<=4;a++) for(let b=-3;b<=3;b++){ const d=Math.hypot(a/4,b/3); if(d<=1){ set(x+a,y,z+b,"shell"); if(d>.75) set(x+a,y+1,z+b,"shell"); } }
    for(let a=-4;a<=4;a++) for(let hh=1;hh<=6;hh++){ const d=Math.hypot(a/4,(hh-1)/5); if(d<=1 && d>.72) set(x+a,y+hh,z-3,"shell"); }
    ball(x,y+2,z,1.3,"pearl");
    for(let i=0;i<18;i++){ const a=rand()*Math.PI*2, r=3.5+rand()*3.5; kelp(Math.round(x+Math.cos(a)*r), y, Math.round(z+Math.sin(a)*r*0.8), 7+Math.floor(rand()*11)); }
    const cols=["coralP","coralO","coralV","coralY","coralB"];
    for(let i=0;i<10;i++){ const a=rand()*Math.PI*2, r=4+rand()*4; coral(Math.round(x+Math.cos(a)*r), y, Math.round(z+Math.sin(a)*r), pick(cols), i%3); }
    S.vocabulary.top=[x,y+12,z]; S.vocabulary.cam={dist:30, up:.45}; }

  // Country & people: gesunkenes Schiff mit Schatz
  { const {x,y,z} = S.country, L=9;
    for(let a=-L;a<=L;a++){ const w = Math.round(3.2*Math.sqrt(1-(a/(L+1))**2));
      for(let b=-w;b<=w;b++){ set(x+a,y,z+b,"planks"); }
      for(let hh=1;hh<=4;hh++){ const ww=Math.round((w)*(1+hh*.08)); set(x+a,y+hh,z-ww,"planks"); set(x+a,y+hh,z+ww,"planks"); }
      if(Math.abs(a)>=L-1) for(let b=-w;b<=w;b++) for(let hh=1;hh<=4;hh++) set(x+a,y+hh,z+b,"planks"); }
    for(let a=-L+2;a<=L-2;a++) if(a%3!==0) fill(x+a,y+4,z-2,x+a,y+4,z+2,"planks");
    fill(x-L-1,y+3,z,x-L-3,y+5,z,"planks");
    for(let hh=1;hh<12;hh++) set(x-2,y+hh,z,"planks"); line(x-2,y+12,z,x+3,y+16,z+1,"planks");
    for(let hh=6;hh<11;hh++) for(let b=1;b<=(11-hh)+1;b++) if(rand()<.8) set(x-2,y+hh,z+b,"sail");
    fill(x+4,y+1,z-1,x+5,y+2,z,"planks"); set(x+4,y+3,z-1,"gold"); set(x+5,y+3,z,"gold");
    for(let i=0;i<8;i++) set(x+3+Math.floor(rand()*5), y+1, z-2+Math.floor(rand()*4), "gold");
    // Anker
    const ax=x+12, az=z+3; for(let hh=0;hh<6;hh++) set(ax,y+hh,az,"iron"); fill(ax-2,y+5,az,ax+2,y+5,az,"iron"); set(ax-2,y+1,az,"iron"); set(ax+2,y+1,az,"iron"); fill(ax-1,y,az,ax+1,y,az,"iron");
    S.country.top=[x,y+17,z]; S.country.cam={dist:32, up:.42}; }

  // Deko: Ruinen, Korallen, Seegras, Laternen, Seesterne
  for(let i=0;i<220;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D); if(near(x,z,2)) continue; const t=topAt(x,z,60)+1; if(t<2||t>12) continue;
    const r=rand();
    if(r<.35) set(x,t,z,"kelp"), (rand()<.6 && set(x,t+1,z,"kelp"));
    else if(r<.6) coral(x,t,z,pick(["coralP","coralO","coralV","coralY","coralB"]), Math.floor(rand()*3));
    else if(r<.67){ const hh=2+Math.floor(rand()*6); for(let k=0;k<hh;k++) set(x,t+k,z, k===hh-1 && rand()<.5 ? "lantern" : "prism"); }
    else if(r<.75) set(x,t,z,"coralO");
    else if(r<.85) kelp(x,t,z,5+Math.floor(rand()*9)); }
  // eingestürzte Bögen
  for(const [bx,bz] of [[30,52],[56,56],[8,24]]){ const t=topAt(bx,bz,60)+1; fill(bx,t,bz,bx,t+6,bz,"pbrick"); fill(bx+5,t,bz,bx+5,t+4,bz,"pbrick"); fill(bx,t+6,bz,bx+3,t+6,bz,"pbrick"); set(bx,t+7,bz,"lantern"); }

  // Großes Wrack (Galeone, zerbrochen) links hinten außerhalb der Lernwelt
  { const gx=-30, gz=16, gy=3, L=17;
    for(let a=-L;a<=L;a++){ if(a>3 && a<7) continue; const w=Math.round(5*Math.sqrt(Math.max(0,1-(a/(L+1))**2)));
      const tilt = a>5 ? 2 : 0;
      for(let hh=0;hh<=8;hh++){ const ww=Math.round(w*(.55+hh*.06)); for(let b=-ww;b<=ww;b++){ if(hh===0 || Math.abs(b)===ww) set(gx+a,gy+hh+tilt,gz+b, hh===5?"iron":"planks"); } }
      if(Math.abs(a)>L-2) for(let b=-w;b<=w;b++) for(let hh=1;hh<=8;hh++) if(rand()<.85) set(gx+a,gy+hh,gz+b,"planks");
      if(a%3===0 && a<3) fill(gx+a,gy+8,gz-w,gx+a,gy+8,gz+w,"planks"); }
    for(let a=-L+2;a<L-2;a+=5) for(const b of [-1,1]) if(a<3||a>7) set(gx+a,gy+5,gz+b*Math.round(5*Math.sqrt(Math.max(0,1-(a/(L+1))**2))*.85),"dark"); // Kanonenluken
    for(let hh=0;hh<16;hh++) set(gx-6,gy+9+hh,gz,"planks"); fill(gx-6,gy+20,gz-5,gx-6,gy+20,gz+5,"planks");
    for(let hh=0;hh<8;hh++) for(let b=-4;b<=4;b++) if(rand()<.6) set(gx-5,gy+12+hh,gz+b,"sail");
    line(gx+12,gy+9,gz,gx+24,gy+2,gz+3,"planks"); line(gx+12,gy+10,gz,gx+24,gy+3,gz+3,"planks");            // umgestürzter Mast
    fill(gx-L-2,gy+5,gz,gx-L-5,gy+7,gz,"planks"); set(gx-L-6,gy+6,gz,"gold");                            // Bugspriet mit Galionsfigur
    for(let i=0;i<14;i++) set(gx-10+Math.floor(rand()*18), gy+1, gz-3+Math.floor(rand()*6), rand()<.5?"gold":"pearl");
    for(let i=0;i<30;i++){ const x=gx-L+Math.floor(rand()*L*2), z=gz-5+Math.floor(rand()*10), t=topAt(x,z,40)+1; if(t>2) set(x,t,z,pick(["coralP","coralO","coralY","kelp","kelp"])); } }

  // Landschaft bis zum Horizont: Dünen, Felsrücken, Felsbögen, Kelpwälder
  const F = A.far; F.cell = 3;
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const fh = (x,z) => { const m=Math.min(1,Math.max(0,(away(x,z)-4)/30)); let h = 4.5 + fbm(x*.05,z*.05)*3;
    const ridge = Math.max(0, fbm(x*.022+11,z*.022+4)-.52)*95*m; h += ridge;
    if(z<0) h += Math.min(14, -z*.12) * (.5+fbm(x*.04,z*.04)); return h; };
  A.farTerrain({ x0:-150, x1:W+150, z0:-180, z1:D+90, base:1,
    skip:(x,z)=> (x>-1 && x<W+1 && z>-1 && z<D+1) || (x>-52 && x<-6 && z>-2 && z<34) || fh(x,z) < 7,
    h: fh,
    top:(x,z,y,hc)=> y*3>14 ? (rand()<.25?"prism":"rock") : (rand()<.03 ? "rock" : "sand"),
    fill:(x,z,y,hc)=> y*3>10 ? (rand()<.3?"dark":"rock") : "sandstone" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/3),Math.floor(y/3),Math.floor(z/3),t);
  // Felsbogen rechts hinten, Felsnadel hinten, Säulenruinen
  { const cx=124, cz=-6, cy=4; for(let a=0;a<=Math.PI;a+=.04){ const x=cx+Math.cos(a)*22, y=cy+Math.sin(a)*30; for(let k=-2;k<=2;k++) for(let t=-3;t<=3;t+=3) fset(x+t,y,cz+k*3, (k+t)%3?"rock":"prism"); } }
  { const cx=30, cz=-48; for(let y=0;y<70;y+=3){ const r=12*(1-y/80)+fbm(y*.1,3)*3; for(let a=-r;a<=r;a+=3) for(let b=-r;b<=r;b+=3) if(a*a+b*b<=r*r) fset(cx+a,y,cz+b, y>50?"prism":"rock"); } }
  for(const [cx,cz,hh] of [[104,48,26],[112,58,18],[100,64,30],[-20,60,22],[-30,48,14]]){ for(let y=4;y<hh;y+=3) fset(cx,y,cz,"pbrick"); fset(cx,hh,cz,"lantern"); }
  for(let i=0;i<110;i++){ const x=-180+rand()*(W+360), z=-200+rand()*(D+300); if(away(x,z)<6 || z>D-4 || (x>-52 && x<-6 && z>-2 && z<34)) continue;
    const t=fh(x,z); if(t>12) continue; const hh=6+rand()*18; for(let y=t;y<t+hh;y+=3) fset(x,y,z,"kelp"); }

  // Fische, Quallen und Wal
  const creatures = [];
  [["clown",[44,16,36],[26,18],.25,0],["yellow",[30,12,44],[14,10],.32,1.5],["tang",[60,14,30],[18,12],.28,3],["pink",[48,20,48],[30,16],.2,4.2],["tang",[-20,14,14],[22,12],.22,2],["yellow",[110,12,20],[20,14],.26,5]].forEach(([k,ctr,rad,sp,ph])=>{
    for(let i=0;i<6;i++) creatures.push({ ...fish(k), orbit:{c:[ctr[0]+((i*3)%5)-2, ctr[1]+(i%3)*1.4, ctr[2]+((i*7)%5)-2], r:rad, speed:sp, ph:ph+i*.12, bob:.5}, scale:.42, noShadow:true }); });
  for(const [jx,jy,jz,col] of [[30,24,22,0xFF8AD8],[58,28,18,0xB8A0FF],[36,30,40,0x8AE6FF],[62,22,44,0xFF8AD8]]) creatures.push({ ...jelly(col), at:[jx,jy,jz], hover:[1.2,.8], scale:.7 });
  creatures.push({ ...whale(), orbit:{c:[44,30,-14], r:[74,26], speed:.05, ph:2.6, bob:1.4, bank:.12, dir:-1}, scale:1.1 });

  return {
    W, D, blocks, spots:S, exposure:1.2, fov:40,
    sky:[[0,"#5FD3F2"],[.3,"#2E9BD0"],[.6,"#0E5C8C"],[1,"#062A46"]], fog:[0x0E5C8C, 80, 300],
    hemi:[0x9FEFFF, 0x1A4A6A, 1.9], sun:{color:0xDFFBFF, int:1.6, pos:[-30,90,40]}, bloom:[.38,.45,.9],
    lights:[{pos:[S.grammar.x,S.grammar.y+18,S.grammar.z], color:0x7FE3FF, int:260, dist:34}, {pos:[S.vocabulary.x,S.vocabulary.y+3,S.vocabulary.z], color:0xFFFFFF, int:90, dist:16}],
    planes:[{y:5.2, tex:T.sand, repeat:400, size:1000}, {y:150, tex:T.surface, repeat:60, size:400, em:.4, opacity:.35, anim:[.02,.01]}],
    rays:{n:26, color:0xBFF4FF, area:[-60,W+60,-60,D]},
    particles:[{n:520, area:[0,W,2,80,0,D+30], vy:2.2, wob:.8, color:0xE6FBFF, size:.34, opacity:.8},
               {n:380, area:[0,W,2,30,0,D], vy:0, wob:.3, color:0xA8F0D8, size:.14, opacity:.7, add:true, twinkle:true}],
    creatures,
    home:{pos:[W/2,48,D+52], look:[W/2,10,D/2-4]}, homePortrait:{pos:[W/2,112,D+78], look:[W/2,0,D/2-12]},
    ui:{bg:"rgba(4,34,58,.88)", border:"#7FE3FF", glow:"rgba(80,210,255,.5)", text:"#E8FBFF", sub:"#9FD7EA", accent:"#FF8A5A", "accent-ink":"#1A0E08", chip:"rgba(4,30,52,.8)"}
  };
}
