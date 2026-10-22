/* Lernwelt – Spiel-Engine für alle Themen.
   Eine Welt wird mit LW.start({...}) gestartet. Spieltypen:
   memory · quiz · swipe · sortieren · rush · zeitstrahl · satzbau · schaetzen · lueckentext
   Der Ergebnis-Code ist kein Level, sondern eine eigene Seite (#fertig), erreichbar über den Fertig-Knopf. */
(function(){
"use strict";

const TXT = {
  de:{map:"Übersicht",pts:"Punkte",stars:"Sterne",next:"Weiter",check:"Prüfen",again:"Nochmal",nextLvl:"Nächstes Spiel",
      toMap:"Übersicht",right:"Richtig!",wrong:"Leider falsch.",correctIs:"Richtig wäre:",timeUp:"Zeit abgelaufen!",
      start:"Los geht’s",record:"Neuer Bestwert!",best:"Bestwert",open:"noch offen",result:"Auswertung",
      saved:"Dein Fortschritt wird nur auf diesem Gerät gespeichert.",reset:"Alles zurücksetzen",
      resetQ:"Wirklich alles zurücksetzen? Alle Punkte und dein Kürzel werden gelöscht.",
      levelOf:(a,b)=>`${a} von ${b}`,moves:n=>n===1?"1 Zug":`${n} Züge`,correctN:n=>`${n} richtig`,
      pair:"Paar gefunden",grey:"Grauzone – beide Antworten zählen.",undo:"Antippen zum Zurücklegen.",
      orderCheck:"Reihenfolge prüfen",orderInfo:"Du kannst nur einmal prüfen.",correctOrder:"Richtige Reihenfolge",
      estOk:"Schätzung abgeben",bull:"Volltreffer!",close:"Knapp daneben!",off:"Daneben.",yours:"Deine Schätzung:",
      tapGap:"Tippe auf eine Lücke.",chooseFor:"Wähle für Lücke",
      time:"Zeit",score:"Treffer",rushGoal:(z,s)=>`Ziel: ${z} richtige Antworten in ${s} Sekunden`,
      tiles:"Tippe die Wörter in der richtigen Reihenfolge an.",solution:"Lösung:",
      finishBtn:"Fertig? Dann klick hier",finishSub:"Erstelle deinen Ergebnis-Code für deine Lehrkraft.",finishPill:"Fertig?",
      codeTitle:"Dein Ergebnis-Code",codeHow:"Trag dein **Kürzel** ein und tippe auf **Code erstellen**. Zeig den QR-Code dann deiner Lehrkraft.",
      initials:"Dein Kürzel",initialsPh:"z. B. LeMü",create:"Code erstellen",update:"Code aktualisieren",
      codeShow:"Zeig diesen Code deiner Lehrkraft.",codeLater:"Spielst du weiter, komm danach wieder hierher – der Code passt sich an.",
      total:"Gesamt",noQR:"QR-Code konnte nicht erstellt werden. Zeig deiner Lehrkraft den Text darunter.",
      german:"Auf Deutsch",showGerman:"Aufgabe auf Deutsch anzeigen",close:"Schließen",tip:"Tipp:",
      island:"Welt",medalNames:["Noch keine Medaille","Bronze-Medaille","Silber-Medaille","Gold-Medaille"],
      medalNext:(n,p,name)=>`Noch ${n} ${p} bis ${name}`,medalTop:"Höchste Medaille erreicht!",
      medalWon:"Du hast eine neue Medaille gewonnen!",medalOk:"Super!",perfect:"PERFEKT!",
      review:"Lerne aus deinen Fehlern",gap:"Lücke",learn:"Erst lernen",learnAgain:"Infos nochmal ansehen",startGame:"Zum Spiel ▸",read:"Vorlesen",auto:"Abspielen",pause:"Pause",prev:"Zurück",
      videoNote:"Das Video wird von YouTube geladen.",learnFirst:"Schau dir zuerst die Infos an – danach startet das Spiel. Tipp: **Abspielen** und **Vorlesen** antippen."},
  en:{map:"Games",pts:"points",stars:"stars",next:"Next",check:"Check",again:"Play again",nextLvl:"Next game",
      toMap:"All games",right:"Correct!",wrong:"Not quite.",correctIs:"Correct answer:",timeUp:"Time’s up!",
      start:"Start",record:"New best score!",best:"Best",open:"not played yet",result:"See results",
      saved:"Your progress is only saved on this device.",reset:"Start again from zero",
      resetQ:"Delete all points and your initials?",
      levelOf:(a,b)=>`${a} of ${b}`,moves:n=>n===1?"1 move":`${n} moves`,correctN:n=>`${n} correct`,
      pair:"Pair found",grey:"Grey area – both answers count.",undo:"Tap to put it back.",
      orderCheck:"Check the order",orderInfo:"You can only check once.",correctOrder:"Correct order",
      estOk:"Lock in my guess",bull:"Spot on!",close:"Close!",off:"Not close.",yours:"Your guess:",
      tapGap:"Tap a gap.",chooseFor:"Choose for gap",
      time:"Time",score:"Score",rushGoal:(z,s)=>`Goal: ${z} correct answers in ${s} seconds`,
      tiles:"Tap the words in the right order.",solution:"Answer:",
      finishBtn:"If you’re finished, click here",finishSub:"Create your result code for your teacher.",finishPill:"Finished?",
      codeTitle:"Your result code",codeHow:"Type your **initials** and tap **Create code**. Then show the QR code to your teacher.",
      initials:"Your initials",initialsPh:"e.g. LM",create:"Create code",update:"Update code",
      codeShow:"Show this code to your teacher.",codeLater:"If you play more, come back here – the code updates.",
      total:"Total",noQR:"The QR code could not be created. Show your teacher the text below.",
      german:"Auf Deutsch",showGerman:"Aufgabe auf Deutsch anzeigen",close:"Schließen",tip:"Tipp:",
      island:"World",medalNames:["No medal yet","Bronze medal","Silver medal","Gold medal"],
      medalNext:(n,p,name)=>`${n} more ${p} for the ${name.toLowerCase()}`,medalTop:"Top medal – well done!",
      medalWon:"You won a new medal!",medalOk:"Great!",perfect:"PERFECT!",
      review:"Learn from your mistakes",gap:"Gap",learn:"Learn first",learnAgain:"Learn again",startGame:"Start the game ▸",read:"Read aloud",auto:"Play",pause:"Pause",prev:"Back",
      videoNote:"The video is loaded from YouTube.",learnFirst:"First learn the facts – then play the game. Tip: tap **Play** and **Read aloud**."}
};

/* ---------- Medaillen ---------- */
const TIERS = [0.5, 0.75, 0.9];                  // Bronze ab 50 %, Silber ab 75 %, Gold ab 90 %
function tierOf(pts, max){ let t=0; if(max) TIERS.forEach((p,i)=>{ if(pts/max >= p-1e-9) t=i+1; }); return t; }
let MEDAL_UID = 0;
function medalSvg(t, size){
  const C = [["#EEF1F5","#C9D0DA","#9AA3AF"],["#F7C9A0","#C27A45","#7E441C"],["#FBFCFE","#B4BCC8","#6E7887"],["#FFE68A","#E3A51A","#9A6500"]][t];
  const id = "mg"+(++MEDAL_UID), cx=50, cy=78;
  const star = Array.from({length:10},(_,i)=>{ const r=i%2?7.5:17, a=-Math.PI/2+i*Math.PI/5; return (cx+r*Math.cos(a)).toFixed(1)+","+(cy+r*Math.sin(a)).toFixed(1); }).join(" ");
  return `<svg class="medal" viewBox="0 0 100 120" width="${size}" height="${size*1.2}" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C[0]}"/><stop offset=".55" stop-color="${C[1]}"/><stop offset="1" stop-color="${C[2]}"/></linearGradient></defs>
    ${t?`<path d="M28 0 L48 52 L35 58 L15 5 Z" fill="#2F5DA8"/><path d="M72 0 L52 52 L65 58 L85 5 Z" fill="#E0362C"/>`:`<path d="M28 0 L48 52 L35 58 L15 5 Z M72 0 L52 52 L65 58 L85 5 Z" fill="#D5DAE2"/>`}
    <circle cx="${cx}" cy="${cy}" r="36" fill="url(#${id})" stroke="${C[2]}" stroke-width="4" ${t?"":'stroke-dasharray="7 6"'}/>
    <circle cx="${cx}" cy="${cy}" r="27" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
    ${t?`<polygon points="${star}" fill="#fff" fill-opacity=".9" stroke="${C[2]}" stroke-width="2.5" stroke-linejoin="round"/>`:`<text x="50" y="90" text-anchor="middle" font-size="34" font-weight="800" fill="#9AA3AF" font-family="system-ui,sans-serif">?</text>`}
  </svg>`;
}
const FLAG_DE = `<svg viewBox="0 0 5 3" aria-hidden="true"><rect width="5" height="1" fill="#000"/><rect width="5" height="1" y="1" fill="#DD0000"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`;

let W, T, S, KEY, APP, MAX = 0, cleanups = [], CUR = null, RUN = 0;
const LV = () => W.levels;
const $ = (s, el=document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// In Inhalten: **fett**, *kursiv*, ~~durchgestrichen~~
const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/~~(.+?)~~/g, "<s>$1</s>");
function shuffle(a){ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; }
const fmt = (v,d) => Number(v).toLocaleString(W.sprache==="en"?"en-GB":"de-DE",{minimumFractionDigits:d,maximumFractionDigits:d});
const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Punkte ---------- */
function maxOf(lv){
  switch(lv.typ){
    case "memory": return lv.paare.length;
    case "quiz": return lv.fragen.length*(lv.punkte||1);
    case "swipe": return lv.karten.length;
    case "sortieren": return lv.items.length;
    case "rush": return lv.ziel;
    case "zeitstrahl": return lv.items.length;
    case "satzbau": return lv.saetze.length*(lv.punkte||2);
    case "schaetzen": return lv.fragen.length*2;
    case "lueckentext": return (lv.text.match(/\[\[/g)||[]).length;
  }
  return 0;
}
const best = id => (S.lv[id] && S.lv[id].best) || 0;
const played = id => !!S.lv[id];
const total = () => LV().reduce((a,l)=>a+best(l.id),0);
// Live-Stand: Es zählt pro Spiel der beste Versuch. Während eines Spiels zählt der laufende Versuch mit, sobald er den Bestwert übertrifft.
// Fehler sammeln: am Ende eines Spiels als Lern-Box zeigen
let MISS = [];
function miss(q, a, e){ if(!CUR) return; q=String(q??""); if(q && MISS.some(m=>m.q===q)) return; MISS.push({q, a:String(a??""), e:e||""}); }
function liveTotal(){ if(!CUR) return total(); return total() - best(CUR.id) + Math.max(best(CUR.id), Math.min(RUN, maxOf(CUR))); }
function starsFor(pts,max){ if(!max) return 0; const p=pts/max; return p>=.9?3:p>=.6?2:pts>0?1:0; }
const starHtml = n => `<span class="stars" aria-label="${n} von 3">${[0,1,2].map(i=>i<n?"★":`<span class="off">★</span>`).join("")}</span>`;

function load(){
  S = {lv:{}, name:"", done:false, seen:{}};
  try{ const r = JSON.parse(localStorage.getItem(KEY)); if(r){ S.lv=r.lv||{}; S.name=r.name||""; S.done=!!(r.done || (r.ab && r.ab.done)); S.seen=r.seen||{}; } }catch(e){}
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

/* ---------- Effekte ---------- */
function pop(el, text){
  if(!el) return;
  const r = el.getBoundingClientRect(), d = document.createElement("div");
  d.className="pop"; d.textContent=text; d.style.left=(r.left+r.width/2)+"px"; d.style.top=(r.top+8)+"px";
  document.body.appendChild(d); setTimeout(()=>d.remove(), 950);
}
function updateChip(bump){
  const n=$("#ptsNum"); if(!n) return;
  const v = liveTotal(), old = +n.textContent;
  n.textContent = v;
  if(bump && v>old){ const c=$("#ptsChip"); if(c && c.animate) c.animate([{transform:"scale(1)"},{transform:"scale(1.18)"},{transform:"scale(1)"}],{duration:320}); }
}
function fly(fromEl, onLand){
  const to = $("#ptsChip");
  if(!fromEl || !to || reduced() || !document.body.animate){ onLand && onLand(); return; }
  const a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect();
  const x0=a.left+a.width/2, y0=a.top+a.height/2, dx=b.left+b.width/2-x0, dy=b.top+b.height/2-y0;
  const outer=document.createElement("div"), inner=document.createElement("div");
  outer.className="flyer"; outer.style.cssText=`position:fixed;left:${x0}px;top:${y0}px;z-index:55;pointer-events:none;`;
  inner.style.cssText=`font-size:2.2rem;line-height:1;transform:translate(-50%,-50%)`;
  inner.innerHTML = W.sammel || "⭐";
  outer.appendChild(inner); document.body.appendChild(outer);
  outer.animate([{transform:"translateX(0)"},{transform:`translateX(${dx}px)`}],{duration:700,easing:"linear",fill:"forwards"});
  inner.animate([{transform:"translate(-50%,-50%) scale(1)"},{transform:`translate(-50%,calc(-50% + ${Math.min(dy,0)-90}px)) scale(1.25)`,offset:.45},{transform:`translate(-50%,calc(-50% + ${dy}px)) scale(.5)`}],
    {duration:700,easing:"cubic-bezier(.3,.7,.6,1)",fill:"forwards"});
  setTimeout(()=>{ outer.remove(); onLand && onLand(); }, 700);
}
function confetti(n){
  if(reduced()) return; n = n || 120;
  const c=document.createElement("canvas"); c.id="confetti"; document.body.appendChild(c);
  const x=c.getContext("2d"), dpr=window.devicePixelRatio||1; c.width=innerWidth*dpr; c.height=innerHeight*dpr; x.scale(dpr,dpr);
  const cols = W.konfetti || ["#F26A1B","#FFC233","#2E9E66","#2F5DA8"];
  const P = Array.from({length:n},()=>({x:innerWidth/2+(Math.random()-.5)*160,y:innerHeight*.35,vx:(Math.random()-.5)*12,vy:-Math.random()*12-4,s:Math.random()*8+5,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[Math.floor(Math.random()*cols.length)]}));
  let t=0;(function f(){ x.clearRect(0,0,innerWidth,innerHeight);
    P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.6);x.restore();});
    if(++t<110 && c.isConnected) requestAnimationFrame(f); else c.remove(); })();
}
// Punkte gutschreiben: "+n" zeigen, Symbol zum Zähler fliegen lassen, Zähler beim Ankommen erhöhen
function score(el, n){ if(!n) return; RUN += n; pop(el, "+"+n); fly(el, ()=>updateChip(true)); }

/* ---------- Untere Leiste (Feedback + Weiter) ---------- */
function closeSheet(){ const s=$("#sheet"); if(s) s.remove(); const a=$("#area"); if(a) a.style.paddingBottom=""; }
function bar(cls, html){
  closeSheet();
  const d=document.createElement("div"); d.id="sheet"; d.className="sheet "+cls; d.innerHTML=`<div class="sheet-in">${html}</div>`;
  document.body.appendChild(d);
  const a=$("#area"); if(a) a.style.paddingBottom=(d.offsetHeight+10)+"px";
  return d;
}
function sheet(kind, head, body, label, onNext){
  const d = bar(kind, `<div class="sheet-t" role="status"><b>${head}</b>${body?`<div>${body}</div>`:""}</div>${label?`<button class="btn big">${esc(label)}</button>`:""}`);
  const b = d.querySelector(".btn"); if(b){ b.onclick = onNext; setTimeout(()=>b.focus({preventScroll:true}), 30); }
  return d;
}

/* ---------- Gerüst ---------- */
// Wohin führt "Fertig"? In einer Klasseninsel zur Insel, sonst zur eigenen Code-Seite
const finTarget = () => W.insel ? `data-href="${esc(W.insel.href)}#fertig"` : `data-go="fertig"`;
function topbar(o){
  o = o || {};
  const lv = o.lvl;
  return `<div class="topbar">
    ${o.back?`<button class="back" data-go="" aria-label="${T.map}"><span aria-hidden="true">←</span><span class="bl"> ${T.map}</span></button>`:""}
    ${o.island?`<button class="back" data-href="${esc(W.insel.href)}" aria-label="${T.island}"><span aria-hidden="true">${W.insel.icon||"🗺️"}</span><span class="bl"> ${T.island}</span></button>`:""}
    ${o.title?`<div class="tb-title"><span class="ic" aria-hidden="true">${o.icon||"🎯"}</span><div style="min-width:0">${o.art?`<p class="tb-art">${esc(o.art)}</p>`:""}<h1 class="disp">${esc(o.title)}</h1></div></div>`:`<span class="sp"></span>`}
    ${o.pill?`<button class="pill-fin" ${finTarget()}><span aria-hidden="true">🏁</span> ${T.finishPill}</button>`:""}
    <span class="chip" id="ptsChip"><span class="chip-ic" aria-hidden="true">${W.sammel||"⭐"}</span><span id="ptsNum">${liveTotal()}</span><span class="chip-max">/${MAX}</span></span></div>`;
}
function howBox(text, de, tip, extra){
  if(!text) return "";
  return `<div class="how"><div class="how-t">${rich(text)}</div>${extra||""}${de?`
    <button class="flag" data-tr aria-label="${T.showGerman}" aria-expanded="false">${FLAG_DE}</button>
    <div class="tr-pop" hidden role="dialog" aria-label="${T.german}">
      <button class="tr-x" data-trx aria-label="${T.close}">×</button>
      <p class="tr-h"><span class="tr-flag">${FLAG_DE}</span> ${T.german}</p>
      <p>${rich(de)}</p>${tip?`<p class="tr-tip"><b>${T.tip}</b> ${rich(tip)}</p>`:""}
    </div>`:""}</div>`;
}
function fit(){
  const a=$("#area"); if(!a) return;
  const top = a.getBoundingClientRect().top + window.scrollY;
  const v = Math.max(300, Math.round(window.innerHeight - top - 14));
  document.documentElement.style.setProperty("--avail", v+"px");
}

function home(){
  const lvls = LV();
  const st = lvls.reduce((a,l)=>a+starsFor(best(l.id),maxOf(l)),0);
  const tier = tierOf(total(), MAX), nextP = TIERS[tier] !== undefined ? Math.ceil(TIERS[tier]*MAX - 1e-9) - total() : 0;
  return topbar({island:!!W.insel}) + `<header class="hero">${W.hero}</header>
  <button class="finish-banner" ${finTarget()}><span class="fb-flag" aria-hidden="true"></span>
    <span class="fb-txt"><b>${T.finishBtn}</b><span>${T.finishSub}</span></span><span class="fb-arrow" aria-hidden="true">🏁</span></button>
  <div class="stats">
    <div class="panel stat"><b>${total()}<small> / ${MAX}</small></b><span>${T.pts}</span><div class="meter"><i style="width:${Math.round(total()/MAX*100)}%"></i></div></div>
    <div class="panel stat"><b>${st}<small> / ${lvls.length*3}</small></b><span>${T.stars}</span><div class="meter"><i style="width:${Math.round(st/(lvls.length*3)*100)}%"></i></div></div>
    <div class="panel stat medal-stat${tier?" has":""}">${medalSvg(tier, 46)}<div><b class="m-name">${T.medalNames[tier]}</b>
      <span>${tier>=3 ? T.medalTop : T.medalNext(nextP, T.pts, T.medalNames[tier+1])}</span></div></div>
  </div>
  <div class="levels">${lvls.map(l=>{
    const m=maxOf(l), b=best(l.id);
    return `<button class="panel lvl" data-go="l=${esc(l.id)}">
      <span class="ic" aria-hidden="true">${l.icon||"🎯"}</span>
      <span class="t">${esc(l.titel)}</span>
      <span class="k">${deckOf(l)?"📖 ":""}${esc(l.art||"")}</span>
      <span class="s"><span>${played(l.id)?`${T.best}: ${b}/${m}`:T.open}</span>${starHtml(starsFor(b,m))}</span></button>`;}).join("")}</div>
  <div class="foot"><span>${T.saved}</span><button id="lwReset">${T.reset}</button></div>`;
}

function render(){
  cleanups.forEach(f=>{ try{f();}catch(e){} }); cleanups=[];
  document.querySelectorAll("#confetti,.pop,.flyer,.medal-pop").forEach(x=>x.remove());
  closeSheet(); CUR=null; RUN=0; MISS=[];
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  const h = location.hash.slice(1);
  if(h==="fertig" && W.insel){ location.replace(W.insel.href+"#fertig"); return; }
  if(h==="fertig"){
    APP.innerHTML = topbar({back:true, title:T.codeTitle, icon:"🏁"}) + howBox(T.codeHow, W.sprache==="en"?TXT.de.codeHow:null) + `<div id="area"></div>`;
    document.title = T.codeTitle+" – "+W.titel; fit(); finale($("#area")); return;
  }
  const lm = h.match(/^learn=(.+)$/), ll = lm && LV().find(x=>x.id===decodeURIComponent(lm[1]));
  if(ll && deckOf(ll)){ learnScreen(ll); return; }
  const m = h.match(/^l=(.+)$/), l = m && LV().find(x=>x.id===decodeURIComponent(m[1]));
  if(!l){ APP.innerHTML = home(); document.title = W.titel; return; }
  if(deckOf(l) && !S.seen[deckKey(l)]){ history.replaceState(null, "", "#learn="+encodeURIComponent(l.id)); learnScreen(l); return; }
  CUR = l;
  const again = deckOf(l) ? `<button class="ln-again" data-go="learn=${esc(l.id)}" aria-label="${T.learnAgain}" title="${T.learnAgain}">📖</button>` : "";
  APP.innerHTML = topbar({back:true, title:l.titel, icon:l.icon, art:l.art, pill:true}) + howBox(l.anleitung, l.anleitungDe, l.tipp, again) + `<div id="area"></div>`;
  document.title = l.titel+" – "+W.titel;
  fit();
  const A = $("#area");
  GAMES[l.typ](l, A, (pts, info)=>finish(l, A, pts, info));
}

/* ---------- Erst lernen: animierte Info-Folien vor einem Spiel ---------- */
// level.lernen = { titel, folien:[{bild, jahr, titel, text, de} | {video:"YouTube-ID", titel, text, de}] }
// oder ein Name aus W.lernen (dann teilen sich mehrere Spiele dieselben Folien).
const deckOf = l => !l || !l.lernen ? null : (typeof l.lernen === "string" ? (W.lernen||{})[l.lernen] : l.lernen);
const deckKey = l => typeof l.lernen === "string" ? l.lernen : l.id;
const yearNum = j => { const m = String(j||"").match(/(\d[\d,]*)/); if(!m) return null; const n = +m[1].replace(/,/g,""); return /BC/i.test(j) ? -n : n; };
const plain = t => String(t||"").replace(/\*\*|~~|\*/g, "");
function learnScreen(l){
  const D = deckOf(l), F = D.folien, key = deckKey(l), seen = !!S.seen[key];
  APP.innerHTML = topbar({back:true, title:D.titel || l.titel, icon:"📖", art:T.learn}) + howBox(T.learnFirst, W.sprache==="en"?TXT.de.learnFirst:null) + `<div id="area"></div>`;
  document.title = (D.titel || l.titel)+" – "+W.titel; fit();
  const A = $("#area"), canSpeak = "speechSynthesis" in window && window.SpeechSynthesisUtterance;
  A.innerHTML = `<div class="learn">
    <div class="panel ln-stage" id="lnStage"></div>
    <div class="ln-track"><span class="ln-line"><i id="lnFill"></i></span>${F.map((f,k)=>`<button class="ln-dot" data-k="${k}" aria-label="${k+1}"><i>${f.video?"▶":""}</i>${f.jahr?`<small>${esc(f.jahr)}</small>`:""}</button>`).join("")}</div>
    <div class="ln-ctrl">
      <button class="btn alt ln-b" id="lnPrev" aria-label="${T.prev}">◀</button>
      <button class="btn alt ln-b" id="lnAuto" aria-pressed="false">▶ ${T.auto}</button>
      ${canSpeak?`<button class="btn alt ln-b" id="lnVoice" aria-pressed="false">🔊 ${T.read}</button>`:""}
      <button class="btn alt ln-b" id="lnNext" aria-label="${T.next}">${T.next} ▸</button>
      <span class="sp"></span>
      <button class="btn big" id="lnGo" ${seen?"":"disabled"}>${T.startGame}</button>
    </div></div>`;
  let i = -1, auto = false, voice = false, tm = null, raf = null;
  const stop = () => { clearTimeout(tm); cancelAnimationFrame(raf); try{ canSpeak && speechSynthesis.cancel(); }catch(e){} };
  cleanups.push(stop);
  function voiceFor(){ try{ const v = speechSynthesis.getVoices(), lang = W.sprache==="en" ? "en" : "de";
    return (lang==="en" && v.find(x=>/en[-_]GB/i.test(x.lang))) || v.find(x=>x.lang && x.lang.toLowerCase().startsWith(lang)) || null; }catch(e){ return null; } }
  function say(f, then){
    try{ speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(plain((f.titel?f.titel+". ":"")+(f.text||"")));
      const v = voiceFor(); if(v) u.voice = v; u.lang = v ? v.lang : (W.sprache==="en"?"en-GB":"de-DE"); u.rate = .9;
      u.onend = () => then && then(); speechSynthesis.speak(u); }catch(e){ then && then(); }
  }
  function schedule(){
    clearTimeout(tm); const f = F[i];
    if(!auto) { if(voice && !f.video) say(f); return; }
    if(f.video){ setAuto(false); return; }
    const go = () => { if(!auto) return; if(i < F.length-1) show(i+1); else setAuto(false); };
    if(voice) say(f, ()=>{ tm = setTimeout(go, 900); });
    else tm = setTimeout(go, Math.max(4500, plain(f.titel+" "+f.text).split(/\s+/).length*360));
  }
  function setAuto(on){ auto = on; const b=$("#lnAuto"); if(b){ b.setAttribute("aria-pressed", on); b.textContent = on ? "⏸ "+T.pause : "▶ "+T.auto; } if(on) schedule(); else { clearTimeout(tm); } }
  function countYear(el, from, to, label){
    if(from===null || to===null || from===to || reduced()){ el.textContent = label; return; }
    const t0 = performance.now(), dur = 1000;
    const step = now => { const k = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-k,3), n = Math.round(from+(to-from)*e);
      el.textContent = k<1 ? (n<0 ? `${-n} BC` : String(n)) : label; if(k<1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  function show(k){
    const prev = F[i]; i = k; const f = F[i]; cancelAnimationFrame(raf); try{ canSpeak && speechSynthesis.cancel(); }catch(e){}
    const st = $("#lnStage");
    st.innerHTML = f.video
      ? `<div class="ln-video"><div class="ln-vbox" id="lnV"><button class="ln-play" data-yt="${esc(f.video)}" aria-label="Play video">▶</button><p>${T.videoNote}</p></div>
          <div class="ln-body"><h2 class="disp ln-t">${rich(f.titel||"")}</h2><p class="ln-x">${rich(f.text||"")}</p>${f.de?`<details class="ln-de"><summary>${FLAG_DE} Deutsch</summary><p>${rich(f.de)}</p></details>`:""}</div></div>`
      : `<div class="ln-art"><span>${f.bild||"📌"}</span></div>
         <div class="ln-body">${f.jahr?`<div class="ln-year" id="lnYear">${esc(f.jahr)}</div>`:""}<h2 class="disp ln-t">${rich(f.titel||"")}</h2><p class="ln-x">${rich(f.text||"")}</p>
           ${f.de?`<details class="ln-de"><summary>${FLAG_DE} Deutsch</summary><p>${rich(f.de)}</p></details>`:""}</div>`;
    st.insertAdjacentHTML("beforeend", `<span class="ln-n">${i+1} / ${F.length}</span>`);
    if(f.jahr) countYear($("#lnYear"), prev && prev.jahr ? yearNum(prev.jahr) : null, yearNum(f.jahr), f.jahr);
    A.querySelectorAll(".ln-dot").forEach((d,n)=>{ d.classList.toggle("on", n===i); d.classList.toggle("done", n<i); });
    $("#lnFill").style.width = (F.length>1 ? i/(F.length-1)*100 : 100)+"%";
    $("#lnPrev").disabled = i===0; $("#lnNext").disabled = i===F.length-1;
    if(i===F.length-1){ $("#lnGo").disabled = false; }
    schedule();
  }
  A.onclick = e => {
    const d = e.target.closest("[data-k]"); if(d){ show(+d.dataset.k); return; }
    if(e.target.closest("#lnPrev") && i>0){ show(i-1); return; }
    if(e.target.closest("#lnNext") && i<F.length-1){ show(i+1); return; }
    if(e.target.closest("#lnAuto")){ if(!auto && i===F.length-1) show(0); setAuto(!auto); return; }
    if(e.target.closest("#lnVoice")){ voice = !voice; const b=$("#lnVoice"); b.setAttribute("aria-pressed", voice); if(voice){ if(!F[i].video) say(F[i], auto ? ()=>{ tm=setTimeout(()=>{ if(auto) (i<F.length-1 ? show(i+1) : setAuto(false)); }, 900); } : null); } else { try{ speechSynthesis.cancel(); }catch(err){} if(auto) schedule(); } return; }
    const y = e.target.closest("[data-yt]");
    if(y){ setAuto(false); $("#lnV").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(y.dataset.yt)}?rel=0&autoplay=1&playsinline=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`; return; }
    if(e.target.closest("#lnGo")){ stop(); S.seen[key] = 1; save(); location.hash = "l="+encodeURIComponent(l.id); }
  };
  show(0);
}

function finish(l, A, pts, info){
  closeSheet();
  const m = maxOf(l), old = S.lv[l.id], rec = old && pts > old.best, before = total();
  S.lv[l.id] = {best: Math.max(pts, old?old.best:0), runs:(old?old.runs:0)+1}; save();
  const tierBefore = tierOf(before, MAX), tierAfter = tierOf(total(), MAX), perfect = m>0 && pts===m;
  CUR = null; RUN = 0; updateChip(false);
  const st = starsFor(pts, m), idx = LV().indexOf(l), nx = LV()[idx+1];
  const msg = (W.lob||{})[st] || "", rv = MISS.slice(0, 40);
  const rvHtml = rv.length ? `<section class="panel review" aria-label="${T.review}"><h3 class="rv-h">📚 ${T.review}</h3><ul class="rv-list">${rv.map(x=>`<li>${x.q?`<span class="rv-q">${rich(x.q)}</span>`:""}<span class="rv-a">✔ ${rich(x.a)}</span>${x.e?`<span class="rv-e">${rich(x.e)}</span>`:""}</li>`).join("")}</ul></section>` : "";
  A.innerHTML = `<div class="res-wrap${rv.length?" has-rv":""}"><div class="panel result" role="status">
    ${perfect?`<div class="stamp" aria-hidden="true">${T.perfect}</div>`:""}
    <div class="bigstars">${starHtml(st)}</div>
    <p class="pts">${pts} / ${m}</p>
    ${info?`<p class="res-info">${esc(info)}</p>`:""}
    ${msg?`<p class="res-msg">${esc(msg)}</p>`:""}
    ${rec?`<span class="rec">${T.record}</span>`:""}
    <div class="row">${nx?`<button class="btn big" data-go="l=${esc(nx.id)}">${T.nextLvl}: ${esc(nx.titel)}</button>`:`<button class="btn big" ${finTarget()}>🏁 ${T.finishBtn}</button>`}
      <button class="btn alt" data-again>${T.again}</button><button class="btn alt" data-go="">${T.toMap}</button></div></div>${rvHtml}</div>`;
  if(perfect || st===3) confetti(140); else if(st===2) confetti(45);
  if(tierAfter > tierBefore) setTimeout(()=>medalPop(tierAfter), perfect||st===3 ? 1300 : 600);
}
function medalPop(t){
  const d=document.createElement("div"); d.className="medal-pop"; d.setAttribute("role","dialog"); d.setAttribute("aria-label", T.medalNames[t]);
  d.innerHTML = `<div class="mp-card"><div class="mp-medal">${medalSvg(t, 150)}</div>
    <h2 class="disp">${T.medalNames[t]}</h2><p>${T.medalWon}</p><p class="mp-pts">${W.sammel||"⭐"} ${total()} / ${MAX}</p>
    <button class="btn big">${T.medalOk}</button></div>`;
  document.body.appendChild(d); confetti(160);
  const b=d.querySelector(".btn"); b.focus({preventScroll:true}); b.onclick=()=>d.remove();
}

function progressBar(arr, cur){ return `<div class="progress" aria-hidden="true">${arr.map((v,i)=>`<i class="${v===true?"ok":v===false?"no":i===cur?"cur":""}"></i>`).join("")}</div>`; }
const fill = (res, n) => res.concat(Array(Math.max(0,n-res.length)).fill(null));

/* ---------- Spiele ---------- */
const GAMES = {};

GAMES.memory = (l, A, done) => {
  const cards = shuffle(l.paare.flatMap((p,i)=>[{i,t:p.a,term:true},{i,t:p.b,term:false}]));
  const cols = 4, rows = Math.ceil(cards.length/cols);
  let open=[], found=new Set(), moves=0, lock=false;
  A.innerHTML = `<div class="mem" style="grid-template-columns:repeat(${cols},minmax(0,1fr));grid-template-rows:repeat(${rows},minmax(0,1fr))">${cards.map((c,k)=>`<button class="mcard" data-k="${k}" aria-label="Karte ${k+1}">
    <span class="in"><span class="f" aria-hidden="true">${W.kartenSymbol||"?"}</span><span class="b${c.term?" term":""}">${esc(c.t)}</span></span></button>`).join("")}</div>
    <p id="memInfo" class="mem-info" aria-live="polite">${T.moves(0)}</p>`;
  A.onclick = e => {
    const b = e.target.closest(".mcard"); if(!b || lock) return;
    const k = +b.dataset.k; if(found.has(cards[k].i) || open.includes(k)) return;
    b.classList.add("open"); b.setAttribute("aria-label", cards[k].t); open.push(k);
    if(open.length<2) return;
    moves++; const [x,y] = open;
    if(cards[x].i===cards[y].i){
      found.add(cards[x].i); [x,y].forEach(z=>A.querySelector(`[data-k="${z}"]`).classList.add("done")); open=[];
      const p = l.paare[cards[x].i];
      $("#memInfo").innerHTML = `<b>${T.pair}:</b> ${esc(p.a)} – ${esc(p.b)} · ${T.moves(moves)}`;
      if(found.size===l.paare.length){
        const N=l.paare.length, extra=Math.max(0,moves-N-2), pts=Math.max(Math.ceil(N/2), N-Math.floor(extra/2));
        lock=true; score($("#memInfo"), pts);
        setTimeout(()=>done(pts, T.moves(moves)), 1100);
      } else pop(b,"✓");
    } else {
      lock=true; $("#memInfo").textContent = T.moves(moves);
      setTimeout(()=>{ [x,y].forEach(z=>A.querySelector(`[data-k="${z}"]`).classList.remove("open")); open=[]; lock=false; }, 1100);
    }
  };
};

GAMES.quiz = (l, A, done) => {
  const qs = l.mischen===false ? l.fragen.slice() : shuffle(l.fragen), P = l.punkte||1, res = [];
  let i=0, pts=0, tId=null, answered=false;
  cleanups.push(()=>clearInterval(tId));
  function show(){
    closeSheet(); answered=false;
    const q = qs[i], order = shuffle(q.o.map((_,j)=>j));
    A.innerHTML = progressBar(fill(res,qs.length), i) +
      `<div class="panel qpanel">
        ${l.zeit?`<div class="timer" id="tm"><i></i></div>`:""}
        ${q.szene?`<p class="scene"><span class="scene-n">${esc(l.szenenLabel||"")} ${i+1}/${qs.length}</span>${rich(q.szene)}</p>`:""}
        <p class="q">${rich(q.q)}</p>
        <div class="opts g2">${order.map(j=>`<button class="opt" data-j="${j}">${esc(q.o[j])}</button>`).join("")}</div></div>`;
    if(l.zeit){
      const end = Date.now()+l.zeit*1000, b=$("#tm i"), box=$("#tm");
      tId = setInterval(()=>{ const left=(end-Date.now())/1000; b.style.width=Math.max(0,left/l.zeit*100)+"%";
        if(left<l.zeit*.25) box.classList.add("low"); if(left<=0) answer(-1); }, 80);
    }
  }
  function answer(j){
    if(answered) return; answered=true; clearInterval(tId);
    const q = qs[i], ok = j===q.c;
    A.querySelectorAll(".opt").forEach(b=>{ const k=+b.dataset.j; b.disabled=true; if(k===q.c) b.classList.add("right"); else if(k===j) b.classList.add("wrong"); });
    res.push(ok);
    if(ok){ pts+=P; score(A.querySelector(`.opt[data-j="${q.c}"]`), P); } else { A.querySelector(".qpanel").classList.add("shake"); miss((q.szene?q.szene+" – ":"")+q.q, q.o[q.c], q.e); }
    const head = ok ? `${l.richtigText||T.right} +${P}` : `${j===-1?T.timeUp:T.wrong} ${T.correctIs} „${q.o[q.c]}“`;
    sheet(ok?"ok":"no", esc(head), rich(q.e||""), i<qs.length-1?T.next:T.result, ()=>{ i++; if(i<qs.length) show(); else done(pts, T.correctN(res.filter(Boolean).length)+" / "+qs.length); });
  }
  A.onclick = e => { const o = e.target.closest(".opt"); if(o) answer(+o.dataset.j); };
  show();
};

GAMES.swipe = (l, A, done) => {
  const cs = shuffle(l.karten), res=[]; let i=0, pts=0, busy=false;
  function show(){
    closeSheet();
    const c = cs[i], nx = cs[i+1];
    A.innerHTML = progressBar(fill(res,cs.length), i) +
      `<div class="swipe-wrap">${nx?`<div class="panel scard behind" aria-hidden="true">${rich(nx.t)}</div>`:""}
        <div class="panel scard" id="sc"><span class="tag l">${esc(l.links.t)}</span><span class="tag r">${esc(l.rechts.t)}</span><span class="sc-t">${rich(c.t)}</span></div></div>
      <div id="sbtn" class="swipe-btns"><button class="btn l" data-d="l">${l.links.icon||"←"} ${esc(l.links.t)}</button><button class="btn r" data-d="r">${esc(l.rechts.t)} ${l.rechts.icon||"→"}</button></div>`;
    busy=false; drag($("#sc"));
  }
  function drag(el){
    let sx=0, dx=0, on=false;
    el.addEventListener("pointerdown", e=>{ if(busy) return; on=true; sx=e.clientX; el.setPointerCapture(e.pointerId); el.style.transition="none"; });
    el.addEventListener("pointermove", e=>{ if(!on) return; dx=e.clientX-sx; el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;
      el.querySelector(".tag.l").style.opacity=Math.min(1,Math.max(0,-dx/90)); el.querySelector(".tag.r").style.opacity=Math.min(1,Math.max(0,dx/90)); });
    const up = ()=>{ if(!on) return; on=false; el.style.transition="transform .25s";
      if(Math.abs(dx)>90) decide(dx<0?"l":"r"); else { el.style.transform=""; el.querySelectorAll(".tag").forEach(t=>t.style.opacity=0); } dx=0; };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  }
  function decide(d){
    if(busy) return; busy=true;
    const c=cs[i], el=$("#sc"), ok = c.r==="beide" || c.r===d, btn=$(`#sbtn [data-d="${d}"]`);
    if(ok){ pts++; score(btn, 1); }
    res.push(ok);
    el.style.transition="transform .3s, opacity .3s"; el.style.transform=`translateX(${d==="l"?-420:420}px) rotate(${d==="l"?-18:18}deg)`; el.style.opacity="0";
    A.querySelectorAll("#sbtn .btn").forEach(b=>b.disabled=true);
    const corr = c.r==="l"?l.links.t:l.rechts.t;
    if(!ok) miss(c.t, corr, c.e);
    const head = c.r==="beide" ? T.grey+" +1" : ok ? T.right+" +1" : `${T.wrong} ${T.correctIs} „${corr}“`;
    sheet(ok?"ok":"no", esc(head), `<span class="quote">„${rich(c.t)}“</span> ${rich(c.e||"")}`, i<cs.length-1?T.next:T.result,
      ()=>{ i++; if(i<cs.length) show(); else done(pts, T.correctN(pts)+" / "+cs.length); });
  }
  A.onclick = e => { const b = e.target.closest("[data-d]"); if(b) decide(b.dataset.d); };
  show();
};

GAMES.sortieren = (l, A, done) => {
  const its = shuffle(l.items), res=[], cnt=l.koerbe.map(()=>0); let i=0, pts=0, lock=false, tm=null;
  cleanups.push(()=>clearTimeout(tm));
  const nextItem = () => { i++; if(i<its.length) show(); else done(pts, T.correctN(pts)+" / "+its.length); };
  function show(){
    closeSheet();
    const it = its[i];
    A.innerHTML = progressBar(fill(res,its.length), i) +
      `<div class="panel sort-item" id="si">${esc(it.t)}</div>
      <div class="bins">${l.koerbe.map((k,j)=>`<button class="bin" data-b="${j}"><b>${esc(k.t)}</b>${k.info?`<small>${esc(k.info)}</small>`:""}<span class="cnt">${cnt[j]}</span></button>`).join("")}</div>`;
    lock=false;
  }
  A.onclick = e => {
    const b = e.target.closest("[data-b]"); if(!b || lock) return; lock=true;
    const j=+b.dataset.b, it=its[i], ok = j===it.k; cnt[it.k]++; res.push(ok);
    const right = A.querySelector(`[data-b="${it.k}"]`); right.classList.add("hit"); right.querySelector(".cnt").textContent=cnt[it.k];
    if(ok){ pts++; score(b,1);
      if(it.e){ sheet("ok", esc(T.right+" +1"), rich(it.e)); tm=setTimeout(nextItem, 1600); } else tm=setTimeout(nextItem, 650);
    } else {
      b.classList.add("miss","shake"); $("#si").classList.add("shake"); miss(it.t, l.koerbe[it.k].t, it.e||l.koerbe[it.k].tipp);
      sheet("no", esc(`${T.wrong} ${T.correctIs} „${l.koerbe[it.k].t}“`), rich(it.e||l.koerbe[it.k].tipp||""), i<its.length-1?T.next:T.result, nextItem);
    }
  };
  show();
};

GAMES.rush = (l, A, done) => {
  const dur = l.zeit||60; let pool=[], hits=0, combo=0, left=dur, tId=null, lock=false, cur=null, over=false;
  cleanups.push(()=>clearInterval(tId));
  A.innerHTML = `<div class="panel rush-start"><p class="q">${T.rushGoal(l.ziel, dur)}</p><button class="btn big" id="go">${T.start}</button></div>`;
  function next(){
    if(over || !$("#rq")) return;
    if(!pool.length) pool = shuffle(l.items);
    cur = pool.pop(); const order = l.fest ? cur.o.map((_,j)=>j) : shuffle(cur.o.map((_,j)=>j));
    $("#rq").innerHTML = rich(cur.q);
    $("#ro").innerHTML = order.map(j=>`<button class="opt" data-j="${j}">${esc(cur.o[j])}</button>`).join("");
    lock=false;
  }
  function tick(){ left--; $("#rt").textContent=left; if(left<=10) $("#rt").classList.add("low"); if(left<=0) end(); }
  function end(){ over=true; clearInterval(tId); lock=true; setTimeout(()=>done(Math.min(hits,l.ziel), T.correctN(hits)+(hits>l.ziel?" 🔥":"")), 750); }
  function play(){
    A.innerHTML = `<div class="rush-top"><div><span class="lbl">${T.time}</span><div class="rush-big" id="rt">${dur}</div></div>
      <div class="combo" id="cb"></div><div style="text-align:right"><span class="lbl">${T.score}</span><div class="rush-big" id="rs">0</div></div></div>
      <div class="timer"><i id="rbar" style="width:0%"></i></div>
      <div class="panel rush-q" id="rq"></div><div class="opts rush-o" id="ro"></div>`;
    next(); tId = setInterval(tick, 1000);
  }
  A.onclick = e => {
    if(e.target.closest("#go")){
      let n=3; A.innerHTML=`<div class="count" id="cd">3</div>`;
      const c = setInterval(()=>{ n--; if(n>0) $("#cd").textContent=n; else { clearInterval(c); play(); } }, 700); cleanups.push(()=>clearInterval(c)); return;
    }
    const o = e.target.closest(".opt"); if(!o || lock || over) return; lock=true;
    const j=+o.dataset.j;
    if(j===cur.c){ hits++; combo++; o.classList.add("right");
      if(hits<=l.ziel) score(o, 1); else pop(o, "🔥");
      $("#rs").textContent=hits; $("#rbar").style.width=Math.min(100,hits/l.ziel*100)+"%";
      $("#cb").textContent = combo>=3 ? `🔥 ×${combo}` : ""; setTimeout(next, 280);
    } else { combo=0; $("#cb").textContent=""; o.classList.add("wrong","shake"); miss(cur.q, cur.o[cur.c], cur.e);
      A.querySelector(`.opt[data-j="${cur.c}"]`).classList.add("right"); setTimeout(next, 900); }
  };
};

GAMES.zeitstrahl = (l, A, done) => {
  const pool = shuffle(l.items.map((_,i)=>i)); let ord=[], checked=false, pts=0;
  function show(){
    const slots = l.items.map((_,k)=>{ const ev=ord[k];
      if(ev===undefined) return `<div class="slot"><span class="n">${k+1}</span><span class="empty">…</span></div>`;
      const st = checked?(ev===k?" ok":" no"):"";
      return `<button class="slot filled${st}" ${checked?"disabled":`data-un="${k}"`}><span class="n">${k+1}</span><span>${esc(l.items[ev].t)}</span>${checked?`<span class="yr">${esc(l.items[ev].j)}</span>`:""}</button>`; }).join("");
    const rest = pool.filter(i=>!ord.includes(i));
    const side = checked
      ? `<div class="panel tl-sol"><p class="tl-h">${T.correctOrder}</p><ol>${l.items.map(x=>`<li><b>${esc(x.j)}</b> ${esc(x.t)}</li>`).join("")}</ol></div>`
      : (rest.length ? `<div class="pool list">${rest.map(i=>`<button class="tile" data-pl="${i}">${esc(l.items[i].t)}</button>`).join("")}</div><p class="hint">${T.undo}</p>`
        : `<div class="panel tl-ready"><button class="btn big" id="chk">${T.orderCheck}</button><p class="hint">${T.orderInfo} ${T.undo}</p></div>`);
    A.innerHTML = `<div class="tl-grid"><div class="slots">${slots}</div><div class="tl-side">${side}</div></div>`;
  }
  A.onclick = e => {
    const p=e.target.closest("[data-pl]"); if(p){ ord.push(+p.dataset.pl); show(); return; }
    const u=e.target.closest("[data-un]"); if(u){ ord.splice(+u.dataset.un,1); show(); return; }
    if(e.target.closest("#chk")){
      checked=true; pts=ord.filter((ev,k)=>ev===k).length; show();
      l.items.forEach((x,k)=>{ if(ord[k]!==k) miss(x.t, x.j, x.e); });
      score(A.querySelector(".slots"), pts);
      sheet(pts===l.items.length?"ok":"mid", esc(T.levelOf(pts,l.items.length)+" ✓"), "", T.result, ()=>done(pts));
    }
  };
  show();
};

GAMES.satzbau = (l, A, done) => {
  const ss = l.mischen===false ? l.saetze.slice() : shuffle(l.saetze), P=l.punkte||2, res=[]; let i=0, pts=0, picked=[], tiles=[], checked=false;
  const norm = a => a.join(" ").replace(/\s+([?.!,])/g,"$1").toLowerCase();
  function setup(){
    const s=ss[i]; picked=[]; checked=false;
    do { tiles = shuffle(s.w.map((w,k)=>({w,k}))); } while(s.w.length>2 && tiles.every((t,k)=>t.k===k));
    show();
  }
  function show(){
    closeSheet();
    const s=ss[i], full = picked.length===tiles.length;
    A.innerHTML = progressBar(fill(res,ss.length), i) +
      `<div class="panel"><p class="q sm">${rich(s.aufgabe||T.tiles)}</p>${s.hint?`<p class="hint">${rich(s.hint)}</p>`:""}
      <div class="answer${checked?(res[i]?" ok":" no"):""}" id="ans">${picked.map((t,p)=>`<button class="tile" ${checked?"disabled":`data-rm="${p}"`}>${esc(tiles[t].w)}</button>`).join("")}</div>
      <div class="pool">${tiles.map((t,k)=>picked.includes(k)?"":`<button class="tile" data-ad="${k}" ${checked?"disabled":""}>${esc(t.w)}</button>`).join("")}</div>
      ${checked?"":`<div class="row" style="margin-top:.8rem"><button class="btn big" id="chk" ${full?"":"disabled"}>${T.check}</button></div>`}</div>`;
  }
  A.onclick = e => {
    if(checked) return;
    const a=e.target.closest("[data-ad]"); if(a){ picked.push(+a.dataset.ad); show(); return; }
    const r=e.target.closest("[data-rm]"); if(r){ picked.splice(+r.dataset.rm,1); show(); return; }
    if(e.target.closest("#chk")){
      const s=ss[i], got=norm(picked.map(k=>tiles[k].w)), okList=[s.w].concat(s.alt||[]).map(norm);
      const ok = okList.includes(got); res.push(ok); checked=true; if(ok) pts+=P; show();
      if(ok) score($("#ans"),P);
      const sol = norm(s.w).replace(/^./,c=>c.toUpperCase());
      if(!ok) miss(s.hint||s.aufgabe||"", sol, s.e);
      sheet(ok?"ok":"no", esc(ok?T.right+" +"+P:T.wrong), `${ok?"":`${T.solution} <strong>${esc(sol)}</strong> `}${s.e?rich(s.e):""}`, i<ss.length-1?T.next:T.result,
        ()=>{ i++; if(i<ss.length) setup(); else done(pts, T.correctN(res.filter(Boolean).length)+" / "+ss.length); });
    }
  };
  setup();
};

GAMES.schaetzen = (l, A, done) => {
  const fs = l.fragen, res=[]; let i=0, pts=0, v=0, locked=false;
  function show(){
    closeSheet();
    const q=fs[i]; v=q.start; locked=false;
    A.innerHTML = progressBar(fill(res,fs.length), i) +
      `<div class="panel"><p class="q">${rich(q.q)}</p>
      <div class="est-val" id="ev">${fmt(v,q.dec)} ${q.unit}</div>
      <input type="range" id="rg" min="${q.min}" max="${q.max}" step="${q.step}" value="${v}" aria-label="${esc(q.q)}">
      <div class="rl"><span>${fmt(q.min,q.dec)} ${q.unit}</span><span>${fmt(q.max,q.dec)} ${q.unit}</span></div>
      <div class="est-row"><button class="step" data-st="-1" aria-label="weniger">−</button><button class="step" data-st="1" aria-label="mehr">+</button><button class="btn big" id="lock">${T.estOk}</button></div></div>`;
    $("#rg").addEventListener("input", e=>{ v=+e.target.value; $("#ev").textContent=`${fmt(v,q.dec)} ${q.unit}`; });
  }
  A.onclick = e => {
    const q=fs[i];
    const s=e.target.closest("[data-st]"); if(s && !locked){ v=Math.min(q.max,Math.max(q.min,+(v+(+s.dataset.st)*q.step).toFixed(3))); $("#rg").value=v; $("#ev").textContent=`${fmt(v,q.dec)} ${q.unit}`; return; }
    if(e.target.closest("#lock") && !locked){
      locked=true; $("#rg").disabled=true; A.querySelectorAll("[data-st],#lock").forEach(b=>b.disabled=true);
      const d=Math.abs(v-q.ans), p = d<=q.tol+1e-9?2 : d<=2*q.tol+1e-9?1 : 0; pts+=p;
      if(p<2) miss(q.q, `${fmt(q.ans,q.dec)} ${q.unit}`, q.e); res.push(p===2?true:p===0?false:null);
      if(p) score($("#ev"),p);
      sheet(p===2?"ok":p===1?"mid":"no", esc(`${p===2?T.bull:p===1?T.close:T.off}${p?" +"+p:""} · ${T.yours} ${fmt(v,q.dec)} ${q.unit}`), rich(q.e), i<fs.length-1?T.next:T.result,
        ()=>{ i++; if(i<fs.length) show(); else done(pts); });
    }
  };
  show();
};

GAMES.lueckentext = (l, A, done) => {
  const parts = l.text.split(/(\[\[[^\]]+\]\])/g), gaps=[];
  parts.forEach(p=>{ const m=p.match(/^\[\[(.+)\]\]$/); if(m){ const o=m[1].split("|"); gaps.push({ans:o[0], opts:shuffle(o)}); } });
  const pick = gaps.map(()=>null); let act=0, checked=false, pts=0;
  function story(){
    let g=-1;
    const html = parts.map(p=>{ if(!/^\[\[/.test(p)) return rich(p).replace(/\n/g,"<br>"); g++;
      const v=pick[g], st = checked ? (v===gaps[g].ans?" ok":" no") : (g===act?" act":"");
      return `<button class="gap${v!==null?" filled":""}${st}" data-g="${g}" ${checked?"disabled":""} aria-label="Lücke ${g+1}">${checked&&v!==gaps[g].ans?`<span class="fix">${esc(gaps[g].ans)}</span>`:""}${v!==null?esc(v):"&nbsp;"+(g+1)+"&nbsp;"}</button>`; }).join("");
    A.innerHTML = `<div class="panel">${l.ueberschrift?`<h2 class="disp story-h">${esc(l.ueberschrift)}</h2>`:""}<div class="story">${html}</div></div>`;
  }
  function chooser(){
    const all = pick.every(x=>x!==null);
    const d = bar("choice", `<div class="sheet-t"><p class="ch-l">${act!==null?`${T.chooseFor} ${act+1}:`:T.tapGap}</p>
      <div class="row">${act!==null?gaps[act].opts.map(o=>`<button class="tile" data-o="${esc(o)}">${esc(o)}</button>`).join(""):""}</div></div>
      <button class="btn big" id="chk" ${all?"":"disabled"}>${T.check}</button>`);
    d.onclick = e => {
      const o=e.target.closest("[data-o]"); if(o && act!==null){ pick[act]=o.dataset.o;
        const nx = pick.findIndex((x,k)=>x===null && k>act), first = pick.findIndex(x=>x===null);
        act = nx>=0 ? nx : (first>=0 ? first : null); story(); chooser(); return; }
      if(e.target.closest("#chk")){ checked=true; pts=pick.filter((v,k)=>v===gaps[k].ans).length; story();
        { let g=-1, before=""; parts.forEach(p=>{ if(/^\[\[/.test(p)){ g++; if(pick[g]!==gaps[g].ans){ const w=before.replace(/\[\[([^|\]]+)[^\]]*\]\]/g,"$1").split(/\s+/).filter(Boolean).slice(-6).join(" "); miss(`${T.gap} ${g+1}: …${w} ___`, gaps[g].ans, ""); } }
          before += /^\[\[/.test(p) ? gaps[g].ans+" " : p; }); }
        score(A.querySelector(".story"), pts);
        sheet(pts===gaps.length?"ok":"mid", esc(T.levelOf(pts,gaps.length)+" ✓"), l.erklaerung?rich(l.erklaerung):"", T.result, ()=>done(pts)); }
    };
  }
  A.onclick = e => { if(checked) return; const gb=e.target.closest("[data-g]"); if(gb){ act=+gb.dataset.g; story(); chooser(); } };
  story(); chooser();
};

/* ---------- Ergebnis-Code (eigene Seite) ---------- */
function finale(A){
  function draw(){
    const parts = LV().map(x=>best(x.id)), tot = parts.reduce((a,b)=>a+b,0);
    const st = LV().reduce((a,x)=>a+starsFor(best(x.id),maxOf(x)),0);
    let out = "";
    if(S.done && S.name.trim()){
      const code = window.UH ? UH.make(W.id, S.name, tot, MAX, parts) : "";
      const img = window.UH ? UH.qrImage(UH.link ? UH.link(code) : code, 6) : "";
      out = `<div class="fin-grid">
        <div class="code-card">${img?`<img src="${img}" alt="QR-Code">`:`<p><b>${T.noQR}</b></p>`}
          <p class="who">${esc(S.name)}</p>
          <p class="sum"><span class="chip-ic">${W.sammel||"⭐"}</span> <b>${tot} / ${MAX}</b> · ${starHtml(Math.round(st/LV().length))}</p>
          <p class="small">${T.codeShow}</p></div>
        <div class="panel fin-table"><table>${LV().map((x,k)=>`<tr><td><span aria-hidden="true">${x.icon||""}</span> ${esc(x.titel)}</td><td>${starHtml(starsFor(parts[k],maxOf(x)))}</td><td>${parts[k]}/${maxOf(x)}</td></tr>`).join("")}
          <tr class="tot"><td>${T.total}</td><td></td><td>${tot}/${MAX}</td></tr></table>
          <p class="small">${T.codeLater}</p><code>${esc(code)}</code></div></div>`;
    }
    A.innerHTML = `<div class="panel fin-form"><label for="nm">${T.initials}</label>
      <div class="fin-row"><input type="text" id="nm" maxlength="20" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${T.initialsPh}" value="${esc(S.name)}">
      <button class="btn big" id="mk">${S.done?T.update:T.create}</button></div></div>${out}`;
  }
  A.onclick = e => {
    if(e.target.closest("#mk")){
      const inp=$("#nm"), v=inp.value.replace(/\|/g,"").trim();
      if(!v){ inp.classList.add("shake"); inp.focus(); setTimeout(()=>inp.classList.remove("shake"),400); return; }
      S.name=v; S.done=true; save(); draw(); confetti();
    }
  };
  A.onkeydown = e => { if(e.key==="Enter" && e.target.id==="nm"){ e.preventDefault(); $("#mk").click(); } };
  draw();
}

/* ---------- Start ---------- */
const LW = {
  start(world){
    W = world; T = Object.assign({}, TXT[W.sprache||"de"], W.punkteName?{pts:W.punkteName}:{}); KEY = "lw-"+W.id+"-v1"; APP = document.getElementById("app");
    MAX = W.levels.reduce((a,l)=>a+maxOf(l),0);
    load();
    try{ localStorage.setItem("lw-meta-"+W.id, JSON.stringify({max:MAX, titel:W.titel, ids:W.levels.map(l=>l.id)})); }catch(e){}
    document.addEventListener("click", e=>{
      // Übersetzung
      const tr = e.target.closest("[data-tr]");
      if(tr){ const p=tr.parentElement.querySelector(".tr-pop"), open=p.hidden; p.hidden=!open; tr.setAttribute("aria-expanded", open); return; }
      if(e.target.closest("[data-trx]")){ const p=e.target.closest(".tr-pop"); p.hidden=true; const f=p.parentElement.querySelector("[data-tr]"); f.setAttribute("aria-expanded","false"); f.focus(); return; }
      document.querySelectorAll(".tr-pop:not([hidden])").forEach(p=>{ if(!p.contains(e.target)){ p.hidden=true; p.parentElement.querySelector("[data-tr]").setAttribute("aria-expanded","false"); } });
      // Navigation
      const hr = e.target.closest("[data-href]");
      if(hr){ location.href = hr.dataset.href; return; }
      const g = e.target.closest("[data-go]");
      if(g){ const to=g.dataset.go; if(location.hash.slice(1)===to) render(); else location.hash=to; return; }
      if(e.target.closest("[data-again]")){ render(); window.scrollTo(0,0); return; }
      if(e.target.closest("#lwReset") && confirm(T.resetQ)){ S={lv:{},name:"",done:false,seen:{}}; save(); render(); }
    });
    document.addEventListener("keydown", e=>{ if(e.key==="Escape") document.querySelectorAll(".tr-pop:not([hidden])").forEach(p=>{ p.hidden=true; }); });
    window.addEventListener("hashchange", ()=>{ render(); window.scrollTo(0,0); });
    window.addEventListener("resize", ()=>{ fit(); const s=$("#sheet"), a=$("#area"); if(s&&a) a.style.paddingBottom=(s.offsetHeight+10)+"px"; });
    render();
  },
  maxima(world){ return world.levels.map(maxOf); },
  medal: medalSvg, tierOf, confetti: n => { if(!W) W = {}; confetti(n); }
};
window.LW = LW;
})();
