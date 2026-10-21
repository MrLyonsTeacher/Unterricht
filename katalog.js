// FRS Lernwelten – Katalog aller Lernwelten.
// Hier steht, welche Klasseninseln, Bereiche und Themen es gibt.
// Neues Thema: Eintrag bei der passenden Klasse unter "themen" ergänzen (Claude übernimmt das normalerweise).
//
// Thema:  id (kurz, ohne Bindestrich/Punkt), kat (Bereich), titel, untertitel, pfad (ab Hauptordner), icon, max (Höchstpunktzahl)
// Material (Sport/Sonstiges): id, titel, info, pfad, stationen, stationenMax

const FRS = {
  name: "FRS Lernwelten",

  // Bereiche auf den Englisch-Inseln
  kategorien: {
    grammar:    { name:"Grammar",          de:"Grammatik",             icon:"🏰", ort:"Grammar Castle" },
    vocabulary: { name:"Vocabulary",       de:"Wortschatz",            icon:"🌳", ort:"Word Woods" },
    reading:    { name:"Reading",          de:"Lesen",                 icon:"📖", ort:"Reading Lighthouse" },
    listening:  { name:"Listening",        de:"Hören",                 icon:"🎧", ort:"Echo Falls" },
    writing:    { name:"Writing",          de:"Schreiben",             icon:"✏️", ort:"Pencil Peak" },
    speaking:   { name:"Speaking",         de:"Sprechen",              icon:"🎤", ort:"Speakers’ Stage" },
    country:    { name:"Country & people", de:"Land & Leute",          icon:"⚓", ort:"Culture Harbour" },
    exam:       { name:"Exam Prep",        de:"Prüfungsvorbereitung",  icon:"🏆", ort:"Exam Summit" }
  },
  grundBereiche: ["grammar","vocabulary","reading","listening","writing","speaking","country"],

  englisch: {
    klassen: [
      { k:5,  id:"e5",  themen:[] },
      { k:6,  id:"e6",  themen:[
        { id:"sp6", kat:"grammar", titel:"Time Travel Agency", untertitel:"Simple past", pfad:"englisch/klasse6/simple-past.html", icon:"⏰", max:77 }
      ]},
      { k:7,  id:"e7",  themen:[
        { id:"bi7", kat:"country", titel:"Discover the British Isles", untertitel:"Countries, history & culture", pfad:"englisch/klasse7/british-isles.html", icon:"🧭", max:79 }
      ]},
      { k:8,  id:"e8",  themen:[] },
      { k:9,  id:"e9",  themen:[] },
      { k:10, id:"e10", themen:[] }
    ]
  },

  // Fächer ohne Inseln: einfache Liste
  listen: [
    { id:"sport", name:"Sport", icon:"🏀", materialien:[
      { id:"bb2", titel:"Basketball-Lernwelt: Regeln & Fairness", info:"Profil Sport Kl. 9 · 8 Spiele", pfad:"sport/basketball.html",
        stationen:["Memory","Shot Clock","Schiri","Fair Play","Maße","Zeitreise","NBA/FIBA","Sneaker"], stationenMax:[8,16,16,10,10,7,12,8] }
    ]},
    { id:"sonstiges", name:"Sonstiges", icon:"🧩", materialien:[] }
  ]
};

// Hilfsfunktionen
FRS.bereicheFuer = k => FRS.grundBereiche.concat(k >= 9 ? ["exam"] : []);
FRS.klasse = k => FRS.englisch.klassen.find(x => x.k === +k);
FRS.find = id => {
  for(const c of FRS.englisch.klassen){
    if(c.id === id){
      const bereiche = FRS.bereicheFuer(c.k);
      const themen = bereiche.flatMap(b => c.themen.filter(t => t.kat === b));
      return { typ:"insel", id, k:c.k, titel:`Englisch · Klasse ${c.k}`, themen, bereiche };
    }
  }
  for(const l of FRS.listen) for(const m of l.materialien) if(m.id === id) return Object.assign({ typ:"material", fach:l.name }, m);
  return null;
};
// Für ältere Seiten, die noch MATERIALIEN erwarten
const MATERIALIEN = FRS.listen.flatMap(l => l.materialien.map(m => Object.assign({ bereich:l.name }, m)));
