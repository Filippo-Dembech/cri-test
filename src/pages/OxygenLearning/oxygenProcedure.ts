import type { Procedure } from "../../ui/ProcedureWalker";


export const oxygenProcedure: Procedure = {
  title: "Somministrazione Ossigeno",
  subtitle: "Protocollo",
  startId: "segni_particolari",
  steps: {
    segni_particolari: {
      question: "Presenta segni particolari?",
      action: "Controllare segni di shock, intossicazione CO, annegamento, disbarismo, ipotermia",
      yes: "RESERVOIR",
      no: "saturazione_bassa",
    },
    saturazione_bassa: {
      question: "Saturazione < 85% ?",
      yes: "RESERVOIR",
      no: "dispnea",
    },
    dispnea: {
      question: "Dispnea e SpO2 < 94% ?",
      yes: "bpco",
      no: "PROSEGUO",
    },
    bpco: {
      question: "BPCO?",
      yes: "bpco_dispnea",
      no: "MASCHERA_SEMPLICE",
    },
    bpco_dispnea: {
      question: "Dispnea e SpO2 < 88% ?",
      yes: "CANNULA",
      no: "PROSEGUO",
    },
  },
  outcomes: {
    RESERVOIR:  { label: "Maschera con Reservoir ad alti flussi",  color: "red",  emoji: "😮‍💨" },
    MASCHERA_SEMPLICE: { label: "Maschera semplice", description: "E Maschera con Reservoir Fino al raggiungimento di SpO2 target 94-98%", color: "amber",  emoji: "😷" },
    CANNULA:  { label: "Cannula nasale", description: "Usare la cannula solo se disponibile, altrimenti Maschera Semplice e Maschera con Reservoir fino al raggiungimento target 88-92%",  color: "amber",    emoji: "👃" },
    PROSEGUO:   { label: "Proseguo assistenza",   color: "green",   emoji: "✅" },
  },
};
