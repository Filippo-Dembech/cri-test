// scenarioGenerator.ts

type Scenario = {
  vignette: string;
  correctAnswer: "yes" | "no";
  explanation: string;
  hint: string;
  path: string[];
};

type Vitals = {
  conscious: boolean;
  chestPain: boolean;
  syncope: boolean;
  fr: number;
  fc: number;
  sat: number;
  pas: number;
};

// ---------- Helpers ----------

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomVitals(): Vitals {
  return {
    conscious: Math.random() > 0.2,
    chestPain: Math.random() > 0.5,
    syncope: Math.random() > 0.7,
    fr: rand(8, 35),
    fc: rand(40, 130),
    sat: rand(88, 100),
    pas: rand(80, 180),
  };
}

// ---------- Core logic ----------

function shouldDoECGAutonomously(v: Vitals): boolean {
  const inRange =
    v.fr > 10 && v.fr < 30 &&
    v.fc > 60 && v.fc < 100 &&
    v.sat > 95 &&
    v.pas > 90 && v.pas < 150;

  const trigger =
    v.chestPain ||
    v.syncope ||
    v.fc < 50 ||
    v.fc > 100;

  if (!trigger) return false;
  if (!v.conscious) return false;

  return inRange;
}

// ---------- Builders ----------

function buildVignette(v: Vitals): string {
  const stato = v.conscious ? "cosciente" : "incosciente";

  const sintomi: string[] = [];
  if (v.chestPain) sintomi.push("dolore toracico");
  if (v.syncope) sintomi.push("perdita di coscienza riferita");

  const sintomiText =
    sintomi.length > 0
      ? `con ${sintomi.join(" e ")}`
      : "senza sintomi riferiti";

  return `Paziente ${stato} ${sintomiText}. FR ${v.fr}, FC ${v.fc}, Sat ${v.sat}%, PAS ${v.pas}.`;
}

function buildPath(v: Vitals): string[] {
  const path: string[] = [];

  const trigger =
    v.chestPain ||
    v.syncope ||
    v.fc < 50 ||
    v.fc > 100;

  if (!trigger) {
    path.push("Nessun criterio di attivazione");
    path.push("Non ECG autonomo");
    return path;
  }

  path.push("Caso 1 attivato");

  if (!v.conscious) {
    path.push("Alterazione coscienza");
    path.push("Contatta SOREU");
    return path;
  }

  let out = false;

  if (!(v.fr > 10 && v.fr < 30)) {
    path.push("FR fuori range");
    out = true;
  }

  if (!(v.fc > 60 && v.fc < 100)) {
    path.push("FC fuori range");
    out = true;
  }

  if (!(v.sat > 95)) {
    path.push("Sat fuori range");
    out = true;
  }

  if (!(v.pas > 90 && v.pas < 150)) {
    path.push("PAS fuori range");
    out = true;
  }

  if (out) {
    path.push("Contatta SOREU");
  } else {
    path.push("Parametri normali");
    path.push("ECG autonomo");
  }

  return path;
}

// ---------- Public API ----------

export function generateScenario(): Scenario {
  const v = randomVitals();

  const correct = shouldDoECGAutonomously(v);

  return {
    vignette: buildVignette(v),
    correctAnswer: correct ? "yes" : "no",
    explanation: correct
      ? "Parametri nei range e paziente cosciente: ECG autonomo."
      : "Parametri fuori range o coscienza alterata: contattare SOREU.",
    hint: "Controlla stato di coscienza e range dei parametri.",
    path: buildPath(v),
  };
}