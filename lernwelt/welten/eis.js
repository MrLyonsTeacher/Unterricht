// Klasse 10 · Ice Region – verschneite Stadt im Tal: Frostturm, Laternenstadt, Kristallhöhle, Bogenbrücke über den gefrorenen Fluss; dahinter Berge und ein leuchtender Eisring am Himmel
import { polarBear } from "./tiere.js";
export function build(A){
  const { rand, fbm, vn, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, ellip, dome, cone, line, topAt, terrain, tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT, windowT } = A;
  const T = {
    snow: noise(["#F4F8FF","#EAF2FC","#FFFFFF","#E2ECF8"], 6, ["#D4E2F2"]), snowSide: topEdge(["#7A8698","#6C788A","#8692A4"], ["#F4F8FF","#EAF2FC"], 5),
    rock: noise(["#7A8698","#6C788A","#8692A4","#606C7E"], 6, ["#98A4B4"]), rockS: noise(["#8692A4","#7A8698","#E8F0FA","#6C788A"], 6, ["#FFFFFF"]),
    ice: noise(["#A8E0FF","#BFE8FF","#96D4F8","#CFEFFF"], 8, ["#FFFFFF"]), riverIce: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const v=Math.sin(x*.5+y*.9)+rand()*.5; P(g,x,y, v>1.2?"#E6F6FF":v>.2?"#9ACCEA":"#7AB4DA"); } }),
    sbrick: bricks(["#B8BEC8","#AAB0BA","#C4CAD2"], "#6E7684"), sbrickD: bricks(["#5A6070","#4E5464","#646A7A"], "#2E3240"),
    pillar: stripes(["#C8CED8","#B8BEC8","#D4DAE2"], true),
    slate: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3?"#1E2838":((x+Math.floor(y/4)*4)%8<4?"#34425A":"#2C3A50")); }),
    snowRoof: tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y<10 ? pick(["#F4F8FF","#FFFFFF","#E6EEF8"]) : (y%3===0?"#1E2838":"#34425A")); }),
    wood: planks(["#6A4A30","#7A5638","#5E4028"], "#3A2818"), timber: stripes(["#4A3420","#563C26","#40301C"], true),
    win: windowT("#3A2818","#FFC860","#FFE09A"), winB: windowT("#2E3240","#FFD27A","#FFF0C0"),
    glow: noise(["#8AF0FF","#5AD8FF","#BFF8FF"], 6, ["#FFFFFF"]), lamp: noise(["#FFE6A8","#FFD27A","#FFF2CC"]),
    crystal: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#E6FFFF":d<3?"#7FE6FF":"#3AB4F0"); } }),
    violet: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const d=(x+y)%6; P(g,x,y, d===0?"#F2E6FF":d<3?"#C8A0FF":"#9A6AF0"); } }),
    ringT: tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x===7||x===8) && y%5<3 ? "#E6FFFF" : pick(["#5AC8F0","#4AB4E8","#6AD4F8"])); }),
    gold: noise(["#E8C24A","#F5D46A","#D8AE30"]), fur: noise(["#FAFAF4","#F0F0E8","#FFFFFF"]), black: noise(["#1A1E26","#22262E"]), orange: noise(["#FF9A2A","#FFAA40"]),
    pine: noise(["#2E5A4A","#365E50","#264E40"], 12, ["#F4F8FF","#EAF2FC"]), log: stripes(["#5A4230","#4E3828","#664A36"], true), woolR: noise(["#B83A3A","#C84A4A"])
  };
  const blocks = {
    snow:{side:T.snowSide, top:T.snow, bottom:T.rock}, snowB:{side:T.snow}, rock:{side:T.rock}, rockS:{side:T.rockS, top:T.snow}, ice:{side:T.ice, alpha:.82}, riverIce:{side:T.riverIce, em:.12},
    sbrick:{side:T.sbrick}, sbrickD:{side:T.sbrickD}, pillar:{side:T.pillar, top:T.sbrick}, slate:{side:T.slate}, snowRoof:{side:T.snowRoof, top:T.snow},
    wood:{side:T.wood}, timber:{side:T.timber}, win:{side:T.win, em:.95}, winB:{side:T.winB, em:1.0}, glow:{side:T.glow, em:1.1}, lamp:{side:T.lamp, em:1.25},
    crystal:{side:T.crystal, em:1.0}, violet:{side:T.violet, em:1.0}, ringB:{side:T.ringT, em:1.1}, gold:{side:T.gold, em:.3},
    fur:{side:T.fur}, black:{side:T.black}, orange:{side:T.orange}, pine:{side:T.pine}, log:{side:T.log}, woolR:{side:T.woolR}
  };
  const W=92, D=70, RIV=4;
  const riverX = z => 46 + Math.sin(z*.07)*6;
  const H = (x,z) => { let h = 8 + fbm(x*.08,z*.08)*3;
    h += Math.max(0, 14-z)*1.5*(.6+fbm(x*.15,2)); h += Math.max(0, 9-x)*2 + Math.max(0, x-(W-10))*2;
    const rd = Math.abs(x-riverX(z)); if(rd<6) h = Math.min(h, RIV+1 + Math.max(0,rd-4)*2); return h; };
  terrain(W, D, H, (x,y,z,h) => y===h-1 ? (h<=RIV+1 ? "riverIce" : "snow") : (y>h-3 ? "snowB" : (rand()<.3?"rockS":"rock")));

  // ---------- Bausteine ----------
  // Haus mit verschneitem Steildach, Fachwerk und vielen warmen Fenstern; First entlang x
  const house = (x,y,z,w,d,h,opt={}) => { const hw=Math.floor(w/2), hd=Math.floor(d/2), wall = opt.stone ? "sbrick" : "wood";
    for(let a=-hw-1;a<=hw+1;a++) for(let c=-hd-1;c<=hd+1;c++){ const t=topAt(x+a,z+c,40); for(let yy=t+1;yy<y;yy++) set(x+a,yy,z+c,"sbrickD"); }
    fill(x-hw,y,z-hd,x+hw,y,z+hd,"sbrickD");
    walls(x-hw,y+1,z-hd,x+hw,y+h,z+hd,(a,b,c)=> ((a===x-hw||a===x+hw)&&(c===z-hd||c===z+hd)) ? "timber" : (b===y+h ? "timber" : ((b-y)%3===2 && (a+c)%2===0 ? "win" : wall)));
    fill(x,y+1,z+hd,x,y+2,z+hd,"timber"); set(x-1,y+3,z+hd+1,"lamp");
    const R = hd+2; for(let i=0;i<=R;i++){ const ww=R-i; fill(x-hw-1,y+h+1+i,z-ww,x+hw+1,y+h+1+i,z-ww, i>R-2?"snowB":"snowRoof"); fill(x-hw-1,y+h+1+i,z+ww,x+hw+1,y+h+1+i,z+ww, i>R-2?"snowB":"snowRoof");
      if(ww>0) for(const a of [-hw,hw]) fill(x+a,y+h+1+i,z-ww+1,x+a,y+h+1+i,z+ww-1, i===1&&ww>1 ? "win" : wall); }
    fill(x+hw-2,y+h+R-1,z-1,x+hw-2,y+h+R+2,z-1,"sbrickD"); set(x+hw-2,y+h+R+3,z-1,"snowB");
    return y+h+R+1; };
  // runder Turm mit Fensterringen, Balkon und spitzem Schieferdach
  const tower = (x,y,z,r,h,roof,opt={}) => { cyl(x,y,z,r,h,(a,b,c)=> ((b-y)%5===3 && (Math.round(Math.atan2(c-z,a-x)*4)%2===0)) ? "winB" : "sbrick");
    for(let k=10;k<h;k+=opt.bal||14){ ring(x,y+k,z,r+1.2,"sbrickD"); ring(x,y+k+1,z,r+1.2,(a,b,c)=>((a+c)%2?"pillar":null)); }
    ring(x,y+h,z,r+1,"sbrickD"); cone(x,y+h+1,z,r+1.6,roof,(a,b,c)=> (b-(y+h+1))%4===0 ? "snowB" : "slate"); set(x,y+h+roof+1,z,"gold"); set(x,y+h+roof+2,z,"gold"); return y+h+roof+2; };
  // Bogenbrücke aus Stein
  const bridgeX = (x0,x1,z,y,w=2) => { const n=x1-x0; for(let i=0;i<=n;i++){ const f=i/n, x=x0+i, yy = Math.round(y + Math.sin(f*Math.PI)*3);
      for(let c=-w;c<=w;c++) set(x,yy,z+c, Math.abs(c)===w ? "sbrickD" : "sbrick"); set(x,yy+1,z-w,(i%2)?"pillar":"sbrickD"); set(x,yy+1,z+w,(i%2)?"pillar":"sbrickD");
      const under = yy - 1 - Math.round(Math.sin(f*Math.PI)*3.5); for(let k=under;k<yy;k++) for(let c=-w;c<=w;c++) set(x,k,z+c,"sbrick");
      if(i%6===0 && i>0 && i<n){ fill(x,yy+1,z-w,x,yy+3,z-w,"pillar"); set(x,yy+4,z-w,"lamp"); fill(x,yy+1,z+w,x,yy+3,z+w,"pillar"); set(x,yy+4,z+w,"lamp"); } } };

  const S = {
    grammar:   {x:72, z:28, col:0x7FE6FF, ort:"Frost Citadel"},
    vocabulary:{x:16, z:28, col:0xC8A0FF, ort:"Crystal Caves"},
    country:   {x:26, z:54, col:0xFFC24A, ort:"Lantern Town"}
  };

  // ---------- Grammar: Frostzitadelle mit hohem Turm (rechtes Ufer) ----------
  { const {x,z} = S.grammar, y = Math.round(H(x,z));
    fill(x-10,y-3,z-8,x+10,y,z+8,"sbrickD"); for(let a=-10;a<=10;a++) for(let c=-8;c<=8;c++) if(Math.abs(a)===10||Math.abs(c)===8) set(x+a,y+1,z+c,(a+c)%2?"pillar":null);
    const top = tower(x,y+1,z,5,40,14,{bal:12});
    tower(x-8,y+1,z+5,2.6,22,9); tower(x+8,y+1,z+4,2.6,26,10); tower(x+6,y+1,z-6,2.2,18,8);
    house(x-4,y+1,z+9,9,6,6,{stone:true});
    for(let a=-3;a<=3;a++) for(let b=0;b<7;b++) if(b<5 || Math.hypot(a,b-5)<3) set(x+a,y+1+b,z+5, b<5 && Math.abs(a)<2 ? "winB" : "sbrick");
    S.grammar.top=[x, y+34, z+5]; S.grammar.base=y+18; S.grammar.cam={dist:66, up:.18, lookY:y+24, side:-.35}; }

  // ---------- Vocabulary: Kristallhöhle im linken Hang ----------
  { const {x,z} = S.vocabulary, y = Math.round(H(x,z));
    ellip(x-2,y+4,z-2,9,9,8,"rock"); ellip(x-2,y+4,z-2,6.5,6.5,5.5,null);
    for(let a=-9;a<=9;a++) for(let c=-9;c<=9;c++){ const t=topAt(x-2+a,z-2+c,y+16); if(t>=y && !get(x-2+a,t+1,z-2+c) && Math.hypot(a,c)<9) set(x-2+a,t+1,z-2+c,"snowB"); }
    for(let a=-5;a<=5;a++) for(let hh=0;hh<=7;hh++) if(Math.hypot(a*.85,hh)<5.6) for(let c=2;c<=12;c++) set(x-2+a,y+hh,z-2+c,null);
    for(const [cx,cz,t] of [[x-5,z-5,"crystal"],[x+1,z-6,"violet"],[x-3,z-1,"violet"],[x+2,z-3,"crystal"],[x-7,z-2,"crystal"]]) for(let k=0;k<4+Math.floor(rand()*3);k++) set(cx+(k%2),y+k,cz,t);
    for(const a of [-7,5]) for(let k=0;k<10;k++) disk(x-2+a,y+k,z+8,Math.max(0,1.3-k*.14),k%3?"crystal":"violet");
    for(let a=-4;a<=4;a+=2) set(x-2+a,y+7,z+7,"ice");
    for(const [cx,cz] of [[x+6,z+8],[x-10,z+9],[x+7,z+2]]) for(let k=0;k<4;k++) set(cx,y+k,cz, k%2?"violet":"crystal");
    S.vocabulary.top=[x-2,y+17,z-2]; S.vocabulary.base=y+5; S.vocabulary.cam={pos:[40,y+24,66], look:[21,y+4,23]}; S.vocabulary.clear=[[40,y+24,66],[12,y+4,30]]; }

  // ---------- Country & people: Laternenstadt am linken Ufer vorne ----------
  { const {x,z} = S.country, y0 = Math.round(H(x,z));
    house(x-7,y0,z-4,9,7,6); house(x+5,y0,z-5,7,6,8); house(x-3,y0,z+6,7,6,5); house(x+8,y0+1,z+5,5,6,6,{stone:true});
    tower(x-14,y0,z+2,2.2,16,8);
    for(const [lx,lz] of [[x-1,z],[x+3,z+1],[x-9,z+3],[x+12,z-1],[x+2,z+11]]){ const t=topAt(lx,lz,40)+1; fill(lx,t,lz,lx,t+3,lz,"timber"); set(lx,t+4,lz,"lamp"); }
    { const t=topAt(x+1,z+2,40)+1; fill(x-1,t,z+2,x+3,t,z+2,"wood"); set(x,t+1,z+2,"woolR"); set(x+2,t+1,z+2,"gold"); }
    S.country.top=[x+2, y0+13, z+2]; S.country.base=y0+6; S.country.cam={dist:46, up:.36, side:.2}; }

  // ---------- Brücke vorne über den Fluss, Aquädukt hinten, Häuser am rechten Ufer ----------
  bridgeX(36,57,50,RIV+5);
  { const z=11, y=24; for(let x=8;x<=W-8;x++){ fill(x,y,z-1,x,y,z+1,"sbrick"); set(x,y+1,z-1,"sbrickD"); set(x,y+1,z+1,"sbrickD");
      if((x-8)%8===0){ const t=topAt(x,z,y-1); for(let yy=t+1;yy<y;yy++) fill(x,yy,z-1,x+1,yy,z+1,"pillar"); }
      else { const ph=((x-8)%8)/8, dip=Math.round(Math.sin(ph*Math.PI)*3); for(let yy=y-1;yy>=y-1-Math.max(0,1-dip);yy--) fill(x,yy,z-1,x,yy,z+1,"sbrick"); } } }
  for(const [hx,hz,w,d,h] of [[60,52,7,6,6],[70,58,7,6,5],[84,50,6,6,7],[58,40,5,5,5],[86,20,6,5,8]]){ const t=Math.round(H(hx,hz)); house(hx,t,hz,w,d,h,{stone:hx>80}); }
  for(const [hx,hz] of [[30,36],[36,18],[24,14],[52,20]]){ const t=Math.round(H(hx,hz)); if(t>RIV+2) house(hx,t,hz,7,6,6); }
  // Pinguine auf dem Eis
  const peng = (px,py,pz) => { set(px,py,pz,"black"); set(px,py+1,pz,"black"); set(px,py+2,pz,"black"); set(px,py,pz+1,"fur"); set(px,py+1,pz+1,"fur"); set(px,py+2,pz+1,"orange"); };
  for(const [px,pz] of [[44,60],[46,62],[42,63],[49,64]]) peng(Math.round(riverX(pz))+(px-46),RIV+1,pz);
  // Tannen
  const free = (x,z) => Object.values(S).every(s=>Math.hypot(s.x-x,s.z-z)>13) && Math.abs(x-riverX(z))>7 && !(z>40&&x>32&&x<62) && !(z>58);
  for(let i=0;i<120;i++){ const x=Math.floor(rand()*W), z=Math.floor(rand()*D); if(!free(x,z)) continue; const t=topAt(x,z,60)+1; if(t<=RIV+2 || get(x,t,z)) continue;
    const r=rand(); if(r<.6){ const h=5+Math.floor(rand()*6); fill(x,t,z,x,t+1,z,"log"); for(let k=0;k<h;k++) disk(x,t+2+k,z,Math.max(0,(h-k)*.42),"pine"); set(x,t+2+h,z,"snowB"); }
    else if(r<.75) set(x,t,z, rand()<.5?"crystal":"violet"); else if(r<.85){ fill(x,t,z,x,t+2,z,"timber"); set(x,t+3,z,"lamp"); } else ball(x,t,z,1.3,"snowB"); }

  A.clearView(...S.vocabulary.clear, 5, ["pine","log","snowB","lamp","timber"]);
  // ---------- Landschaft bis zum Horizont: Berge, weitere Türme, Eisring am Himmel ----------
  const F = A.far; F.cell = 4;
  const away = (x,z) => Math.hypot(Math.max(0,-x,x-W), Math.max(0,-z,z-D));
  const peaks = [[-64,-86,62,84],[156,-96,66,96],[46,-128,40,46],[-150,-30,52,66],[244,-34,56,72],[-30,-210,70,124],[124,-220,70,136],[-130,-150,60,100],[230,-160,60,110]];
  const fh = (x,z) => { const rd=Math.abs(x-riverX(z)); let h = 7 + fbm(x*.04,z*.04)*5 + Math.max(0,away(x,z)-10)*.12;
    for(const [px,pz,r,ph] of peaks){ const d=Math.hypot(x-px,z-pz)/r; if(d<1){ const v=ph*Math.pow(1-d,1.25)*(.8+.4*fbm(x*.05,z*.05)); if(v>h) h=v; } }
    if(rd<10 && z>-70 && h<20) return RIV+1; return h; };
  A.farTerrain({ x0:-220, x1:W+220, z0:-240, z1:D+70, base:0, skip:(x,z)=> (x>-1 && x<W+1 && z>-1 && z<D+1),
    h: fh, top:(x,z,y,hc)=> hc*4<=RIV+4 ? "riverIce" : (y*4 > 30 || rand()<.7 ? "snow" : "rockS"), fill:(x,z,y,hc)=> (y*4 > 50 || rand()<.4) ? "rockS" : "rock" });
  const fset = (x,y,z,t) => F.set(Math.floor(x/4),Math.floor(y/4),Math.floor(z/4),t);
  // ferne Türme mit Lichtern
  for(const [tx,tz,hh] of [[-90,30,40],[190,30,44],[4,-90,64],[96,-96,72]]){ const b=fh(tx,tz); for(let y=b;y<b+hh;y+=4) fset(tx,y,tz, (y/4|0)%3===1 ? "winB" : "sbrick"); fset(tx,b+hh,tz,"slate"); fset(tx,b+hh+4,tz,"slate"); fset(tx,b+hh+8,tz,"gold"); }
  // Eisring
  { const cx=46, cy=38, cz=-170; for(const R of [54,58]) for(let a=0;a<Math.PI*2;a+=.012){ const x=cx+Math.cos(a)*R, y=cy+Math.sin(a)*R; if(y<0) continue; fset(x,y,cz,"ringB"); if(R===58 && Math.floor(a*24)%6===0) fset(x,y,cz-4,"glow"); } }

  const creatures = [{ ...polarBear(), at:[riverX(38)-1, RIV+1, 38], yaw:.9, scale:.9 }, { ...polarBear(), at:[riverX(41)+3, RIV+1, 41], yaw:1.6, scale:.5 }];
  return {
    W, D, blocks, spots:S, exposure:1.15, fov:40, creatures,
    sky:[[0,"#020614"],[.35,"#0A1C44"],[.7,"#1E4A80"],[1,"#5A8AC0"]], fog:[0x22406E, 80, 330],
    hemi:[0xBFE0FF, 0x2A3A5A, 1.5], sun:{color:0xCFE6FF, int:1.4, pos:[-40,80,70]}, bloom:[.55,.5,.8],
    lights:[{pos:[S.grammar.x,24,S.grammar.z+8], color:0xFFD27A, int:360, dist:40},
            {pos:[S.vocabulary.x-2,13,S.vocabulary.z-1], color:0xC8A0FF, int:240, dist:22},
            {pos:[S.country.x,16,S.country.z], color:0xFFD27A, int:300, dist:32, flicker:true},
            {pos:[46,14,50], color:0xFFD27A, int:140, dist:22}],
    ribbons:[{w:260, h:30, pos:[W/2,80,-120], rot:[.1,0,0], color:0x4AF0A0, opacity:.3}, {w:220, h:22, pos:[W/2-20,96,-150], rot:[.1,.2,0], color:0x8A6AF0, opacity:.24}],
    particles:[{n:800, area:[-30,W+30,0,70,-30,D+30], vy:-2.4, wob:1.2, color:0xFFFFFF, size:.24, opacity:.9},
               {n:300, area:[-200,W+200,90,200,-260,-120], vy:0, wob:0, color:0xFFFFFF, size:1.4, blink:.6},
               {n:200, area:[0,W,4,40,0,D], vy:0, wob:.2, color:0xBFF8FF, size:.12, add:true, twinkle:true}],
    puffs:[{n:18, pos:[14,22,-176], dx:60, dy:30, dz:0, s0:30, s1:26, color:0xF2F6FF, opacity:.7, speed:.006, spread:24, flat:.9, ry:30},
           {n:10, pos:[20,20,-120], dx:60, dy:8, dz:0, s0:30, s1:24, color:0xDDE8F8, opacity:.45, speed:.008, spread:40, flat:.5}],
    home:{pos:[W/2,42,D+66], look:[W/2,22,D/2-12]}, homePortrait:{pos:[W/2,52,D+110], look:[W/2,30,D/2-12]},
    ui:{bg:"rgba(10,26,54,.88)", border:"#8AE6FF", glow:"rgba(138,230,255,.5)", text:"#EAF6FF", sub:"#A8C8E6", accent:"#8AE6FF", "accent-ink":"#06182E", chip:"rgba(8,22,46,.82)"}
  };
}
