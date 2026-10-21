// Hier trägst du deine Materialien ein.
// Neues Material: Datei in den passenden Ordner hochladen (sport, englisch, sonstiges)
// und unten einen Eintrag nach demselben Muster ergänzen. Komma am Ende nicht vergessen.
//
// bereich:      "Englisch", "Sport" oder "Sonstiges"
// titel:        was auf der Karte steht
// info:         kurze Beschreibung (Klasse, wofür)
// pfad:         Ordner/Dateiname, genau wie hochgeladen
// id:           kurzes Kürzel – nur nötig, wenn das Material einen Ergebnis-Code erzeugt
// stationen:    Namen der Teilbereiche für die Ergebnis-Tabelle (optional)
// stationenMax: höchste Punktzahl je Teilbereich, für die farbige Klassenübersicht (optional)

const MATERIALIEN = [
  {
    bereich: "Sport",
    titel: "Basketball-Lernwelt: Regeln & Fairness",
    info: "Profil Sport Kl. 9 · 8 Spiele · Ergebnis-Code",
    pfad: "sport/basketball.html",
    id: "bb2",
    stationen: ["Memory", "Shot Clock", "Schiri", "Fair Play", "Maße", "Zeitreise", "NBA/FIBA", "Sneaker"],
    stationenMax: [8, 16, 16, 10, 10, 7, 12, 8]
  },
  {
    bereich: "Englisch",
    titel: "Time Travel Agency: Simple Past",
    info: "Klasse 6 · 7 Spiele · Ergebnis-Code",
    pfad: "englisch/simple-past.html",
    id: "sp6",
    stationen: ["Signal words", "-ed", "Irregular", "Verb Rush", "Story", "did/didn't", "Mistakes"],
    stationenMax: [12, 16, 8, 12, 11, 12, 6]
  },

];
