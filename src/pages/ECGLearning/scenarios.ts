import type { Choice, Scenario } from "../../ui/exercise/ScenariosPractice";

export const choices: Choice[] = [
  { id: "yes", label: "Esegui ECG autonomamente", color: "green" },
  { id: "no",  label: "Contatta SOREU",           color: "red"   },
];

export const scenarios: Scenario[] = [
  {
    vignette: "Paziente cosciente con dolore toracico. FR 18, FC 75, Sat 98%, PAS 120.",
    correctAnswer: "yes",
    explanation: "Tutti i parametri rientrano nei range e il paziente è cosciente: ECG autonomo.",
    hint: "Controlla se tutti i parametri sono nei range.",
    path: ["Dolore toracico", "Parametri normali", "ECG autonomo"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 22, FC 110, Sat 97%, PAS 130.",
    correctAnswer: "no",
    explanation: "FC > 100: parametro fuori range → contattare SOREU.",
    hint: "Attenzione alla frequenza cardiaca.",
    path: ["Dolore toracico", "FC fuori range", "Contatta SOREU"],
  },
  {
    vignette: "Paziente incosciente. FR 20, FC 80, Sat 96%, PAS 110.",
    correctAnswer: "no",
    explanation: "Alterazione dello stato di coscienza → contattare SOREU.",
    hint: "Lo stato di coscienza è determinante.",
    path: ["Incosciente", "Alterazione coscienza", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente senza dolore toracico iniziale, ma durante valutazione riferisce dolore toracico. FR 16, FC 85, Sat 97%, PAS 125.",
    correctAnswer: "yes",
    explanation: "Caso 2: si applica il caso 1. Parametri nei range → ECG autonomo.",
    hint: "Ricorda il Caso 2.",
    path: ["Caso 2", "Parametri normali", "ECG autonomo"],
  },
  {
    vignette: "Paziente cosciente con sincope riferita. FR 14, FC 65, Sat 96%, PAS 100.",
    correctAnswer: "yes",
    explanation: "Parametri nei range e paziente cosciente → ECG autonomo.",
    hint: "Sincope rientra nel caso 1.",
    path: ["Perdita coscienza riferita", "Parametri normali", "ECG autonomo"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 32, FC 90, Sat 97%, PAS 120.",
    correctAnswer: "no",
    explanation: "FR > 30: parametro fuori range → contattare SOREU.",
    hint: "Controlla la frequenza respiratoria.",
    path: ["Dolore toracico", "FR fuori range", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 20, FC 55, Sat 97%, PAS 110.",
    correctAnswer: "no",
    explanation: "FC < 60: parametro fuori range → contattare SOREU.",
    hint: "Controlla il limite inferiore FC.",
    path: ["Dolore toracico", "FC bassa", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 20, FC 80, Sat 92%, PAS 120.",
    correctAnswer: "no",
    explanation: "Sat < 95%: parametro fuori range → contattare SOREU.",
    hint: "Controlla la saturazione.",
    path: ["Dolore toracico", "Sat bassa", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 20, FC 80, Sat 97%, PAS 85.",
    correctAnswer: "no",
    explanation: "PAS < 90 mmHg: parametro fuori range → contattare SOREU.",
    hint: "Controlla la pressione sistolica.",
    path: ["Dolore toracico", "PAS bassa", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente con dolore toracico. FR 20, FC 80, Sat 97%, PAS 160.",
    correctAnswer: "no",
    explanation: "PAS > 150 mmHg: parametro fuori range → contattare SOREU.",
    hint: "Attenzione al limite superiore PAS.",
    path: ["Dolore toracico", "PAS alta", "Contatta SOREU"],
  },
  {
    vignette: "Paziente soporoso (risponde a stimoli verbali). FR 18, FC 85, Sat 97%, PAS 120.",
    correctAnswer: "no",
    explanation: "Alterazione della coscienza (V nella AVPU) → contattare SOREU.",
    hint: "Scala AVPU.",
    path: ["AVPU alterata", "Coscienza non normale", "Contatta SOREU"],
  },
  {
    vignette: "Paziente cosciente con FC 45 bpm ma senza dolore toracico.",
    correctAnswer: "no",
    explanation: "FC < 50 rientra nei criteri di attivazione → contattare SOREU.",
    hint: "Controlla i criteri di attivazione.",
    path: ["FC < 50", "Caso 1", "Contatta SOREU"],
  },
];