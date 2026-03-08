import { useState } from "react";
import type { StepsData } from "../exercises";
import Steps from "../ui/exercise/Steps";

const skills: StepsData[] = [
    {
        procedureName: "Collare Cervicale",

        steps: [
            "Immobilizzare capo in posizione neutra",
            "Chiamare il paziente, presentarsi al paziente e spiegare manovra",
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
            "Aprire la visiera",
            "Chiamare il paziente, presentarsi e spiegare la manovra",
            "Rimuovere oggetti mobili non conficcati (occhiali, auricolari, etc.)",
            "Far raggiungere e mantenere posizione neutra del capo",
            "Allineare gli arti del paziente (se necessario)",
            "Slacciare o tagliare il cinturino",
            "Dare i lacci al soccorritore alla testa",
            "controllare il collo",
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
            "Far immobilizzare manualmente il capo in posizione già pronta per la rotazione",
            "Chiamare il paziente, presentarsi, e spiegare la manovra",
            "Controllare la schiena",
            "Allineare gli arti",
            "Inginocchiarsi a lato del paziente",
            "Posizionare le mani all'altezza della spalla e del bacino (contenendo il polso)",
            "Il 2° soccorritore si posiziona a lato del paziente, con la mano a livello del torace incrociando il braccio con quello del 2° soccorritore e l'altra mano a livello del femore poco sopra l'articolazione del ginocchio",
            "Al via del soccorritore alla testa, si ruota il paziente sul fianco; la testa va portata in posizione neutra",
            "Il cambiare orientamento delle mani (sposta la mano dalla spalla al centro del dorso posteriormente e la mano dal bacino lungo il tronco anteriormente)",
            "Il 2° soccorritore cambia orientamento delle mani (sposta la mano dal torace al centro del ratto lombo-sacrale posteriormente e la mano sul fermore lungo il acino anteriormente)",
            "Al via del soccorritore alla testa si porta il paziente in posizione supina mantenendo la colonna vertebrale allineata",
        ],
    },
    {
        procedureName: "Pronosupinazione su Tavola Spinale Sottile",
        steps: [
            "Far immobilizzare manualmente il capo",
            "Chiamare il paziente, presentarsi, e spiegare la manovra",
            "Controllare la schiena",
            "Allineare gli arti",
            "Far posizionare la tavola spinale a lato del paziente (lato opposto dello sguardo)",
            "Inginocchiarsi a lato del paziente, con un ginocchio sopra la tavola spinale",
            "Posizionare le mani all'altezza della spalla e del bacino (contenendo il polso)",
            "Far posizionare il 2° soccorritore a lato del paziente, con un ginocchio sopra la tavola spinale con le mani a livello del torace e del femore",
            "Al via del soccorritore alla testa, si ruota il paziente sul fianco; la testa va portata in posizione neutra",
            "Spostare le mani posteriormente alla schiena",
            "Al via del soccorritore alla testa, ruotare il paziente adagiandolo sulla tavola spinale",
            "Il soccorritore alla testa comunica la necessità di centrare il paziente sulla spinale",
            "Se necessario i soccorritori si posizionano a lato (o a cavalcioni) del paziente, lo afferrano all'altezza delle spalle e del bacino",
            "Al via del soccorritore alla testa, si centra il paziente sulla tavola spinale",
        ],
    },
    {
        procedureName: "Immobilizzazione Frattura",
        steps: [
            "Presentarsi al paziente e spiegare la manovra",
            "Individuare il punto dolente sull'arto",
            "Tagliare gli indumenti ed esporre l'arto",
            "*Se indicato rimuovere la scarpa, tagliare o allentare le stringhe evitando movimenti bruschi",
            "Valutare il colorito cutaneo",
            "Valutare la sensibilità",
            "Se possibile valutare il polso periferico",
            "Afferrare l'arto con due mani (fulcro sulle articolazioni prossimali e distali, effettuando una lieve trazione)",
            "*Se possibile e se non è frattura esposta, riallineare l'arto",
            "Il 2° soccorritore prepara la stecca di misura adeguata distendendo il contenuto della stessa",
            "Sollevare l'arto di pochi centimetri mantenendolo la lieve trazione",
            "Fare infilare la stecca sotto l'arto",
            "Adagiare l'arto sulla stecca",
            "Continuare a mantenere l'arto immobilizzato con le mani",
            "Far mettere in depressione la stecca",
            "Fissare i lacci con il velcro/gancio",
            "Assicurarsi del corretto posizionamento dell'arto all'interno del presidio",
            "Rivalutare la presenza di dolore",
            "Rivalutare il colorito cutane",
            "Rivalutare la sensibilità",
            "Controllare la tenuta del presidio",
            "Far predisporre il materiale necessario al caricamento ed al trasporto del paziente",
        ],
    },
    {
        procedureName: "Estricazione Rapida (Rautek)",
        steps: [
            "Valutare la scena e il numero di soccorritore per effettuare la manovra",
            "Cercare la collaborazione del paziente, spiegandogli la manovra",
            "Far predisporre la secondo soccorritore la tavola spinale",
            "Far risalire il braccio sotto l'ascella distale del paziente ed afferrare l'avambraccio opposto",
            "Infilare l'altra mano sotto l'ascella più vicina della vittima e bloccare la testa a livello della mandibola facendola appoggiare sulla propria spalla",
            "Tirare la vittima verso di sé appoggiandola sul proprio torace e allontanarsi dall'auto",
            "Il secondo soccorritore controlla l'estricazione degli arti inferiori e collabora all'effettuazione della manovra dopo",
            "Insieme al secondo soccorritore eseguire la manovra di posizionamento su tavola spinale e fare immobilizzare il rachide cervicale",
        ],
    },
    {
        procedureName: "Immobilizzazione Spinale (KED)",
        steps: [
            "Far immobilizzare il capo in posizione neutra",
            "Chiamare il paziente, presentarsi, spiegare la manovra",
            "Posizionare il collare cervicale previo controllo del collo",
            "Far distanziare il paziente dallo schienale con l'aiuto di un altro soccorritore (mano sul petto e altra dietro la schiena)",
            "Posizionare l'immobilizzatore, infilandolo dal basso verso l'alto dietro la schiena del paziente con le cinghie sulla parete esterna",
            "Centrare l'immobilizzatore dietro il paziente",
            "Sfilare i gambali",
            "Chiudere le tre cinghie nell'ordine: centrale, inferiore e superiore",
            "Tirare l'immobilizzatore verso l'alto in modo da farlo calzare bene sotto le ascelle",
            "Tirare bene le tre cinghie (attenzione ai problemi respiratori e addominali)",
            "Collocare, con un movimento lento a zig zag, le cinghie per le gambe portandole sotto le cosce e le natiche e fissarle ciascuna dal suo lato",
            "*Se necessario posizionare il cuscino in modo da riempire il vuoto tra la nuca e l'immobilizzatore",
            "Posizionare i supporti per il capo fissandoli con i lacci in velcro, il fermafronte e il sottogola vanno incrociati ai lati",
            "Controllare la tenuta di tutte le cinghie posizionate",
            "Estrarre il paziente con il terzo soccorritore ruotandolo sulla spinale con l'ausilio delle maniglie, il primo soccorritore sostiene gli arti inferiori",
        ],
    },
    {
        procedureName: "Ragno e Fermacapo",
        steps: [
            "Verificare la corretta posizione del paziente sulla tavola spinale",
            "Verificare l'immobilizzazione della testa",
            "Appoggiare il ragno sul corpo del paziente regolando la lunghezza della cinghia verticale",
            "Posizionare le cinghie a V all'altezza delle spalle, nella maniglia più bassa fasciando la parte superiore delle spalle",
            "Posizionare le cinghie sopra la caviglia",
            "Posizionare le cinghie al livello toracico sotto la linea mammaria (contenendo le braccia)",
            "Posizionare le cinghie a livello del bacino (contenendo i polsi del paziente)",
            "Posizionare le cinghie sopra l'articolazione del ginocchio (sotto il ginocchio se la tavola deve essere messa in verticale)",
            "Tirare le cinghie applicando trazione di uguale forza da entrambi i lati, mettendosi a cavalcioni della tavola spinale, facendo attenzione ad eventuali problemi respiratori o addominali",
            "Posizionare i 2 cuscinetti fermacapo",
            "Posizioanre i cinghioli sulla fronte e sul collare fissandoli ai lati in modo incrociato",
            "Far sospendere l'immobilizzazione manuale del capo",
            "Sollevare la spinale ai lati utilizzando le maniglie laterali",
        ],
    },
    {
        procedureName: "Barella Cucchiaio",
        steps: [
            "Far immobilizzare il capo del paziente in posizione neutra",
            "Chiamare il paziente, presentarsi e spiegare la manovra",
            "Applicare il collare cervicale",
            "Posizionare la barella al lato del paziente e regolare la lunghezza",
            "Bloccare correttamente la barella alla lunghezza adatta",
            "Aprire le cerniere separando le due emivalve",
            "Posizionare le due emivalve ai lati del paziente (facendo attenzione a non passare sopra al corpo del paziente)",
            "Fare posizionare il 2° soccorritore a lato del paziente, il quale afferra con una mano la spalla e con l'altra il bacino e l'estremità dell'arto inferiore, solleva quanto basta per far inserire l'emivalva della cucchiaio",
            "Infilare ciascuna emivalva sotto al paziente",
            "Il 1° e il 2° soccorritore agganciano prima la cerniera superiore e poi quella inferiore",
            "Verificare la tenuta delle cerniere",
            "Trasportare sulla tavola spinale o materasso a depressione",
        ],
    },
    {
        procedureName: "Materasso a Depressione",
        steps: [
            "Controllare che a terra non ci siano oggetti taglienti",
            "Stendere il materassino",
            "Distribuire uniformemente le palline di polistirolo al suo interno eliminando le pieghe della tela",
            "Sollevare il paziente con la barella cucchiaio (coordinarsi)",
            "Deporre il paziente sul materassino con la testa allineata al bordo superiore",
            "Togliere le valve della barella cucchiaio mantenendo la stabilità del rachide",
            "Modellare il materassino ai lati della testa, del tronco e degli arti",
            "*Se necessario, inserire eventuale spessore tra i due arti inferiori",
            "Fare attivare la depressione del materassino e fissare le cinghie laterali",
            "Mentre si irrigidisce, modellare ulteriormente il materassino intorno al paziente facendo attenzione a non coprire il volto",
            "Verificare la raggiunta rigidità del materassino e la tenuta della valvola di aspirazione",
            "Sollevare il paziente stando ai lati (ideale quattro soccorritori)",
            "Trasportarlo sulla barella cucchiaio (coordinarsi)",
            "Posizionare il paziente nel materasso a depressione sopra la barella cucchiaio per il trasporto fino alla barella",
            "Fissare il paziente e il materassino alla barella portantina",
        ],
    },
    {
        procedureName: "Log-Roll su Tavola Spinale",
        steps: [
            "Far immobilizzare manualmente il capo in posizione neutra",
            "Chiamare il paziente, presentarsi al paziente e spiegargli la manovra",
            "Allineare gli arti del paziente",
            "Posizionare il collare cervicale",
            "Far posizionare la tavola spinale a lato del paziente (lato opposto alla posizione dei soccorritori)",
            "Inginocchiarsi a lato del paziente",
            "Posizionare le mani all'altezza della spalla e del bacino (contenendo il braccio del paziente in modo che non rimanga mobile)",
            "Fare posizionare il 3° soccorritore a lato del paziente, con le mani a livello del torace (tra braccio e torace) e sul femore (in prossimità del ginocchio)",
            "Al via del soccorritore alla testa, si ruota tutto il paziente di 90°, mantenendo la testa in posizione neutra",
            "Staccare la mano dal bacino, ispezionare la schiena e avvicinare la spinale; cambiare la mano da una spalla all'altra e chiedere al 3° soccorritore di cambiare la posizione delle mani afferrando la spinale",
            "Al via del soccorritore alla testa; ruotare il paziente e la tavola spinale, il soccorritore alla testa valuta la necessità di centrare il paziente sulla spinale",
            "Se necessario i soccorritori si posizionano di lato (o a cavalcioni) del paziente, lo afferrano all'altezza delle spalle e del bacino",
            "Al via del soccorritore alla testa, centrare il paziente sulla tavola spinale, con piccoli movimenti sincronizzati verso il lato e verso l'alto",
        ],
    },
    {
        procedureName: "Abbattimento su Spinale",
        steps: [
            "Chiama il paziente, si presenta e gli spiega la manovra",
            "Il primo soccorritore si pone dietro al paziente e immobilizza il rachide cervicale",
            "Posiziona il collare cervicale",
            "Inserisce, con il 3° soccorritore, la tavola spinale dietro al paziente facendola aderire alla schiena. Il 1° soccorritore, mantenendo sempre il rachide in linea, blocca la spinale in posizione verticale premendo con il suo corpo verso il paziente",
            "Il 2° e il 3° soccorritore si posizionano frontalmente a lato del paziente, inseriscono il braccio più vicino sotto all'ascella afferrando l'impugnatura della tavola spinale.",
            "Con l'altra mano, impugnano la tavola spinale all'altezza del capo del paziente mettendo un piede alla base della tavola spinale al fine di evitarne lo scivolamento",
            "Contemporaneamente, abbassano la tavola spinale in modo sincrono mentre il 1° soccorritore indietreggia lentamente mantenendo il rachide cervicale in asse",
            "Concludono il movimento appoggiando a terra la spinale. Mentre il 1° soccorritore si posiziona in ginocchio mantenendo il capo in posizione neutra",
            "Se necessario riallinea il paziente e lo centra sulla tavola spinale",
            "Posiziona/fa posizionare ragno e fermacapo",
            "Sospende/fa sospendere l'immobilizzazione manuale del capo",
            "Solleva, con l'ausilio del 3° soccorritore, la tavola spinale ai lati, utilizzando le apposite impugnature",
        ],
    },
];

export default function SkillsPractice() {
    const [selectedSkill, setSelectedSkill] = useState<StepsData | undefined>(
        undefined,
    );
    return (
        <div>
            <h1 className="text-4xl font-bold mb-5">Practica Skills</h1>
            <div className="flex flex-col gap-10 max-w-200 m-auto">
                <div className="p-3 bg-slate-100 cursor-pointer rounded-2xl">
                    <select
                        className="w-full outline-0 cursor-pointer"
                        onChange={(e) =>
                            setSelectedSkill(
                                skills.find(
                                    (skill) =>
                                        skill.procedureName === e.target.value,
                                ),
                            )
                        }
                    >
                        <option
                            selected
                            disabled
                        >
                            Seleziona la skill...
                        </option>
                        {skills.map((skill) => (
                            <option>{skill.procedureName}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-3 bg-red-50 rounded-lg p-3">
                    {selectedSkill ? (
                        <Steps
                            key={selectedSkill.procedureName}
                            procedureName={selectedSkill.procedureName}
                            steps={selectedSkill.steps}
                        />
                    ) : (
                        <p className="italic text-red-400">
                            Nessuna skill selezionata
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
