import { usePractice } from "../context/PracticeContext"
import type { FillInData, FlashcardData, MultipleChoiceData, StepsData, TerminologyData, TrueFalseData } from "../exercises";
import FillIn from "../ui/exercise/FillIn";
import Flashcard from "../ui/exercise/Flashcard";
import MultipleChoice from "../ui/exercise/MultipleChoice";
import Steps from "../ui/exercise/Steps";
import Terminology from "../ui/exercise/Terminology";
import TrueFalse from "../ui/exercise/TrueFalse";

export default function PracticePage() {
    
    const {exercises} = usePractice();

    return (
        <div>
            <h1 className="text-4xl font-bold">Practice</h1>
            <div className="flex flex-col gap-3">
                {exercises.map(exercise => {
                    if (exercise.type === "true-false") {
                        const { prompt, answer }= exercise.data as TrueFalseData;
                        return <TrueFalse prompt={prompt} answer={answer}/>;
                    }
                    if (exercise.type === "fill-in") {
                        const { sentence, correctWords }= exercise.data as FillInData;
                        return <FillIn sentence={sentence} correctWords={correctWords} /> 
                    }
                    if (exercise.type === "flashcard") {
                        const { front, back }= exercise.data as FlashcardData;
                        return <Flashcard front={front} back={back} /> 
                    }
                    if (exercise.type === "multiple-choice") {
                        const { question, options, answerId }= exercise.data as MultipleChoiceData;
                        return <MultipleChoice question={question} options={options} answerId={answerId} /> 
                    }
                    if (exercise.type === "terminology") {
                        const { definition, answer }= exercise.data as TerminologyData;
                        return <Terminology definition={definition} answer={answer} /> 
                    }
                    if (exercise.type === "steps") {
                        const { procedureName, steps }= exercise.data as StepsData;
                        return <Steps procedureName={procedureName} steps={steps} /> 
                    }
                    return <p>{exercise.type}</p>
                })}
            </div>
        </div>

    )
}