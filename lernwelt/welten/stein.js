// Klasse 7 · Dwarven Caves – Zwergenstadt in einer Riesenhöhle: Terrassen mit Treppen, Tempelfassade, Zwergenstatue, Kristallmine und Schmiede
import { dwarf } from "./tiere.js";
export function build(A){
  const { rand, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, tex, P, noise, stripes, bricks, rings, planks } = A;
  const ore = (base, spot) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(base)); for(let i=0;i<5;i++){ const x=1+Math.floor(rand()*13), y=1+Math.floor(rand()*13); P(g,x,y,spot[0]); P(g,x+1,y,spot[1]); P(g,x,y+1,spot[1]); } });
  const crystal = cols => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?cols[0]:d<3?cols[1]:cols[2]); } });
  const STONE = ["#7A746C","#6E6862","#857F76","#645E58"];
  const T = {
    stone: noise(STONE, 6, ["#5A544E"]), deep: noise(["#3A3634","#45403C","#302C2A","#4C4642"], 8, ["#2A2624"]),
    flag: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, (x===0||y===0||(x===8&&y<8)||(y===8&&x>4)) ? "#3E3A36" : pick(["#8A847A","#7E786E","#948E84"])); P(g,3,5,"#5A544E"); P(g,4,6,"#5A544E"); P(g,11,12,"#5A544E"); }),
    sbrick: bricks(["#8A847A","#7E786E","#948E84"], "#4E4842"), chisel: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const e=x<1||y<1||x>14||y>14, i=x>3&&x<12&&y>3&&y<12, k=x>5&&x<10&&y>5&&y<10; P(g,x,y, e?"#4E4842":k?"#A49E94":i?"#7A746A":"#8E887E"); } }),
    statue: noise(["#A8A49C","#B4B0A8","#9C988F","#ACA8A0"], 4, ["#8C887F"]),
    gold: noise(["#F5C542","#FFE27A","#E8B030","#FFD95A"]),
    planks: planks(["#9A6E3E","#A87A48","#8A6236"], "#5A3E22"), log: stripes(["#5E4024","#6E4C2C","#4E361E"], true),
    iron: noise(["#9A9EA6","#8A8E96","#AAAEB4"]), dark: noise(["#1A1614","#221E1A","#14100E"]),
    lava: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.9+y*.35)+Math.sin(y*.8-x*.3)+rand()*.6; P(g,x,y, v>1.2?"#FFD24A":v>.3?"#FF9A1E":v>-.6?"#FF6A0A":"#D9430A"); } }),
    glow: noise(["#FFD27A","#FFB84A","#FFE6A8","#F0A030"], 10, ["#A8642A"]),
    door: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=y/16; P(g,x,y, rand()<.08 ? "#FFF0C0" : v<.3?"#FFE2A0":v<.7?"#FFC060":"#F09A30"); } }),
    win: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const fr = x<3||x>12||y<2||y>13||x===7||x===8; P(g,x,y, fr ? "#4E4842" : pick(["#FFC860","#FFD27A","#FFB040"])); } }),
    rune: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, pick(["#8A847A","#7E786E"])); for(const [a,b] of [[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11],[12,12],[12,3],[11,4],[10,5],[5,10],[4,11],[3,12],[7,3],[7,12],[3,7],[12,7]]) P(g,a,b,"#7AE8FF"); }),
    amethyst: crystal(["#E2C8FF","#B88AFF","#8A4FE8"]), emerald: crystal(["#C8FFE2","#4AF0A0","#18B868"]),
    sapphire: crystal(["#D2E6FF","#6AA8FF","#2A62E0"]), ruby: crystal(["#FFD2DA","#FF6A80","#D2203A"]),
    goldOre: ore(STONE, ["#FFD24A","#E8A81C"]), diaOre: ore(["#3A3634","#45403C","#302C2A"], ["#8AF0FF","#3FC8E8"]),
    woolR: noise(["#B8302A","#C83A32","#A8261F"]), woolB: noise(["#2F5DA8","#3A6AC0","#244E90"]), woolY: noise(["#E8B030","#F5C542"]),
    shroom: noise(["#5AF0FF","#8AF6FF","#2AC8E8"], 6, ["#E6FFFF"]), chain: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x>5&&x<10&&(y%6<4)) ? "#5A5E66" : "rgba(0,0,0,0)"); })
  };
  const blocks = {
    stone:{side:T.stone}, deep:{side:T.deep}, flag:{side:T.sbrick, top:T.flag}, sbrick:{side:T.sbrick}, chisel:{side:T.chisel, top:T.sbrick}, statue:{side:T.statue},
    gold:{side:T.gold, em:.35}, planks:{side:T.planks}, log:{side:T.log, top:T.planks}, iron:{side:T.iron}, dark:{side:T.dark},
    lava:{side:T.lava, em:1.25, anim:[.1,.06]}, glow:{side:T.glow, em:1.3}, door:{side:T.door, em:.75}, win:{side:T.win, em:1.0}, rune:{side:T.rune, top:T.sbrick, em:.6},
    amethyst:{side:T.amethyst, em:1.0}, emerald:{side:T.emerald, em:.9}, sapphire:{side:T.sapphire, em:1.0}, ruby:{side:T.ruby, em:.95},
    goldOre:{side:T.goldOre}, diaOre:{side:T.diaOre, em:.15}, woolR:{side:T.woolR}, woolB:{side:T.woolB}, woolY:{side:T.woolY}, shroom:{side:T.shroom, em:1.0},
    chain:{side:T.chain, alpha:.99, cross:true}
  };
  const W=88, D=68, L0=5, L1=13, L2=21, TOP=54, OPEN=40;
  // Gelände: drei Terrassen, hinten die Felswand, an den Seiten Wände (vorne offen zu weiteren Höhlen)
  const level = z => z>=44 ? L0 : z>=26 ? L1 : z>=10 ? L2 : TOP;
  for(let z=0; z<D; z++) for(let x=0; x<W; x++){
    let h = level(z); const sideD = Math.max(5-x, x-(W-6));
    if(sideD>0 && z<OPEN) h = TOP; else if(sideD>0) h = Math.max(h, L0 + Math.round(fbm(x*.3,z*.3)*3));
    if(z<10) h = TOP - Math.round(fbm(x*.1,1)*2);
    for(let y=0;y<h;y++){ let t = y===h-1 && h<=L2 ? "flag" : (h>=TOP && rand()<.03 ? pick(["goldOre","diaOre"]) : (rand()<.3 ? "deep" : "stone")); set(x,y,z,t); } }
  // Stützmauern der Terrassen mit Zierbändern
  for(let x=6;x<W-6;x++){ for(let y=L0;y<L1;y++) set(x,y,25+18, (y===L1-1)?"chisel":"sbrick"); for(let y=L1;y<L2;y++) set(x,y,25, (y===L2-1)?"chisel":"sbrick"); set(x,L1,43,"chisel"); set(x,L2,25,"chisel"); }
  // Treppen: Stufen nach hinten hinauf
  const stairs = (x0,x1,yFrom,zFront,steps) => { for(let i=0;i<steps;i++){ fill(x0,yFrom-1,zFront-i,x1,yFrom+i,zFront-i,"sbrick"); fill(x0,yFrom+i,zFront-i,x1,yFrom+i,zFront-i,"flag"); }
    for(let i=0;i<steps;i++){ set(x0-1,yFrom+i+1,zFront-i,"chisel"); set(x1+1,yFrom+i+1,zFront-i,"chisel"); }
    for(const xx of [x0-1,x1+1]){ fill(xx,yFrom,zFront+1,xx,yFrom+2,zFront+1,"chisel"); set(xx,yFrom+3,zFront+1,"glow"); } };
  stairs(38,50,L0,51,8); stairs(10,14,L0,51,8); stairs(60,63,L0,51,8);
  stairs(39,49,L1,33,8); stairs(18,21,L1,33,8); stairs(64,67,L1,33,8);
  // Bögen mit warmem Licht in einer Wand (Wand zeigt nach +z)
  const archZ = (x,y,z,w,h) => { const hw=Math.floor(w/2); for(let a=-hw;a<=hw;a++) for(let b=0;b<h+hw;b++){ const inside = b<h || Math.hypot(a,b-h)<hw+.3; if(inside){ set(x+a,y+b,z,null); set(x+a,y+b,z-1,"door"); } }
    for(let a=-hw-1;a<=hw+1;a++) for(let b=0;b<=h+hw+1;b++){ const on = (Math.abs(a)===hw+1 && b<=h) || (b>h && Math.abs(Math.hypot(a,b-h)-(hw+1))<.6); if(on) set(x+a,y+b,z+1,"chisel"); }
    set(x,y+h+hw+1,z+1,"gold"); };
  // Bögen in Wand mit Blick nach +x / -x
  const archX = (x,y,z,w,h,dir) => { const hw=Math.floor(w/2); for(let a=-hw;a<=hw;a++) for(let b=0;b<h+hw;b++){ if(b<h || Math.hypot(a,b-h)<hw+.3){ set(x,y+b,z+a,null); set(x-dir,y+b,z+a,"door"); } }
    for(let a=-hw-1;a<=hw+1;a++) for(let b=0;b<=h+hw+1;b++){ const on = (Math.abs(a)===hw+1 && b<=h) || (b>h && Math.abs(Math.hypot(a,b-h)-(hw+1))<.6); if(on) set(x+dir,y+b,z+a,"chisel"); } };
  // Arkaden in den Stützmauern
  for(const ax of [24,32,54,70,78]){ archZ(ax,L0,43,3,4); } for(const ax of [14,30,58,74]) archZ(ax,L1,25,3,4);

  // ---------- Grammar: Große Tempelfassade in der Rückwand ----------
  const S = {
    grammar:   {x:44, z:10, col:0xFFD24A, ort:"Great Dwarf Temple"},
    vocabulary:{x:15, z:35, col:0xB88AFF, ort:"Crystal Mine"},
    country:   {x:72, z:58, col:0xFF8A3A, ort:"Forge Market"}
  };
  { const x=44, y=L2, z=10;
    fill(x-15,y,z,x+15,y+29,z+1,"sbrick"); fill(x-16,y+29,z,x+16,y+31,z+2,"chisel"); for(let a=-16;a<=16;a+=2) set(x+a,y+30,z+3,"gold");
    for(const a of [-13,-8,-3,3,8,13]){ fill(x+a,y,z+2,x+a+1,y+26,z+3,(xx,yy)=> (yy-y)%7===0?"chisel":"statue"); fill(x+a-1,y+27,z+2,x+a+2,y+28,z+4,"chisel"); set(x+a,y+28,z+5,"gold"); set(x+a+1,y+28,z+5,"gold"); fill(x+a-1,y,z+2,x+a+2,y+1,z+4,"chisel"); }
    // großes Tor mit Licht
    for(let a=-4;a<=4;a++) for(let b=0;b<16;b++){ if(b<11 || Math.hypot(a,b-11)<4.6){ set(x+a,y+b,z,"door"); set(x+a,y+b,z+1,null); } }
    for(let a=-6;a<=6;a++) for(let b=0;b<=17;b++){ const on=(Math.abs(a)>=5&&Math.abs(a)<=6&&b<=11)||(b>11&&Math.hypot(a,b-11)>=4.6&&Math.hypot(a,b-11)<6.4); if(on) set(x+a,y+b,z+2, Math.abs(a)===5||Math.hypot(a,b-11)<5.5?"gold":"chisel"); }
    // runde Scheibe oben (Sonnenrad)
    const my=y+38; for(let a=-6;a<=6;a++) for(let b=-6;b<=6;b++){ const d=Math.hypot(a,b); if(d<=6.3) set(x+a,my+b,z+1, d>5.2?"gold":d>4.2?"chisel":d>1.5?((Math.atan2(b,a)*4/Math.PI|0)%2?"door":"glow"):"gold"); }
    for(let a=-9;a<=9;a++) for(let b=-2;b<=9;b++) if(Math.abs(a)>=7 && b<=Math.max(2, 9-(Math.abs(a)-7)*3)) set(x+a,my+b-2,z, "chisel");
    // Fries mit Runen
    for(let a=-14;a<=14;a++) set(x+a,y+28,z+2, a%3===0 ? "rune" : "chisel");
    // Pylone mit Feuerschalen vor dem Tempel
    for(const a of [-11,11]){ fill(x+a,y,z+8,x+a+1,y+5,z+9,"chisel"); fill(x+a-1,y+6,z+7,x+a+2,y+6,z+10,"iron"); fill(x+a,y+7,z+8,x+a+1,y+7,z+9,"glow"); }
    S.grammar.top=[x, y+20, z+4]; S.grammar.lift=1; S.grammar.base=y+16; S.grammar.cam={dist:54, up:.06, lookY:y+17, side:0}; }

  // ---------- Riesige Zwergenstatue (links oben) ----------
  const statue = (x,y,z) => {
    fill(x-7,y,z-6,x+7,y+3,z+6,"chisel"); fill(x-7,y+3,z-6,x+7,y+3,z+6,"sbrick"); for(let a=-6;a<=6;a+=3) set(x+a,y+2,z+7,"rune"); fill(x-7,y+4,z-6,x+7,y+4,z+6,"gold");
    const b=y+5, ST="statue";
    fill(x-4,b,z-2,x-1,b+2,z+3,ST); fill(x+1,b,z-2,x+4,b+2,z+3,ST);                 // Stiefel
    fill(x-3,b+3,z-1,x-1,b+8,z+1,ST); fill(x+1,b+3,z-1,x+3,b+8,z+1,ST);             // Beine
    fill(x-5,b+9,z-2,x+5,b+10,z+2,"gold"); fill(x-1,b+9,z+3,x+1,b+10,z+3,"gold");   // Gürtel, Schnalle
    for(let yy=b+11; yy<=b+19; yy++){ const w = yy<b+16 ? 5 : 6; fill(x-w,yy,z-2,x+w,yy,z+2,ST); }   // Rumpf
    fill(x-7,b+17,z-2,x-6,b+20,z+2,ST); fill(x+6,b+17,z-2,x+7,b+20,z+2,ST);         // Schultern
    fill(x-7,b+10,z-1,x-6,b+16,z+1,ST); fill(x+6,b+10,z-1,x+7,b+16,z+1,ST);         // Arme
    fill(x-5,b+11,z+3,x-4,b+13,z+4,ST); fill(x+4,b+11,z+3,x+5,b+13,z+4,ST);         // Hände nach vorn
    for(let yy=b+9; yy<=b+21; yy++){ const w = Math.max(1, Math.round((yy-b-9)*.35)+1); fill(x-w,yy,z+3,x+w,yy,z+3,ST); if(yy%3===0) fill(x-w,yy,z+4,x+w,yy,z+4, yy===b+12||yy===b+15 ? "gold" : ST); } // Bart
    fill(x-3,b+21,z-2,x+3,b+26,z+2,ST); set(x,b+23,z+3,ST); set(x,b+22,z+3,ST);       // Kopf, Nase
    set(x-2,b+24,z+3,"glow"); set(x+2,b+24,z+3,"glow"); fill(x-3,b+25,z+3,x-1,b+25,z+3,ST); fill(x+1,b+25,z+3,x+3,b+25,z+3,ST); // Augen, Brauen
    fill(x-4,b+27,z-3,x+4,b+27,z+3,"gold"); for(let yy=0;yy<4;yy++) fill(x-3+yy,b+28+yy,z-2+Math.floor(yy/2),x+3-yy,b+28+yy,z+2-Math.floor(yy/2),ST); // Helm
    fill(x,b+32,z-1,x,b+33,z+1,"gold"); line(x-4,b+28,z,x-7,b+31,z,"gold"); line(x+4,b+28,z,x+7,b+31,z,"gold");
    fill(x,b,z+6,x,b+14,z+6,"log"); fill(x-2,b,z+5,x+2,b+3,z+7,"iron"); fill(x-3,b+1,z+6,x+3,b+2,z+6,"iron"); // Kriegshammer vor der Statue
    fill(x-5,b+12,z+5,x+5,b+12,z+5,ST); return b+34; };
  const statueTop = statue(20,L2,16);

  // ---------- Vocabulary: Kristallmine in der linken Wand ----------
  const cluster = (cx,cy,cz,t,n,up=1) => { for(let i=0;i<n;i++){ const ang=rand()*Math.PI*2, len=2+Math.floor(rand()*3), dx=Math.cos(ang)*.45, dz=Math.sin(ang)*.45;
      for(let k=0;k<len;k++) set(Math.round(cx+dx*k), cy+k*up, Math.round(cz+dz*k), t); } };
  { const {x,z} = S.vocabulary, y=L1;
    for(let a=-3;a<=3;a++) for(let b=0;b<7;b++) for(let d=0;d<8;d++) if(b<5 || Math.abs(a)<3) set(4-d,y+b,z+a,null);
    for(let d=1;d<9;d++) for(let a=-3;a<=3;a++) set(4-d+1,y+7,z+a, d===8?null:"stone");
    for(let a=-3;a<=3;a++) for(let b=0;b<6;b++) set(-5,y+b,z+a,"dark");
    for(const zz of [z-3,z+3]) fill(5,y,zz,5,y+5,zz,"log"); fill(5,y+6,z-4,5,y+6,z+4,"log"); set(6,y+6,z,"glow");
    for(let a=-4;a<=18;a++){ set(x-10+a+3,y-1,z,"iron"); if(a%2===0){ set(x-10+a+3,y-1,z-1,"planks"); set(x-10+a+3,y-1,z+1,"planks"); } }
    // Lore voller Edelsteine
    fill(x+2,y,z-1,x+5,y+2,z+1,"iron"); fill(x+3,y+1,z,x+4,y+2,z,null); set(x+3,y+2,z,"amethyst"); set(x+4,y+2,z,"emerald"); set(x+3,y+3,z,"sapphire"); set(x+4,y+3,z,"ruby");
    for(const [t,dx,dz] of [["amethyst",-4,-6],["emerald",3,-6],["sapphire",-3,6],["ruby",6,5],["amethyst",8,-2],["sapphire",-6,4],["emerald",9,4]]) cluster(x+dx,y,z+dz,t,4);
    for(let i=0;i<40;i++){ const yy=y+2+Math.floor(rand()*24), zz=z-10+Math.floor(rand()*20); if(get(5,yy,zz) && !get(6,yy,zz)) set(6,yy,zz,pick(["amethyst","sapphire","emerald","ruby"])); }
    for(let i=0;i<6;i++) set(x-4+i*3, y, z+8, "shroom");
    for(const [lx,lz] of [[x-2,z+4],[x+7,z-4]]){ fill(lx,y,lz,lx,y+3,lz,"log"); set(lx,y+4,lz,"glow"); }
    S.vocabulary.top=[x+1,y+10,z]; S.vocabulary.base=y+3; S.vocabulary.cam={dist:36, up:.42, side:.25}; }

  // ---------- Country & people: Schmiede-Markt vorne rechts ----------
  { const {x,z} = S.country, y=L0;
    fill(x-4,y,z-8,x+4,y+7,z-4,"sbrick"); fill(x-5,y+8,z-9,x+5,y+8,z-3,"chisel"); fill(x-2,y,z-4,x+2,y+3,z-4,"lava"); fill(x-2,y+4,z-4,x+2,y+4,z-4,"glow"); fill(x-3,y,z-3,x+3,y,z-3,"chisel");
    for(let hh=9;hh<30;hh++) fill(x-1,y+hh,z-7,x+1,y+hh,z-5, hh%5===0?"chisel":"sbrick"); fill(x-1,y+30,z-7,x+1,y+30,z-5,"glow");
    for(const [ax,az] of [[x-3,z],[x+3,z+1]]){ fill(ax-1,y,az,ax+1,y,az,"dark"); set(ax,y+1,az,"dark"); fill(ax-2,y+2,az,ax+1,y+2,az,"dark"); }
    for(const [sx,sz,t] of [[x-10,z+3,"woolR"],[x+5,z+5,"woolB"],[x-9,z-5,"woolY"]]){ for(const [a,b] of [[0,0],[3,0],[0,3],[3,3]]) fill(sx+a,y,sz+b,sx+a,y+3,sz+b,"log");
      for(let a=-1;a<=4;a++) for(let b=-1;b<=4;b++) set(sx+a,y+4+((a+b)%2?0:0),sz+b, (a+b)%2 ? t : "woolY"); fill(sx,y,sz+1,sx+3,y,sz+2,"planks"); set(sx+1,y+1,sz+1,"gold"); set(sx+2,y+1,sz+2,"ruby"); set(sx+1,y+1,sz+2,"iron"); }
    for(const [bx,bz] of [[x+8,z-2],[x+9,z],[x-12,z-1],[x+7,z+9]]) fill(bx,y,bz,bx,y+1,bz,"planks");
    for(const [lx,lz] of [[x-6,z+9],[x+6,z-10],[x+10,z+6]]){ fill(lx,y,lz,lx,y+4,lz,"log"); set(lx,y+5,lz,"glow"); }
    S.country.top=[x,y+12,z]; S.country.base=y+4; S.country.cam={dist:36, up:.42, side:-.15}; }

  // ---------- Häuser in den Seitenwänden, Balkone, Laternen ----------
  for(const [sx,dir] of [[4,1],[W-5,-1]]) for(const [yy,zz] of [[L2,14],[L2+9,20],[L2+9,32],[L2+18,14],[L2+18,28],[L1,20],[L2+27,22]]){
    if(sx===4 && zz>28 && zz<42 && yy<L2+5) continue;
    archX(sx,yy,zz,3,4,dir); for(const o of [-5,5]){ set(sx,yy+3,zz+o,"win"); set(sx,yy+4,zz+o,"win"); }
    if(yy>L2){ for(let o=-6;o<=6;o++){ set(sx+dir,yy-1,zz+o,"chisel"); set(sx+2*dir,yy-1,zz+o,"chisel"); if(o%2===0) set(sx+2*dir,yy,zz+o,"sbrick"); } set(sx+2*dir,yy+1,zz-6,"glow"); } }
  // Treppen an den Seitenwänden hinauf
  for(const [sx,dir] of [[6,1],[W-7,-1]]) for(let i=0;i<30;i++){ const yy=L2+i, zz=12+i; if(zz>=OPEN-2) break; set(sx,yy,zz,"sbrick"); set(sx+dir,yy,zz,"sbrick"); }
  // Häuser auf der oberen Terrasse rechts
  { const hx=64, hz=15, y=L2; fill(hx-6,y,hz-4,hx+6,y+9,hz+3,"sbrick"); fill(hx-7,y+10,hz-5,hx+7,y+10,hz+4,"chisel"); for(let i=0;i<4;i++) fill(hx-6+i,y+11+i,hz-4,hx+6-i,y+11+i,hz+3,"sbrick");
    archZ(hx,y,hz+4,3,3); for(const a of [-4,4]){ set(hx+a,y+5,hz+4,"win"); set(hx+a,y+6,hz+4,"win"); } }
  // Laternen an Ketten von der Decke
  for(const [lx,lz,len] of [[30,20,14],[58,20,14],[44,32,10],[24,36,16],[64,36,16]]){ for(let k=0;k<len;k++) set(lx,TOP-1-k,lz,"chain"); fill(lx-1,TOP-1-len,lz-1,lx+1,TOP-2-len,lz+1,"iron"); set(lx,TOP-2-len,lz,"glow"); }
  // Kleinkram: Felsbrocken, Pilze, Kisten, Laternenpfähle auf dem Vorplatz
  const busy = (x,z) => Math.abs(x-44)<9 || (Math.hypot(x-S.country.x,z-S.country.z)<15) || (x<26 && z<44 && z>24) || Math.abs(x-12)<4 || (x>58 && x<65) || (x<30 && z<24);
  for(let i=0;i<70;i++){ const x=7+Math.floor(rand()*(W-14)), z=11+Math.floor(rand()*(D-12)); if(busy(x,z)) continue; const t=topAt(x,z,40)+1; if(t>L2+1 || get(x,t,z)) continue;
    const r=rand(); if(r<.3){ ellip(x,t,z,1+rand(),1,1+rand(),"stone"); } else if(r<.5) set(x,t,z,"shroom"); else if(r<.65){ fill(x,t,z,x,t+3,z,"log"); set(x,t+4,z,"glow"); } else if(r<.75) cluster(x,t,z,pick(["amethyst","sapphire"]),2); else set(x,t,z,"planks"); }

  // ---------- Decke mit Tropfsteinen (grob) und Licht von oben ----------
  const F = A.far; F.cell = 3;
  for(let cx=-2; cx<=Math.ceil(W/3)+1; cx++) for(let cz=-1; cz<=Math.ceil(OPEN/3); cz++){ const x=cx*3, z=cz*3; if(Math.hypot(x-44,z-18)<7) continue;
    const yy = 18 + Math.round(fbm(x*.08,z*.08)*2); F.set(cx,yy,cz, rand()<.3?"deep":"stone");
    if(rand()<.12){ const len=1+Math.floor(rand()*3); for(let k=1;k<=len;k++) F.set(cx,yy-k,cz,"stone"); } }
  // ---------- Weitere Höhlen links und rechts bis in die Ferne: Terrassen, beleuchtete Häuser ----------
  const away = x => Math.max(0,-x, x-W);
  const fh = (x,z) => { const a=away(x); let h = L0 + Math.floor(a/18)*7 + fbm(x*.05,z*.05)*3; if(a>70) h += (a-70)*1.4; if(z<OPEN) h = 80; return h; };
  A.farTerrain({ x0:-150, x1:W+150, z0:OPEN-6, z1:D+50, base:0, skip:(x,z)=> x>-1 && x<W+1,
    h: fh, top:(x,z,y,hc)=> y*3 > 60 ? "stone" : (rand()<.04 ? "glow" : "flag"),
    fill:(x,z,y,hc)=> (y%2===1 && rand()<.14) ? "win" : (rand()<.25 ? "deep" : "sbrick") });
  for(let i=0;i<40;i++){ const x = rand()<.5 ? -20-rand()*120 : W+20+rand()*120, z = OPEN+rand()*(D-OPEN+40); const cx=Math.floor(x/3), cz=Math.floor(z/3), base=Math.ceil(fh(x,z)/3);
    const hh = 2+Math.floor(rand()*5); for(let k=0;k<hh;k++) F.set(cx,base+k,cz,"stone"); }

  // Zwerge: einige laufen über die Plätze, einer schmiedet, andere stehen
  const creatures = [];
  const tun = [0x2F5DA8,0xA83A2A,0x3A8A4A,0x7A4AA8,0x8A6A2A], brd = [0xC86A2A,0xE8E2D8,0x6A4A2A,0xD8B060,0x2A2A2A];
  creatures.push({ ...dwarf({tunic:0x6A3A2A, beard:0xE8E2D8, hammer:true}), at:[S.country.x-4, L0, S.country.z-1], yaw:0, scale:.5 });
  for(let i=0;i<5;i++) creatures.push({ ...dwarf({tunic:tun[i], beard:brd[i], walk:true}), orbit:{c:[44+(i-2)*14, L0, 56+(i%2)*4], r:[5+i, 3+(i%3)], speed:.18+(i%3)*.05, ph:i*1.3, bob:.1, dir:i%2?1:-1}, scale:.42 });
  for(let i=0;i<3;i++) creatures.push({ ...dwarf({tunic:tun[(i+2)%5], beard:brd[(i+1)%5], walk:true}), orbit:{c:[30+i*14, L1, 36], r:[6, 2], speed:.2, ph:i*2, bob:.1, dir:i%2?1:-1}, scale:.42 });
  for(const [dx,dz,yaw,i] of [[38,18,1.6,0],[52,20,1.3,1],[9,48,.3,2],[80,40,2.6,3]]) creatures.push({ ...dwarf({tunic:tun[i], beard:brd[(i+2)%5]}), at:[dx, level(dz)>=TOP?L2:level(dz), dz], yaw, scale:.42 });

  return {
    W, D, blocks, spots:S, exposure:1.2, fov:40, creatures,
    sky:[[0,"#030204"],[.5,"#0E0A0C"],[1,"#22160E"]], fog:[0x1E140E, 70, 260],
    hemi:[0xC8B8A8, 0x2A1A0E, 1.15], sun:{color:0xFFE0B8, int:1.1, pos:[20,90,60]}, bloom:[.45,.4,.86],
    lights:[{pos:[44,L2+8,16], color:0xFFB84A, int:700, dist:46},
            {pos:[S.country.x,L0+4,S.country.z-2], color:0xFF7A2A, int:340, dist:30, flicker:true},
            {pos:[S.vocabulary.x,L1+5,S.vocabulary.z], color:0xB88AFF, int:260, dist:26},
            {pos:[44,L0+8,52], color:0xFFC870, int:300, dist:40}],
    rays:{n:10, color:0xFFE6B8, area:[38,50,12,26], y:40, len:70},
    particles:[{n:420, area:[0,W,3,TOP,0,D], vy:0, wob:.25, color:0xFFE6A8, size:.16, opacity:.8, add:true, twinkle:true},
               {n:200, area:[S.country.x-3,S.country.x+3,L0+8,L0+32,S.country.z-8,S.country.z-4], vy:3, wob:.5, color:0xFF9A3A, size:.25, add:true}],
    puffs:[{n:8, pos:[S.country.x,L0+31,S.country.z-6], dx:2, dy:14, dz:2, s0:3, s1:8, color:0x4A4040, opacity:.4, speed:.05}],
    home:{pos:[W/2,46,D+66], look:[W/2,20,D/2-8]}, homePortrait:{pos:[W/2,54,D+112], look:[W/2,22,D/2-8]},
    ui:{bg:"rgba(26,20,30,.9)", border:"#C9A6FF", glow:"rgba(184,138,255,.5)", text:"#F4EEFF", sub:"#C8BCD8", accent:"#FFC24A", "accent-ink":"#24180A", chip:"rgba(20,14,24,.82)"}
  };
}
