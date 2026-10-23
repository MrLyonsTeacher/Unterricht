/* FRS Lernwelten – Tiere aus Klötzchen.
   Jedes Tier schaut in +x-Richtung, y ist oben. Es besteht aus Teilen (parts) mit Drehpunkt (pivot) und Bewegung (rot: [Achse, Ausschlag, Tempo, Phase, Grundwinkel]).
   Die Welten setzen sie mit orbit (Kreisbahn) oder at (fester Platz) in world.creatures ein. */

export function M(){
  const c = new Map();
  const put = (x,y,z,col,em) => { x=Math.round(x); y=Math.round(y); z=Math.round(z); if(col===null||col===undefined){ c.delete(`${x},${y},${z}`); return m; } c.set(`${x},${y},${z}`, [x,y,z,col,em?1:0]); return m; };
  const C = (col,x,y,z) => typeof col==="function" ? col(x,y,z) : col;
  const m = {
    put,
    box(x0,y0,z0,x1,y1,z1,col,em){ for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++) put(x,y,z,C(col,x,y,z),em); return m; },
    ell(cx,cy,cz,rx,ry,rz,col,em){ for(let x=Math.floor(cx-rx-1);x<=Math.ceil(cx+rx+1);x++) for(let y=Math.floor(cy-ry-1);y<=Math.ceil(cy+ry+1);y++) for(let z=Math.floor(cz-rz-1);z<=Math.ceil(cz+rz+1);z++)
      if(((x-cx)/(rx+.35))**2+((y-cy)/(ry+.35))**2+((z-cz)/(rz+.35))**2<=1) put(x,y,z,C(col,x,y,z),em); return m; },
    // Glieder: Kette von Kugeln entlang einer Linie, Radius von r0 nach r1
    seg(p0,p1,r0,r1,col,em){ const n=Math.ceil(Math.hypot(p1[0]-p0[0],p1[1]-p0[1],p1[2]-p0[2])*1.5)||1;
      for(let i=0;i<=n;i++){ const f=i/n, r=r0+(r1-r0)*f; m.ell(p0[0]+(p1[0]-p0[0])*f, p0[1]+(p1[1]-p0[1])*f, p0[2]+(p1[2]-p0[2])*f, r, r, r, col, em); } return m; },
    // Fläche (Flügel, Flossen): Vieleck in der x-z-Ebene, y aus Funktion
    poly(pts, yf, col, em){ const xs=pts.map(p=>p[0]), zs=pts.map(p=>p[1]);
      for(let x=Math.floor(Math.min(...xs));x<=Math.ceil(Math.max(...xs));x++) for(let z=Math.floor(Math.min(...zs));z<=Math.ceil(Math.max(...zs));z++){
        let inside=false; for(let i=0,j=pts.length-1;i<pts.length;j=i++){ const [xi,zi]=pts[i], [xj,zj]=pts[j]; if(((zi>z)!==(zj>z)) && (x < (xj-xi)*(z-zi)/(zj-zi)+xi)) inside=!inside; }
        if(inside) put(x, yf(x,z), z, C(col,x,yf(x,z),z), em); } return m; },
    line(p0,p1,col,em){ const n=Math.ceil(Math.max(...[0,1,2].map(i=>Math.abs(p1[i]-p0[i]))))*2||1; for(let i=0;i<=n;i++){ const f=i/n; put(p0[0]+(p1[0]-p0[0])*f, p0[1]+(p1[1]-p0[1])*f, p0[2]+(p1[2]-p0[2])*f, C(col,0,0,0), em); } return m; },
    list(){ return [...c.values()]; },
    mirrorZ(){ const n=M(); for(const [x,y,z,col,em] of c.values()) n.put(x,y,-z,col,em); return n; }
  };
  return m;
}
const part = (m, pivot, rot, extra) => ({ cubes: m.list(), pivot, rot, ...(extra||{}) });

/* ---------- Drache (Feuerwelt) ---------- */
export function dragon(){
  const RED=0x9A1E16, RED2=0x7A1410, BELLY=0xE8A848, SPIKE=0x2A0A08, HORN=0xEFE2C4, MEM=0xC8481E, MEM2=0xA8361A, BONE=0x4A0E0C;
  const body = M(), scales = (x,y,z) => y < -1.2 ? BELLY : ((x+z+y)%3===0 ? RED2 : RED);
  body.ell(0,0,0,7,3,3.2,scales);
  for(let x=-6;x<=6;x+=2){ body.put(x,4,0,SPIKE); if(Math.abs(x)<5) body.put(x,5,0,SPIKE); }
  body.seg([6,1,0],[11,5,0],2.1,1.6,scales);
  for(let i=0;i<3;i++) body.put(7+i*2,4+i*1.6,0, SPIKE), body.put(7+i*2,5+i*1.6,0, SPIKE);
  // Kopf
  body.ell(13,6,0,2.4,1.7,1.7,RED).box(14,4,-1,17,6,1,RED).box(14,4,-1,16,4,1,BELLY);
  body.put(17,6,-1,0x1A0606).put(17,6,1,0x1A0606);                // Nüstern
  body.put(14,7,-2,0xFFE040,1).put(14,7,2,0xFFE040,1);              // Augen
  body.put(13,7,-2,0x2A0A08).put(13,7,2,0x2A0A08);
  body.line([12,8,-1],[9,11,-2],HORN).line([12,8,1],[9,11,2],HORN);  // Hörner
  body.box(15,4,0,16,4,0,0xFFB030,1);                                // Glut im Maul
  for(let x=14;x<=16;x++) body.put(x,3,-1,0xF4EEDC), body.put(x,3,1,0xF4EEDC); // Zähne
  // Beine (angelegt) mit Krallen
  for(const s of [-1,1]){ body.seg([4,-2,2*s],[5,-5,2.4*s],1.2,1,RED); body.put(6,-6,2.4*s,HORN); body.put(5,-6,2.4*s,HORN);
    body.seg([-4,-2,2.4*s],[-2,-5,2.8*s],1.4,1,RED); body.put(-1,-6,2.8*s,HORN); body.put(-2,-6,2.8*s,HORN); }
  // Schwanz
  const tail = M(); const pts = [[-6,0,0],[-11,-.5,0],[-16,-1.5,0],[-21,-2,0]];
  for(let i=0;i<pts.length-1;i++) tail.seg(pts[i],pts[i+1], 2.2-i*.55, 1.6-i*.5, scales);
  for(let x=-8;x<=-18;x-=2) tail.put(x,2-Math.max(0,(-x-8)*.12),0,SPIKE);
  tail.poly([[-21,0],[-24,-2.4],[-27,0],[-24,2.4]], ()=>-2, SPIKE);
  // Flügel
  const wing = M(), shape = [[3,2],[1,11],[-1,22],[-7,19],[-11,14],[-9,8],[-7,2]];
  wing.poly(shape, (x,z)=>2+Math.round(z*.1), (x,y,z)=> (x+z)%4===0 ? MEM2 : MEM);
  wing.line([3,3,2],[1,4,11],BONE).line([1,4,11],[-1,5,22],BONE);
  for(const tip of [[-7,4,19],[-11,3,14],[-9,3,8]]) wing.line([1,4,11],tip,BONE);
  wing.put(-1,6,22,HORN).put(1,5,11,HORN);
  const wingR = wing.mirrorZ();
  return { parts:[ part(body,[0,0,0]), part(tail,[-6,0,0],["y",.22,1.1,0]),
    part(wing,[3,2,2],["x",.6,2.0,0,-.05]), part(wingR,[3,2,-2],["x",-.6,2.0,0,.05]) ] };
}

/* ---------- Adler (Luftwelt) ---------- */
export function eagle(){
  const BR=0x6A4426, BR2=0x5A3820, GOLD=0xC8963E, LIGHT=0xE0B866, DARK=0x2E1E10, BEAK=0xF0C040;
  const body = M();
  body.ell(0,0,0,5,2,2.2,(x,y,z)=> y<-1 ? 0x8A6034 : ((x+z)%3===0?BR2:BR));
  body.ell(5.5,1,0,2.2,1.8,1.7,(x,y,z)=> (x+y)%3===0 ? LIGHT : GOLD);           // Kopf
  body.box(8,0,0,8,1,0,BEAK).put(9,0,0,BEAK).put(9,-1,0,0x8A6A20).put(8,-1,0,BEAK); // Schnabel
  body.put(7,2,-2,0x101010).put(7,2,2,0x101010).put(7,3,-2,LIGHT).put(7,3,2,LIGHT); // Augen, Brauen
  body.poly([[-4,-1.5],[-10,-3.5],[-10,3.5],[-4,1.5]], ()=>0, (x,y,z)=> x<-8 ? DARK : BR2); // Schwanzfächer
  for(const s of [-1,1]) body.box(0,-3,s,1,-2,s,BEAK).put(2,-3,s,DARK);           // Krallen
  const wing = M(), shape=[[3,2],[2.5,9],[1,15],[-1,20],[-4,22],[-6,20],[-6,15],[-5,9],[-4,2]];
  wing.poly(shape, (x,z)=>1+Math.round(z*.09), (x,y,z)=> z>15 || x<-4 ? DARK : (x>1 ? LIGHT : ((x+z)%3===0?BR2:BR)));
  for(const [fx,fz] of [[-5,22],[-7,21],[-8,19],[-8,17]]) wing.line([-3,3,fz-2],[fx,3,fz],DARK); // Schwungfedern
  const wingR = wing.mirrorZ();
  return { parts:[ part(body,[0,0,0]), part(wing,[1,1,2],["x",.22,1.3,0,-.12]), part(wingR,[1,1,-2],["x",-.22,1.3,0,.12]) ] };
}

/* ---------- Wal (Wasserwelt) ---------- */
export function whale(){
  const TOP=0x2E4660, TOP2=0x263C54, BELLY=0xC8D4DE, GROOVE=0x8A9AAA;
  const body = M();
  for(let x=-16;x<=14;x++){ const f=(x+1)/16, r = x>=-1 ? 4.4*Math.sqrt(Math.max(0,1-f*f*.9)) : 4.4*Math.max(.18, 1-((-x-1)/15)**1.3);
    const ry=r*.85, rz=r;
    for(let y=Math.floor(-ry-1);y<=Math.ceil(ry+1);y++) for(let z=Math.floor(-rz-1);z<=Math.ceil(rz+1);z++){
      if((y/(ry+.35))**2+(z/(rz+.35))**2>1) continue;
      let col = y < -ry*.25 ? ((x>0 && z%2===0 && y<-ry*.5) ? GROOVE : BELLY) : ((x+y+z)%4===0 ? TOP2 : TOP);
      body.put(x,y,z,col); } }
  for(const [x,z] of [[10,0],[11,-1],[11,1],[12,0],[9,-2],[9,2]]) body.put(x,Math.round(3.6*.85*Math.sqrt(Math.max(0,1-((x+1)/16)**2*.9)))+1,z,0x1E3046); // Höcker
  body.put(9,0,-4,0x0A0E14).put(9,0,4,0x0A0E14);                                  // Augen
  for(let x=7;x<=14;x++) body.put(x,-1,-3,0x1E3046), body.put(x,-1,3,0x1E3046);    // Maul
  body.box(-8,3,0,-6,4,0,TOP);                                                       // Rückenflosse
  const fin = M(); fin.poly([[6,3.5],[4,6],[-2,12],[-5,13],[-3,10],[3,4]], (x,z)=>-2-Math.round((z-3)*.25), (x,y,z)=> x>1 ? BELLY : 0xB0BEC8);
  const finR = fin.mirrorZ();
  const fluke = M(); fluke.poly([[-15,-1.5],[-18,-5],[-22,-8],[-21,-3],[-20,0],[-21,3],[-22,8],[-18,5],[-15,1.5]], ()=>0, (x,y,z)=> (x+z)%3===0 ? TOP2 : TOP);
  fluke.box(-16,0,-1,-15,0,1,TOP);
  return { parts:[ part(body,[0,0,0]), part(fin,[5,-2,3],["x",.18,.9,0]), part(finR,[5,-2,-3],["x",-.18,.9,0]), part(fluke,[-15,0,0],["z",.32,1.0,0]) ] };
}

/* ---------- Fische ---------- */
export function fish(kind){
  const K = { clown:[0xFF7A1A,0xFFFFFF,0x1A1A1A], tang:[0x2A6AE8,0x0E2A6A,0xFFD23F], yellow:[0xFFD23F,0xFFE680,0xFFB000], pink:[0xFF6FA0,0xFFB0CC,0xE84A80] }[kind] || [0xFF8A3A,0xFFFFFF,0x222222];
  const b = M(); b.ell(0,0,0,2.4,1.4,.6,(x,y,z)=> kind==="clown" ? (x===1||x===-1 ? K[1] : K[0]) : kind==="tang" ? (y>0 ? K[1] : K[0]) : ((x+y)%2 ? K[1] : K[0]));
  b.put(2,1,-1,0x0A0A0A).put(2,1,1,0x0A0A0A).put(0,2,0,K[2]).put(-1,2,0,K[2]);
  const t = M(); t.box(-3,-1,0,-3,1,0,K[2]).box(-4,-2,0,-4,2,0,K[2]);
  return { parts:[ part(b,[0,0,0]), part(t,[-2,0,0],["y",.55,7,0]) ] };
}
export function jelly(col){
  const m = M(); m.ell(0,0,0,2.4,1.8,2.4,(x,y,z)=> y<0 ? undefined : (y===0 ? 0xFFFFFF : col), 1);
  for(const [x,z,n] of [[-2,0,6],[2,0,5],[0,-2,7],[0,2,5],[-1,-1,4],[1,1,6]]) for(let k=1;k<=n;k++) m.put(x+(k%3===0?1:0),-k,z,col,1);
  return { parts:[{cubes:m.list()}], noShadow:true };
}
/* ---------- Einhorn (Waldwelt) ---------- */
export function unicorn(){
  const W=0xF6F6FF, W2=0xE6E8F6, MANE=0xA8C8FF, MANE2=0xD8B8FF, GOLD=0xE8C24A;
  const body = M();
  body.ell(0,6,0,4,2.2,1.8,(x,y,z)=> (x+y+z)%5===0 ? W2 : W);
  for(const [lx,lz] of [[2.5,-1],[2.5,1],[-2.5,-1],[-2.5,1]]){ body.box(lx,1,lz,lx,4,lz,W); body.put(lx,0,lz,GOLD); }
  body.seg([3,7,0],[5,10,0],1.4,1.1,W);
  for(let i=0;i<6;i++) body.put(2+i*.6, 9+i*.6, 0, i%2?MANE:MANE2), body.put(1.6+i*.6, 8+i*.6, 0, MANE);
  const head = M(); head.box(5,9,-1,8,11,1,W).box(8,9,-1,9,10,1,0xF0DCEA).put(9,10,-1,0x8A6A8A).put(9,10,1,0x8A6A8A);
  head.put(7,11,-2,0x2A2A4A).put(7,11,2,0x2A2A4A).put(5,12,-1,W).put(5,12,1,W);   // Augen, Ohren
  head.line([6,12,0],[8,16,0],(x,y,z)=>0xFFFFFF,1); head.put(7,13,0,0xFFE680,1).put(8,15,0,0xFFE680,1);  // Horn
  head.put(5,11,0,MANE).put(4,11,0,MANE2).put(6,12,-1,MANE2);
  const tail = M(); tail.seg([-4,7,0],[-6,4,0],.8,1,MANE).seg([-6,4,0],[-6,1,0],1,.6,MANE2);
  return { parts:[ part(body,[0,0,0]), part(head,[5,9,0],["z",.22,.8,0,-.2]), part(tail,[-4,7,0],["y",.35,1.6,0]) ] };
}

/* ---------- Eisbär (Eiswelt) ---------- */
export function polarBear(o={}){
  const F=0xF2EEE0, F2=0xE4DECC, DARK=0x1A1A1A, step=o.walk ? (o.speed||5) : 0;
  const body = M(); body.ell(0,5,0,4.5,2.6,2.4,(x,y,z)=> (x+y+z)%4===0 ? F2 : F);
  body.ell(-1,6,0,2,2.6,2.4,F); body.put(-5,6,0,F);
  const head = M(); head.ell(6,6,0,1.8,1.5,1.4,F).box(8,5,-1,9,6,1,F).put(10,6,0,DARK).put(10,5,0,F2);
  head.put(8,7,-1,DARK).put(8,7,1,DARK).put(5,8,-1,F2).put(5,8,1,F2);
  const parts = [ part(body,[0,0,0]), part(head,[4,6,0], step ? ["z",.12,step,0] : ["y",.4,.6,0]) ];
  [[2.5,-1.5,0],[2.5,1.5,Math.PI],[-2.5,-1.5,Math.PI],[-2.5,1.5,0]].forEach(([lx,lz,ph])=>{ const l=M().box(lx,0,lz,lx+1,3,lz,F).box(lx,0,lz,lx+1,0,lz,F2); parts.push(part(l,[lx+.5,3.5,lz], step?["z",.45,step,ph]:null)); });
  return { parts };
}

/* ---------- Hirsch (Waldwelt) ---------- */
export function stag(){
  const BR=0x8A5A32, BR2=0x7A4E2A, LIGHT=0xD8B88A, WHITE=0xF4EEE2, ANT=0xE8D6B0, DARK=0x2A1A10;
  const body = M(); body.ell(0,7,0,4,2,1.7,(x,y,z)=> y<6 ? LIGHT : ((x+y+z)%4===0?BR2:BR));
  for(const [lx,lz] of [[2.6,-1],[2.6,1],[-2.6,-1],[-2.6,1]]){ body.box(lx,1,lz,lx,5,lz,BR2); body.put(lx,0,lz,DARK); }
  body.put(-4,8,0,WHITE).put(-5,8,0,WHITE).put(-5,9,0,BR);
  body.seg([3,8,0],[5,11,0],1.3,1,BR);
  const head = M(); head.box(5,11,-1,7,13,1,BR).box(8,11,-1,9,12,1,BR2).put(10,11,0,DARK).put(8,13,-1,DARK).put(8,13,1,DARK).put(7,13,-2,LIGHT).put(7,13,2,LIGHT);
  head.put(6,14,-2,BR).put(6,14,2,BR);
  for(const s of [-1,1]){ head.line([6,14,s],[5,18,3*s],ANT).line([5,18,3*s],[4,22,4*s],ANT).line([5,16,2*s],[8,18,2*s],ANT).line([5,19,3*s],[7,21,4*s],ANT).line([4,20,4*s],[2,22,5*s],ANT).line([4,22,4*s],[5,24,4*s],ANT); }
  const tail = M().put(-5,9,0,BR).put(-5,8,0,WHITE);
  return { parts:[ part(body,[0,0,0]), part(head,[5,11,0],["z",.28,.7,0,-.25]), part(tail,[-4,9,0],["y",.5,3,0]) ] };
}

/* ---------- Frostfuchs (Eiswelt) ---------- */
export function frostFox(o={}){
  const F=o.col||0xEAF4FF, F2=0xC8DEF4, TIP=0x9ACCF0, DARK=0x1A2230, step=o.walk ? (o.speed||9) : 0;
  const body = M(); body.ell(0,4,0,3,1.4,1.2,(x,y,z)=> (x+y)%3===0 ? F2 : F);
  const head = M(); head.ell(4,5,0,1.4,1.2,1.1,F).box(5,4,0,7,4,0,F).put(7,5,0,F).put(8,4,0,DARK).put(5,6,-1,DARK).put(5,6,1,DARK);
  head.box(3,6,-1,3,8,-1,F2).box(3,6,1,3,8,1,F2).put(3,8,-1,TIP).put(3,8,1,TIP);
  const tail = M().seg([-3,5,0],[-6,6,0],1.1,1.5,F).seg([-6,6,0],[-8,5,0],1.5,1,TIP);
  const parts = [ part(body,[0,0,0]), part(head,[3,5,0],["y",.15,step||1.2,0]), part(tail,[-3,5,0],["y",.35,step?step*.5:1.5,0]) ];
  [[2,-1,0],[2,1,Math.PI],[-2,-1,Math.PI],[-2,1,0]].forEach(([lx,lz,ph])=>{ const l=M().box(lx,0,lz,lx,3,lz,F2).put(lx,0,lz,TIP); parts.push(part(l,[lx,3,lz], step?["z",.7,step,ph]:null)); });
  return { parts };
}

/* ---------- Zwerge (Steinwelt) ---------- */
export function dwarf(o={}){
  const TUNIC=o.tunic||0x2F5DA8, BEARD=o.beard||0xC86A2A, SKIN=0xF0C09A, BOOT=0x4A3020, HELM=o.helm||0x9A9EA8, BELT=0xE8B030;
  const body = M();
  body.box(-1,3,-1,1,6,1,TUNIC).box(-1,4,-1,1,4,1,BELT);            // Rumpf mit Gürtel
  body.box(-1,7,-1,1,8,1,SKIN).box(2,6,-1,2,8,1,BEARD).box(2,4,0,2,5,0,BEARD).box(1,5,-1,1,6,1,BEARD);
  body.put(2,8,-1,0x1A1A1A).put(2,8,1,0x1A1A1A).put(2,7,0,0xE0A080);
  body.box(-1,9,-1,1,9,1,HELM).put(0,10,0,HELM).box(2,9,-1,2,9,1,HELM);
  const legL = M().box(0,0,-1,0,2,-1,BOOT), legR = M().box(0,0,1,0,2,1,BOOT);
  const armL = M().box(0,4,-2,0,6,-2,TUNIC).put(0,3,-2,SKIN), armR = M().box(0,4,2,0,6,2,TUNIC).put(0,3,2,SKIN);
  const walk = o.walk ? 7 : 0;
  const parts = [ part(body,[0,0,0]), part(legL,[0,2,-1], walk?["z",.5,walk,0]:null), part(legR,[0,2,1], walk?["z",-.5,walk,0]:null) ];
  if(o.hammer){ const a = M().box(0,4,2,0,6,2,TUNIC).put(0,3,2,SKIN).box(1,3,2,4,3,2,0x6A4A2A).box(4,2,1,5,4,3,0x5A5E66);
    parts.push(part(armL,[0,6,-2]), part(a,[0,6,2],["z",.9,4.5,0,-.4])); }
  else parts.push(part(armL,[0,6,-2], walk?["z",-.4,walk,0]:null), part(armR,[0,6,2], walk?["z",.4,walk,0]:null));
  return { parts };
}

/* ---------- Kleine Vögel ---------- */
export function bird(col=0xFFFFFF){
  const b = M().ell(0,0,0,1.2,.6,.6,col).put(2,0,0,0xF0A030);
  const w = M().poly([[1,0],[0,4],[-1,4],[-1,0]],()=>0,col); const wR = w.mirrorZ();
  return { parts:[ part(b,[0,0,0]), part(w,[0,0,1],["x",.7,6,0]), part(wR,[0,0,-1],["x",-.7,6,0]) ] };
}
