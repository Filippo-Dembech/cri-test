import type { Step } from "./types";

export const steps: Step[] = [
    { id: 1, text: "Spiegare la procedura al paziente" },
    {
        id: 2,
        text: "Informare il paziente/parente che il valore sarà trasmesso alla SOREU",
    },
    { id: 3, text: "Predisporre il materiale occorrente" },
    { id: 4, text: "Preparare l'apparecchio" },
    {
        id: 5,
        text: "Inserire la striscia reagente nell'apparecchio nel verso giusto",
        detail: "L'apparecchio si accenderà automaticamente.",
    },
    {
        id: 6,
        text: "Verificare che appaia il simbolo di una goccia di sangue sul display",
        detail: "Questo conferma che l'apparecchio è pronto.",
    },
    { id: 7, text: "Disinfettare il dito su cui misurare la glicemia" },
    { id: 8, text: "Premere leggermente il dito del paziente" },
    {
        id: 9,
        text: "Prendere la lancetta pungidito e rimuovere il tappo di sicurezza",
    },
    {
        id: 10,
        text: "Applicare una pressione decisa sul polpastrello del paziente",
        detail: "Meglio se leggermente sul lato del polpastrello.",
    },
    {
        id: 11,
        text: "Premere il polpastrello per far uscire la prima goccia di sangue e pulirla",
    },
    {
        id: 12,
        text: "Premere nuovamente il polpastrello per far uscire la seconda goccia di sangue",
    },
    { id: 13, text: "Appoggiare la striscia reagente sulla goccia di sangue" },
    {
        id: 14,
        text: "Aspettare circa 5 secondi e registrare il valore della glicemia",
    },
    {
        id: 15,
        text: "Pulire il paziente e fargli tenere la garza disinfettante premuta sulla ferita",
    },
    {
        id: 16,
        text: "Smaltire la lancetta e la striscia reagente nel contenitore dei taglienti",
    },
    { id: 17, text: "Comunicare il valore rilevato" },
]