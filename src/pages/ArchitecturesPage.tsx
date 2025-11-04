import ArchitectureCard from "../ui/ArchitectureCard";

export default function ArchitecturesPage() {
    return (
        <div>
            <h2 className="text-4xl my-4">Architettures</h2>
            <div className="flex flex-col gap-8">
                <ArchitectureCard
                    title="Un App Per Corso"
                    pros={[ "indipendenza", "customizzazione", "focus", "amministrazione" ]}
                    cons={[ "tante app", "tanti link", "gestione" ]}
                    graphSrc="/multiple-apps.png"
                />
                <ArchitectureCard
                    title="Tutti I Corsi Visibili"
                    pros={[ "unico sito", "gestione", "no log-in" ]}
                    cons={[ "accesso a tutto" ]}
                    graphSrc="/single-app-all-accessible.png"
                    exampleLink="/all-courses"
                />
                <ArchitectureCard
                    title="Solo Corsi Accessibili"
                    pros={[ "focus corsista", "Amministratore" ]}
                    cons={[ "log-in", "gestione" ]}
                    graphSrc="/single-app-with-access.png"
                />
            </div>
        </div>
    )
}