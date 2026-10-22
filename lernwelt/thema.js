/* FRS Lernwelten – Startet ein Thema im Stil der Klassenwelt.
   Seite lädt: lernwelt.css, themes.css, qrcode.js, ergebnis.js, katalog.js, lernwelt.js, thema.js
   TH.start({ k:6, kat:"grammar", id:"pp6", titel:"…", untertitel:"Present perfect", text:"…", icon:"💎", levels:[…] }) */
(function(){
  const WELT = { 5:"feuer", 6:"wasser", 7:"stein", 8:"himmel", 9:"wald", 10:"eis" };
  const KONF = {
    feuer:["#012169","#C8102E","#FFFFFF","#FFC24A","#E8430A"], wasser:["#012169","#C8102E","#FFFFFF","#FFD23F","#7FE3FF","#FF7A59"],
    stein:["#012169","#C8102E","#FFFFFF","#FFC24A","#B88AFF","#4AF0A0"], himmel:["#012169","#C8102E","#FFFFFF","#FFC24A","#7EC0FF"],
    wald:["#012169","#C8102E","#FFFFFF","#E8C24A","#4FAE3A"], eis:["#012169","#C8102E","#FFFFFF","#8AE6FF","#C8A0FF"] };
  const KATNAME = { grammar:"Grammar", vocabulary:"Vocabulary", country:"Country & people", reading:"Reading", listening:"Listening", writing:"Writing", speaking:"Speaking", exam:"Exam" };
  const FLAGDEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g id="ukflag" clip-path="url(#uk-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></defs></svg>`;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  window.TH = {
    start(c){
      const th = WELT[c.k] || "wasser";
      document.body.classList.add("th-"+th);
      document.body.insertAdjacentHTML("afterbegin", FLAGDEFS);
      const img = c.bild || `../welten/k${c.k}-${c.kat}.jpg`;
      const hero = `<div class="whero"><div class="bgimg" style="background-image:url('${img}')"></div>
        <span class="tag">English · Class ${c.k} · ${esc(KATNAME[c.kat]||c.kat)}</span>
        <h1>${esc(c.titel)}</h1><p>${esc(c.text||"")}</p><span class="big" aria-hidden="true">${c.icon||"🎯"}</span></div>`;
      LW.start({
        id: c.id, titel: `${c.titel} – ${c.untertitel||""}`,
        insel: { k:c.k, href:`../welt.html?k=${c.k}&a=${c.kat}`, icon:"🗺️" },
        sprache: "en", hero, sammel:`<svg class="ico-flag" viewBox="0 0 60 30" aria-hidden="true"><use href="#ukflag"/></svg>`,
        punkteName: "flags", kartenSymbol: c.kartenSymbol || c.icon || "⭐", konfetti: KONF[th],
        lob: c.lob || {3:"Amazing! You are a real expert.", 2:"Great job! Can you get three stars next time?", 1:"Good start – try again and you will get better.", 0:"Don’t give up! Read the tips and try again."},
        audio: `../audio/${c.id}/`, akzent: c.k==8 ? "en-US" : "en-GB",
        lernen: c.lernen, levels: c.levels
      });
    }
  };
})();
