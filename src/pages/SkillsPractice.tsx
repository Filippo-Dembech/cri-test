import { useState } from "react";
import type { StepsData } from "../exercises";
import Button from "../ui/Button";
import Steps from "../ui/exercise/Steps";

const skills: StepsData[] = [
    {
        procedureName: "Collare Cervicale",

        steps: [
            "Immobilizzare capo in posizione neutra",
            "Presentarsi al paziente e spiegare manovra",
            "Liberare il collo da impedimenti e ispezionare il collo",
            "Misurare con le dita affiancate la distanza tra il mento ed il margine superiore del muscolo trapezio (base del collo)",
            "Identificare il collare della misura adeguata rapportando la misura con la parte laterale del collare",
            "Afferrare con la mano la parte anteriore del collare piegandola leggermente su se stessa",
            "Posizionare la parte anteriore facendola scivolare sino ad appoggiarsi alla parte inferiore della mandibola",
            "Fissare la parte antariore con il velcro senza ruotare il collo",
            "Posizionare la parte posteriore",
            "Stringere il velcro applicando trazione di eguale forza da entrambi i lati in contemporanea",
            "Posizionare uno spessore adeguato sotto al nuca (se necessario)",
            "Far continuare il mantenimento dell'immobilizzazione manuale al secondo soccorritore",
        ],
    },
    {
        procedureName: "Rimozione Casco Integrale",
        steps: [
            "Immobilizzare il capo",
            "Chiamare il paziente, aprire la visiera, presentarsi e spiegare la manovra",
            "Rimuovere oggetti mobili non conficcati (occhiali, auricolari, etc.)",
            "Far raggiungere e mantenere posizione neutra del capo, mentre si allineano gli arti del paziente (se necessario)",
            "Slacciare o tagliare il cinturino, controllare il collo",
            "Inserire una mano sotto il casco e afferrare la nuca (gomito e avambraccio appoggiato a terra)",
            "Posizionare delicatamente l'avambraccio sul torace e afferrare la mandibola con pollice e indice",
            "Il 2° soccorritore afferra i lati del casco con il cinturino, li allarga, bascula il casco all'indietro ed inizia a sfilarlo",
            "Quando è visibile il naso, avvisa il 1° soccorritore di tenersi pronto e sfila il casco",
            "Il 1° soccorritore mantiene stabile il capo (attenzione alla mano sulla nuca che si sposta sorreggendo il capo) doppo l'estrazione completa del casco",
            "Il 2° soccorritore afferra il capo e lo immobilizza in posizione neutra",
            "Dare indicazione di posizionare il collare cervicale (previa ulteriore valutazione del collo)",
        ],
    },
    {
        procedureName: "Pronosupinazione",
        steps: [
            "Far immobilizzare manualmente il capo, in posizione già pronta per la rotazione al 1° soccorritore, si presenta al paziente, gli spiega la manovra (2° soccorritore)",
            "Allineare gli arti superiori lungo l'asse del corpo e gli arti inferiori avvicinandoli tra loro senza effettuare rotazioni o trazioni anomale",
            "Inginocchiarsi a lato del paziente posizionando le mani all'altezza della spalla e del bacino contenendo il polso del paziente",
            "Il 3° soccorritore si posiziona a lato del paziente, cno la mano a livello del torace incrociando il braccio con quello del 2° soccorritore e l'altra mano a livello del femore poco sopra l'articolazione del ginocchio",
            "Il 1° soccorritore (alla testa) dà il via alla manovra di rotazione del paziente di 90ç gradi (sul fianco); la testa va portata in posizione neutra",
            "Il 2° soccorritore cambia orientamento delle mani; sposta la mano dalla spalla al centro del dorso posteriormente e la mano dal bacino lungo il tronco anteriormente",
            "Il 3° soccorritore cambia orientamento delle mani; sposta la mano dal torace al centro del ratto lombo-sacrale posteriormente e la mano sul fermore lungo il acino anteriormente",
            "Al via del 1° soccorritore si porta il paziente in posizione supina mantenendo la colonna vertebrale allineata",
        ],
    },
    {
        procedureName: "Immobilizzazione Frattura",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Estricazione Rapida (Rautek)",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Immobilizzazione Spinale (KED)",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Ragno e Fermacapo",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Barella Cucchiaio",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Materasso a Depressione",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Log-Roll su Tavola Spinale",
        steps: ["step1", "step2", "step3"],
    },
    {
        procedureName: "Abbattimento su Spinale",
        steps: ["step1", "step2", "step3"],
    },
];

export default function SkillsPractice() {
    const [selectedSkill, setSelectedSkill] = useState<StepsData | undefined>(
        undefined
    );
    return (
        <div>
            <h1 className="text-4xl font-bold mb-5">Practica Skills</h1>
            <div className="flex gap-10">
                <div className="flex flex-col gap-3 w-70 flex-1">
                    {skills.map((skills) => (
                        <Button onClick={() => setSelectedSkill(skills)}>
                            {skills.procedureName}
                        </Button>
                    ))}
                </div>
                <div className="flex-3 bg-red-50 rounded-lg p-3">
                    {selectedSkill && (
                        <Steps
                            key={selectedSkill.procedureName}
                            procedureName={selectedSkill.procedureName}
                            steps={selectedSkill.steps}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
