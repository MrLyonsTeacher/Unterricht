// Gemeinsame Funktionen für Ergebnis-Codes (von allen Materialien und der Einsammel-Seite genutzt).
// Format: UH1|materialId|name|punkte|max|teilpunkte|zeit|pruefziffer
// Der QR-Code enthält einen Link auf ergebnisse.html#c=<Code>. So öffnet die normale iPad-Kamera
// direkt die Einsammel-Seite, und das Ergebnis wird automatisch eingetragen.
(function(){
  const SALT = "uh-2026-sport-englisch";
  const SCRIPT_URL = (document.currentScript && document.currentScript.src) || location.href;
  function hash(s){
    let x = 2166136261;
    for(let i=0;i<s.length;i++){ x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
    x ^= x >>> 13; x = Math.imul(x, 2246822507); x ^= x >>> 16;
    return (x >>> 0).toString(36).toUpperCase().padStart(7,"0").slice(-5);
  }
  function stamp(){
    const d = new Date(), p = n => String(n).padStart(2,"0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  function make(id, name, pts, max, parts){
    const body = ["UH1", id, encodeURIComponent(String(name).replace(/[|!]/g,"").trim()), pts, max, (parts||[]).join("."), stamp()].join("|");
    return body + "|" + hash(SALT + body);
  }
  // Link zur Einsammel-Seite (liegt im Hauptordner neben dieser Datei)
  function link(code){
    // "|" wird im Link zu "!" – das hält den QR-Code klein und damit schnell scannbar
    return new URL("ergebnisse.html", SCRIPT_URL).href + "#c=" + code.replace(/\|/g, "!");
  }
  // Nimmt einen reinen Code oder einen Link mit #c=… entgegen
  function extract(input){
    let s = String(input || "").trim();
    const k = s.indexOf("c=");
    if(!s.startsWith("UH1|") && k >= 0){
      s = s.slice(k + 2);
      if(!/^UH1[|!]/.test(s)){ try{ s = decodeURIComponent(s); }catch(e){} }
      s = s.replace(/!/g, "|");
    }
    return s;
  }
  function parse(input){
    const s = extract(input);
    const f = s.split("|");
    if(f.length !== 8 || f[0] !== "UH1") return null;
    const body = f.slice(0,7).join("|");
    let name; try{ name = decodeURIComponent(f[2]); }catch(e){ name = f[2]; }
    return {
      id: f[1], name, pts: +f[3], max: +f[4],
      parts: f[5] ? f[5].split(".").filter(x=>x && !x.includes("-") && x[0]!=="~").map(Number) : [],
      // Klassenwelt: "thema-punkte" (alt) oder "thema-punkte-maxGespielt-spiele" (neu)
      topics: f[5] ? Object.fromEntries(f[5].split(".").filter(x=>x.includes("-")).map(x=>{ const a=x.split("-"); return [a[0], +a[1]]; })) : {},
      tinfo: f[5] ? Object.fromEntries(f[5].split(".").filter(x=>x.includes("-")).map(x=>{ const a=x.split("-"); return [a[0], {pts:+a[1], pmax:a[2]!==undefined?+a[2]:null, games:a[3]!==undefined?+a[3]:null}]; })) : {},
      today: f[5] && f[5].split(".").find(x=>x[0]==="~") ? +f[5].split(".").find(x=>x[0]==="~").slice(1) : null,
      time: f[6], valid: hash(SALT + body) === f[7], raw: s
    };
  }
  function qrImage(text, size){
    if(typeof qrcode === "undefined") return "";
    const q = qrcode(0, "L"); q.addData(text, "Byte"); q.make();
    return q.createDataURL(size || 8, 2);
  }

  /* ---------- Ränge der Klassenwelten (pro Stunde, nach heute gesammelten Flaggen) ---------- */
  const RANK_AT = [0, 20, 50, 90, 140, 200];
  const RANKS = {
    5:  [["✨","Spark"],["🔥","Flame"],["🌶️","Blaze"],["🌋","Inferno"],["👑","Fire Lord"],["🐉","Fire Legend"]],
    6:  [["💧","Drop"],["🌊","Wave"],["🐠","Current"],["🐬","Tide"],["⚓","Sea Captain"],["🐋","Ocean Legend"]],
    7:  [["🪨","Pebble"],["⛏️","Miner"],["💎","Gem Finder"],["⚒️","Stonesmith"],["👑","Dwarf Lord"],["🏔️","Mountain Legend"]],
    8:  [["🌬️","Breeze"],["☁️","Cloud Rider"],["🪁","Sky Runner"],["⭐","Star Pilot"],["🛡️","Sky Knight"],["🏰","Sky Legend"]],
    9:  [["🌰","Seed"],["🌱","Sprout"],["🏹","Ranger"],["🧝","Elf Scout"],["👑","Elf Lord"],["🌳","Forest Legend"]],
    10: [["❄️","Snowflake"],["🧊","Frost"],["🏔️","Glacier"],["🌨️","Blizzard"],["👑","Ice Lord"],["🐻‍❄️","Ice Legend"]]
  };
  function rank(k, n){
    const R = RANKS[k] || RANKS[5]; let i = 0; RANK_AT.forEach((t,j)=>{ if(n >= t) i = j; });
    const nx = i < RANK_AT.length-1 ? RANK_AT[i+1] : null;
    return { i, icon:R[i][0], name:R[i][1], at:RANK_AT[i], next:nx, nextName: nx!==null ? R[i+1][1] : null, nextIcon: nx!==null ? R[i+1][0] : null,
             toNext: nx!==null ? nx-n : 0, pct: nx!==null ? (n-RANK_AT[i])/(nx-RANK_AT[i]) : 1, top: nx===null, count: RANK_AT.length };
  }
  // "Heute gesammelt": Zähler pro Klasse und Tag
  const dayStr = () => { const d=new Date(), p=n=>String(n).padStart(2,"0"); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };
  function today(k){ try{ const r = JSON.parse(localStorage.getItem("frs-day-k"+k) || "null"); return r && r.d===dayStr() ? r.n : 0; }catch(e){ return 0; } }
  function addToday(k, n){ const v = today(k) + n; try{ localStorage.setItem("frs-day-k"+k, JSON.stringify({d:dayStr(), n:v})); }catch(e){} return v; }
  // Alles zurücksetzen (Leih-iPads): Fortschritt aller Themen einer Klasse, Kürzel und Tageszähler löschen
  function resetClass(k, topicIds, klasseId){
    try{
      topicIds.forEach(id=>localStorage.removeItem("lw-"+id+"-v1"));
      localStorage.removeItem("frs-day-k"+k);
      if(klasseId) localStorage.removeItem("insel-"+klasseId+"-name");
    }catch(e){}
  }
  window.UH = { make, link, parse, qrImage, rank, RANK_AT, RANKS, today, addToday, resetClass };
})();
