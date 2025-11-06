import { Link } from "react-router-dom";

interface ArchitectureCardProps {
    title: string;
    pros: string[];
    cons: string[];
    graphSrc: string;
    exampleLink?: string;
}

export default function ArchitectureCard({ title, pros, cons, graphSrc, exampleLink}: ArchitectureCardProps) {
    return (
        <div className="flex justify-around items-center gap-8 bg-slate-200 rounded-2xl p-8">
            <div>
                <h3 className="text-3xl mb-4 text-center">{title}</h3>
                <div className="flex justify-around gap-4 mb-8">
                    <div>
                        <p className="font-bold text-green-600">PRO</p>
                        <ul>
                            {pros.map(pro => (
                                <p>- {pro.toLowerCase()}</p>
                            )
                            )}
                        </ul>
                    </div>
                    <div>
                        <p className="font-bold text-red-600">CONTRO</p>
                        <ul>
                            {cons.map((con, i) => (
                                <p key={`${con}-${i}`}>- {con.toLowerCase()}</p>
                            )
                            )}
                        </ul>
                    </div>
                </div>
                {exampleLink && <Link className="bg-slate-300 py-2 px-4 rounded-xl block text-center" to={exampleLink}>Esempio</Link>}
            </div>
            <img className="block rounded-2xl h-[60vh]" src={graphSrc} />
        </div>
    )
}