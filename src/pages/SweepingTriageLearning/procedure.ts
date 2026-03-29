import type { Procedure } from "../../ui/ProcedureWalker";

export const startTriage: Procedure = {
  title: "S.T.A.R.T. Triage",
  subtitle: "Protocollo",
  startId: "cammina",
  steps: {
    cammina: {
      question: "Il paziente cammina?",
      yes: "VERDE",
      no: "respira",
    },
    respira: {
      question: "Il paziente respira?",
      yes: "freq",
      no: "cannula",
    },
    cannula: {
      question: "Il paziente respira dopo pervietà-cannula?",
      action: "Applicare pervietà-cannula",
      yes: "ROSSO",
      no: "NERO",
    },
    freq: {
      question: "Frequenza respiratoria < 30 atti/min?",
      yes: "polso",
      no: "ROSSO",
    },
    polso: {
      question: "Polso radiale presente?",
      yes: "ordini",
      no: "ROSSO",
    },
    ordini: {
      question: "Esegue ordini semplici?",
      action: "Controllare evidenti emorragie — bendaggio e far tamponare",
      yes: "GIALLO",
      no: "ROSSO",
    },
  },
  outcomes: {
    VERDE:  { label: "Codice Verde",  color: "green",  emoji: "🟢" },
    GIALLO: { label: "Codice Giallo", color: "amber",  emoji: "🟡" },
    ROSSO:  { label: "Codice Rosso",  color: "red",    emoji: "🔴" },
    NERO:   { label: "Codice Nero",   color: "gray",   emoji: "⚫" },
  },
};