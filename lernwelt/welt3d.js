/* FRS Lernwelten – 3D-Klötzchenwelten.
   Jede Welt liegt als Modul in lernwelt/welten/<name>.js und exportiert build(api).
   build() baut mit den Helfern unten die Klötzchen und liefert Himmel, Licht, Partikel und die Bauplätze der Bereiche.
   start() rendert die Welt, zeigt Beschriftungen und fliegt beim Antippen eines Bereichs hinein. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ---------- Baukasten für die Welten ---------- */
export function makeApi(seedNum){
  let seed = seedNum|0;
  const rand = () => { seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
  const G = 32, grid = Array.from({length:G*G}, rand);
  const vn = (x,y) => { const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi, s=t=>t*t*(3-2*t), g=(a,b)=>grid[((a%G+G)%G)+((b%G+G)%G)*G];
    const a=g(xi,yi), b=g(xi+1,yi), c=g(xi,yi+1), d=g(xi+1,yi+1); return a+(b-a)*s(xf)+(c-a)*s(yf)+(a-b-c+d)*s(xf)*s(yf); };
  const fbm = (x,y) => vn(x,y)*.55 + vn(x*2.1,y*2.1)*.3 + vn(x*4.3,y*4.3)*.15;
  const pick = a => a[Math.floor(rand()*a.length)];

  // Klötzchen
  const V = new Map();
  const key = (x,y,z) => ((x+300)*1000 + (y+300))*1000 + (z+300);
  const set = (x,y,z,t) => { x|=0; y|=0; z|=0; if(t) V.set(key(x,y,z), [x,y,z,t]); else V.delete(key(x,y,z)); };
  const get = (x,y,z) => { const v = V.get(key(x|0,y|0,z|0)); return v ? v[3] : null; };
  const fill = (x0,y0,z0,x1,y1,z1,t) => { for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++) for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++) for(let z=Math.min(z0,z1);z<=Math.max(z0,z1);z++) set(x,y,z,typeof t==="function"?t(x,y,z):t); };
  const walls = (x0,y0,z0,x1,y1,z1,t) => { for(let x=x0;x<=x1;x++) for(let y=y0;y<=y1;y++) for(let z=z0;z<=z1;z++) if(x===x0||x===x1||z===z0||z===z1) set(x,y,z,typeof t==="function"?t(x,y,z):t); };
  const disk = (cx,y,cz,r,t) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++) if(Math.hypot(x-cx,z-cz)<=r+.3) set(x,y,z,typeof t==="function"?t(x,y,z):t); };
  const ring = (cx,y,cz,r,t,w=1) => { for(let x=Math.floor(cx-r-1);x<=Math.ceil(cx+r+1);x++) for(let z=Math.floor(cz-r-1);z<=Math.ceil(cz+r+1);z++){ const d=Math.hypot(x-cx,z-cz); if(d<=r+.3 && d>r-w+.3) set(x,y,z,typeof t==="function"?t(x,y,z):t); } };
  const cyl = (cx,y0,cz,r,h,t) => { for(let y=y0;y<y0+h;y++) disk(cx,y,cz,r,t); };
  const tube = (cx,y0,cz,r,h,t,w=1) => { for(let y=y0;y<y0+h;y++) ring(cx,y,cz,r,t,w); };
  const ball = (cx,cy,cz,r,t,hollow) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){ const d=Math.hypot(x-cx,y-cy,z-cz); if(d<=r+.2 && (!hollow || d>r-1.1)) set(x,y,z,typeof t==="function"?t(x,y,z):t); } };
  const dome = (cx,y0,cz,r,t,hollow) => { for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++) for(let y=y0;y<=y0+r;y++) for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){ const d=Math.hypot(x-cx,y-y0,z-cz); if(d<=r+.2 && (!hollow || d>r-1.1)) set(x,y,z,typeof t==="function"?t(x,y,z):t); } };
  const cone = (cx,y0,cz,r,h,t) => { for(let i=0;i<h;i++) disk(cx,y0+i,cz,r*(1-i/h),t); };
  const line = (x0,y0,z0,x1,y1,z1,t,th=0) => { const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0),Math.abs(z1-z0)))*2||1;
    for(let i=0;i<=n;i++){ const f=i/n, x=Math.round(x0+(x1-x0)*f), y=Math.round(y0+(y1-y0)*f), z=Math.round(z0+(z1-z0)*f); if(th) fill(x-th,y,z-th,x+th,y,z+th,t); else set(x,y,z,t); } };
  const topAt = (x,z,from=140) => { for(let y=from;y>=-40;y--) if(get(x,y,z)) return y; return -99; };
  const terrain = (W,D,hf,layer) => { for(let z=0;z<D;z++) for(let x=0;x<W;x++){ const h=Math.round(hf(x,z)); for(let y=0;y<h;y++){ const t=layer(x,y,z,h); if(t) set(x,y,z,t); } } };

  // 16×16-Pixeltexturen (eigene, im Klötzchen-Stil)
  const tex = draw => { const c=document.createElement("canvas"); c.width=c.height=16; const g=c.getContext("2d"); draw(g);
    const t=new THREE.CanvasTexture(c); t.magFilter=t.minFilter=THREE.NearestFilter; t.colorSpace=THREE.SRGBColorSpace; t.wrapS=t.wrapT=THREE.RepeatWrapping; t.generateMipmaps=false; return t; };
  const P = (g,x,y,c) => { g.fillStyle=c; g.fillRect(x,y,1,1); };
  const noise = (cols, dots, dotCols) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(cols)); for(let i=0;i<(dots||0);i++) P(g,Math.floor(rand()*16),Math.floor(rand()*16),pick(dotCols)); });
  const stripes = (cols, vertical=true, speck) => tex(g=>{ for(let a=0;a<16;a++){ const c=pick(cols); for(let b=0;b<16;b++) P(g, vertical?a:b, vertical?b:a, speck&&rand()<.15?speck:c); } });
  const bricks = (cols, mortar, bh=4, bw=8) => tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++){ const row=Math.floor(y/bh), off=(row%2)*(bw/2); P(g,x,y, (y%bh===bh-1 || (x+off)%bw===bw-1) ? mortar : pick(cols)); } });
  const rings = cols => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++){ const r=Math.max(Math.abs(x-7.5),Math.abs(y-7.5)); P(g,x,y, cols[Math.floor(r/2)%cols.length]); } });
  const topEdge = (base, topCols, depth=3) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y,pick(base)); for(let x=0;x<16;x++){ const d=depth-1+Math.floor(rand()*2); for(let y=0;y<d;y++) P(g,x,y,pick(topCols)); } });
  const planks = (cols, seam) => tex(g=>{ for(let y=0;y<16;y++) for(let x=0;x<16;x++) P(g,x,y, y%4===3 || (x===(Math.floor(y/4)*5)%16) ? seam : pick(cols)); });
  const glassT = (frame, fill) => tex(g=>{ for(let x=0;x<16;x++) for(let y=0;y<16;y++) P(g,x,y, (x===0||y===0||x===15||y===15) ? frame : fill); P(g,3,3,"#ffffff"); P(g,4,3,"#ffffff"); P(g,3,4,"#ffffff"); });
  return { rand, vn, fbm, pick, set, get, fill, walls, disk, ring, cyl, tube, ball, dome, cone, line, topAt, terrain, V,
           tex, P, noise, stripes, bricks, rings, topEdge, planks, glassT };
}

/* ---------- Darstellung ---------- */
export async function start(o){
  // o: { canvasHost, world: build-Ergebnis-Funktion, names:{kat:name}, counts:{kat:n}, icons:{kat:icon}, labelHost, onSelect(kat), lite }
  const api = makeApi(o.seed || 7);
  const world = o.build(api);
  const { get } = api;

  const renderer = new THREE.WebGLRenderer({antialias:!o.lite, alpha:false, powerPreference:"high-performance"});
  const maxPR = o.lite ? 1 : 1.75;
  renderer.setPixelRatio(Math.min(devicePixelRatio, maxPR));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = world.exposure || 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = !o.lite; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  o.canvasHost.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  { const c=document.createElement("canvas"); c.width=2; c.height=256; const g=c.getContext("2d"), gr=g.createLinearGradient(0,0,0,256);
    world.sky.forEach(([p,col])=>gr.addColorStop(p,col)); g.fillStyle=gr; g.fillRect(0,0,2,256);
    const bg=new THREE.CanvasTexture(c); bg.colorSpace=THREE.SRGBColorSpace; scene.background=bg; }
  if(world.fog) scene.fog = new THREE.Fog(world.fog[0], world.fog[1], world.fog[2]);
  const cam = new THREE.PerspectiveCamera(world.fov || 38, innerWidth/innerHeight, .5, 600);

  const h = world.hemi || [0xffffff, 0x666666, 1.3];
  scene.add(new THREE.HemisphereLight(h[0], h[1], h[2]));
  const sd = world.sun || {color:0xffffff, int:2, pos:[-50,80,60]};
  const sun = new THREE.DirectionalLight(sd.color, sd.int); sun.position.set(...sd.pos); sun.castShadow = !o.lite;
  const ext = Math.max(world.W, world.D) * .8;
  Object.assign(sun.shadow.camera, {left:-ext, right:ext, top:ext, bottom:-ext, near:1, far:400}); sun.shadow.mapSize.set(2048,2048); sun.shadow.bias = -.0005;
  sun.target.position.set(world.W/2, 0, world.D/2); scene.add(sun, sun.target);
  const pls = (world.lights||[]).map(l=>{ const p=new THREE.PointLight(l.color, l.int, l.dist||40, 2); p.position.set(...l.pos); p.userData=l; scene.add(p); return p; });

  // Klötzchen nach Typ gruppieren, nur sichtbare
  const B = world.blocks, groups = {};
  const solid = t => t && !(B[t] && (B[t].alpha || B[t].cross));
  for(const [, b] of api.V){ const [x,y,z,t] = b; if(!B[t]) continue;
    const vis = B[t].alpha || !solid(get(x+1,y,z)) || !solid(get(x-1,y,z)) || !solid(get(x,y+1,z)) || !solid(get(x,y-1,z)) || !solid(get(x,y,z+1)) || !solid(get(x,y,z-1));
    if(vis) (groups[t]=groups[t]||[]).push(b); }
  const box = new THREE.BoxGeometry(1,1,1), dummy = new THREE.Object3D(), anim = [];
  let count = 0;
  for(const t in groups){
    const d = B[t];
    const mk = tx => new THREE.MeshLambertMaterial({ map:tx, ...(d.em ? {emissive:0xffffff, emissiveMap:tx, emissiveIntensity:d.em} : {}),
      ...(d.alpha ? {transparent:true, opacity:d.alpha, depthWrite:false} : {}) });
    const side = mk(d.side), top = mk(d.top || d.side), bot = mk(d.bottom || d.top || d.side);
    const mesh = new THREE.InstancedMesh(box, [side,side,top,bot,side,side], groups[t].length);
    groups[t].forEach((b,i)=>{ dummy.position.set(b[0]+.5,b[1]+.5,b[2]+.5); dummy.scale.setScalar(d.scale||1); dummy.updateMatrix(); mesh.setMatrixAt(i,dummy.matrix); });
    mesh.castShadow = !d.em && !d.alpha; mesh.receiveShadow = !d.alpha; if(d.alpha) mesh.renderOrder = 2;
    scene.add(mesh); count += groups[t].length;
    if(d.anim) anim.push([d.side, d.anim], ...(d.top && d.top!==d.side ? [[d.top, d.anim]] : []));
  }
  // Flächen (Meer, Wolken, Lava)
  for(const s of (world.planes||[])){
    const tx = s.tex ? s.tex.clone() : null; if(tx){ tx.repeat.set(s.repeat||100, s.repeat||100); tx.needsUpdate = true; if(s.anim) anim.push([tx, s.anim]); }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(s.size||400, s.size||400), new THREE.MeshLambertMaterial({ color:s.color||0xffffff, map:tx,
      ...(s.em ? {emissive:0xffffff, emissiveMap:tx, emissiveIntensity:s.em} : {}), ...(s.opacity ? {transparent:true, opacity:s.opacity, depthWrite:false} : {}) }));
    m.rotation.x = -Math.PI/2; m.position.set(world.W/2, s.y, world.D/2); m.receiveShadow = !s.opacity; scene.add(m);
  }
  // Lichtstrahlen (z. B. unter Wasser)
  const rays = [];
  if(world.rays){ const c=document.createElement("canvas"); c.width=8; c.height=128; const g=c.getContext("2d"), gr=g.createLinearGradient(0,0,0,128);
    gr.addColorStop(0,"rgba(255,255,255,.9)"); gr.addColorStop(1,"rgba(255,255,255,0)"); g.fillStyle=gr; g.fillRect(0,0,8,128);
    const rt = new THREE.CanvasTexture(c);
    for(let i=0;i<world.rays.n;i++){ const m=new THREE.Mesh(new THREE.PlaneGeometry(2+api.rand()*4, 70), new THREE.MeshBasicMaterial({map:rt, color:world.rays.color, transparent:true, opacity:.16, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
      m.position.set(api.rand()*world.W, 34, api.rand()*world.D); m.rotation.set(0, api.rand()*Math.PI, .25); m.userData.ph = api.rand()*6; scene.add(m); rays.push(m); } }
  // Bänder (Polarlicht)
  const ribbons = [];
  for(const r of (world.ribbons||[])){ const m=new THREE.Mesh(new THREE.PlaneGeometry(r.w, r.h, 40, 1), new THREE.MeshBasicMaterial({color:r.color, transparent:true, opacity:r.opacity||.35, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
    m.position.set(...r.pos); m.rotation.y = r.rot||0; m.userData.base = m.geometry.attributes.position.array.slice(); scene.add(m); ribbons.push(m); }

  // Partikel
  const parts = [];
  for(const p of (world.particles||[])){
    const n = o.lite ? Math.floor(p.n/2) : p.n, pos = new Float32Array(n*3), sp = new Float32Array(n), [x0,x1,y0,y1,z0,z1] = p.area;
    for(let i=0;i<n;i++){ pos[i*3]=x0+api.rand()*(x1-x0); pos[i*3+1]=y0+api.rand()*(y1-y0); pos[i*3+2]=z0+api.rand()*(z1-z0); sp[i]=.5+api.rand(); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos,3));
    const m = new THREE.Points(g, new THREE.PointsMaterial({color:p.color, size:p.size||.3, transparent:true, opacity:p.opacity||.9, depthWrite:false, ...(p.add?{blending:THREE.AdditiveBlending}:{}) }));
    scene.add(m); parts.push({p, g, sp, m, n});
  }
  // Rauch / Wolkenschwaden
  const puffs = [];
  if(world.puffs){ const c=document.createElement("canvas"); c.width=c.height=64; const g=c.getContext("2d"), gr=g.createRadialGradient(32,32,2,32,32,32);
    gr.addColorStop(0,"rgba(255,255,255,.95)"); gr.addColorStop(1,"rgba(255,255,255,0)"); g.fillStyle=gr; g.fillRect(0,0,64,64); const pt=new THREE.CanvasTexture(c);
    for(const pf of world.puffs) for(let i=0;i<pf.n;i++){ const s=new THREE.Sprite(new THREE.SpriteMaterial({map:pt, color:pf.color, transparent:true, depthWrite:false, opacity:pf.opacity||.5}));
      s.userData = {pf, t:i/pf.n, ox:api.rand()}; scene.add(s); puffs.push(s); } }
  // Bewegte Gruppen (Fische, Wal, Vögel …)
  const movers = (world.movers||[]).map(mv=>{ const grp=new THREE.Group();
    for(const [x,y,z,col,em] of mv.cubes){ const m=new THREE.Mesh(box, new THREE.MeshLambertMaterial({color:col, ...(em?{emissive:col, emissiveIntensity:em}:{})})); m.position.set(x,y,z); m.castShadow=true; grp.add(m); }
    grp.scale.setScalar(mv.scale||1); scene.add(grp); return {mv, grp}; });

  // Leuchten
  let composer = null;
  if(world.bloom && !o.lite){ composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, cam));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), world.bloom[0], world.bloom[1], world.bloom[2])); composer.addPass(new OutputPass()); }

  // Beschriftungen
  const spots = world.spots, labels = {};
  for(const k in spots){ if(!o.names[k]) continue;
    const s = spots[k], el = document.createElement("button"); el.className = "wlbl"; el.dataset.kat = k; el.type = "button";
    el.innerHTML = `<span class="wl-ic" aria-hidden="true">${o.icons[k]||""}</span><span class="wl-t">${o.names[k]}</span><span class="wl-n${o.counts[k]?"":" z"}">${o.counts[k]||0}</span>`;
    el.setAttribute("aria-label", `${o.names[k]}: ${o.counts[k]||0}`); o.labelHost.appendChild(el);
    labels[k] = {el, v:new THREE.Vector3(s.top[0]+.5, s.top[1]+ (s.lift ?? 3), s.top[2]+.5)};
    // Lichtsäule
    if(s.beam !== false){ const m=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,60,10,1,true), new THREE.MeshBasicMaterial({color:s.col||0xffffff, transparent:true, opacity:.18, depthWrite:false, blending:THREE.AdditiveBlending}));
      m.position.set(s.top[0]+.5, s.top[1]+31, s.top[2]+.5); scene.add(m); labels[k].beam = m; }
  }
  o.labelHost.addEventListener("click", e=>{ const b=e.target.closest(".wlbl"); if(b) o.onSelect(b.dataset.kat); });

  // Kamera
  const homeFor = () => (cam.aspect < 1 && world.homePortrait) ? world.homePortrait : world.home;
  const curPos = new THREE.Vector3(...homeFor().pos), curLook = new THREE.Vector3(...homeFor().look);
  let from=null, to=null, t0=0, dur=1, focus=null;
  const ease = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
  const fly = (pos, look, d=1.5) => { from={pos:curPos.clone(), look:curLook.clone()}; to={pos:new THREE.Vector3(...pos), look:new THREE.Vector3(...look)}; t0=performance.now(); dur=d*1000; };
  function focusOn(k){ const s = spots[k]; focus = k;
    const c = s.cam || {}, dist = c.dist || 26, side = c.side ?? -.3, up = c.up ?? .5, portrait = cam.aspect < 1;
    const dd = portrait ? dist*1.45 : dist, lookShift = portrait ? 0 : dist*.22;
    fly([s.top[0]+dd*side, (c.y ?? s.base ?? s.top[1]*.6) + dd*up, s.top[2]+dd], [s.top[0]+lookShift, (c.lookY ?? (s.base ?? s.top[1]*.6)+4), s.top[2]]);
    for(const j in labels) labels[j].el.classList.toggle("hide", j!==k); }
  function goHome(){ focus = null; for(const j in labels) labels[j].el.classList.remove("hide"); fly(homeFor().pos, homeFor().look); }

  const v = new THREE.Vector3(); let last = performance.now();
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame(now){
    requestAnimationFrame(frame); const dt = Math.min(.05, (now-last)/1000); last = now;
    if(to){ const p=Math.min(1,(now-t0)/dur), e=ease(p); curPos.lerpVectors(from.pos,to.pos,e); curLook.lerpVectors(from.look,to.look,e); if(p>=1) to=null; }
    const sway = (focus || reduce) ? 0 : Math.sin(now/5200)*2;
    cam.position.set(curPos.x+sway, curPos.y, curPos.z); cam.lookAt(curLook);
    for(const [tx,[ax,ay]] of anim) tx.offset.set(now*ax/1000, now*ay/1000);
    for(const pp of parts){ const a=pp.g.attributes.position.array, p=pp.p, [x0,x1,y0,y1,z0,z1]=p.area;
      for(let i=0;i<pp.n;i++){ const k3=i*3;
        a[k3+1] += p.vy*pp.sp[i]*dt; a[k3] += (p.wob||0)*Math.sin(now/900+i)*dt; a[k3+2] += (p.wob||0)*Math.cos(now/1100+i)*dt*.6;
        if(p.vy>0 && a[k3+1]>y1){ a[k3+1]=y0; a[k3]=x0+Math.random()*(x1-x0); a[k3+2]=z0+Math.random()*(z1-z0); }
        if(p.vy<0 && a[k3+1]<y0){ a[k3+1]=y1; a[k3]=x0+Math.random()*(x1-x0); a[k3+2]=z0+Math.random()*(z1-z0); }
        if(p.vy===0){ a[k3+1] += Math.sin(now/1300+i*1.7)*dt*.4; } }
      pp.g.attributes.position.needsUpdate = true; if(p.twinkle) pp.m.material.opacity = (p.opacity||.9)*(.65+.35*Math.sin(now/400)); }
    for(const s of puffs){ const pf=s.userData.pf; s.userData.t=(s.userData.t+dt*(pf.speed||.05))%1; const t=s.userData.t;
      s.position.set(pf.pos[0]+(pf.dx||0)*t+Math.sin(t*6+s.userData.ox*9)*(pf.spread||2), pf.pos[1]+(pf.dy||0)*t, pf.pos[2]+(pf.dz||0)*t+s.userData.ox*(pf.spread||2));
      const sc=(pf.s0||4)+t*(pf.s1||12); s.scale.set(sc,sc*(pf.flat||1),1); s.material.opacity=(pf.opacity||.5)*Math.sin(Math.PI*t); }
    for(const r of rays){ r.material.opacity = .08 + .08*Math.sin(now/1500 + r.userData.ph); }
    for(const r of ribbons){ const a=r.geometry.attributes.position.array, b=r.userData.base; for(let i=0;i<a.length;i+=3){ a[i+2]=b[i+2]+Math.sin(now/1600+b[i]*.08)*3; a[i+1]=b[i+1]+Math.sin(now/2100+b[i]*.05)*1.2; } r.geometry.attributes.position.needsUpdate=true; }
    for(const {mv,grp} of movers){ const t=now/1000*(mv.speed||.1)+(mv.ph||0), [cx,cy,cz]=mv.center, [rx,rz]=mv.radius;
      grp.position.set(cx+Math.cos(t)*rx, cy+Math.sin(t*2)*(mv.bob||.6), cz+Math.sin(t)*rz); grp.rotation.y = -t + (mv.face||0); }
    for(const l of pls) if(l.userData.flicker) l.intensity = l.userData.int*(.85+.15*Math.sin(now/120+l.position.x));
    for(const k in labels){ const L=labels[k]; if(L.beam) L.beam.material.opacity = (focus && focus!==k) ? .03 : .14 + .05*Math.sin(now/600+k.length); }
    composer ? composer.render() : renderer.render(scene, cam);
    for(const k in labels){ const L=labels[k]; v.copy(L.v).project(cam); const vis = v.z < 1;
      L.el.style.transform = `translate(${((v.x+1)/2*innerWidth).toFixed(1)}px, ${((1-v.y)/2*innerHeight).toFixed(1)}px) translate(-50%,-100%)`; L.el.style.visibility = vis?"visible":"hidden"; }
  }
  function resize(){ renderer.setSize(innerWidth, innerHeight); if(composer) composer.setSize(innerWidth, innerHeight); cam.aspect = innerWidth/innerHeight; cam.updateProjectionMatrix();
    if(!focus && !to){ curPos.set(...homeFor().pos); curLook.set(...homeFor().look); } }
  addEventListener("resize", resize); resize(); requestAnimationFrame(frame);
  return { focus:focusOn, home:goHome, count, renderer };
}
