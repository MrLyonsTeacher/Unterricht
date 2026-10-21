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
      parts: f[5] ? f[5].split(".").map(Number) : [],
      time: f[6], valid: hash(SALT + body) === f[7], raw: s
    };
  }
  function qrImage(text, size){
    if(typeof qrcode === "undefined") return "";
    const q = qrcode(0, "L"); q.addData(text, "Byte"); q.make();
    return q.createDataURL(size || 8, 2);
  }
  window.UH = { make, link, parse, qrImage };
})();
