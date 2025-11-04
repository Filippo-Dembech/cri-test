import { usePractice } from "../context/PracticeContext"
import type { TrueFalseData } from "../exercises";
import TrueFalse from "../ui/exercise/TrueFalse";

export default function PracticePage() {
    
    const {exercises} = usePractice();

    return (
        <div>
            <h1 className="text-4xl font-bold">Practice</h1>
            <div>
                {exercises.map(exercise => {
                    if (exercise.type === "true-false") {
                        const { prompt, answer }= exercise.data as TrueFalseData;
                        return <TrueFalse prompt={prompt} answer={answer}/>;
                    }
                    return <p>{exercise.type}</p>
                })}
            </div>
        </div>

    )
}