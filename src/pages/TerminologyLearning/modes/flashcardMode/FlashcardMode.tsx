import { useState } from "react";
import { terms } from "../../terminologyData";
import { shuffle } from "../../utils";
import ProgressBar from "../../../../ui/ProgressBar";
import Flashcard from "../../../../ui/flashcard/Flashcard";
import RecapFeedback from "../RecapFeedback";

interface Props {
    termsCount: number | "all";
}

export default function FlashcardMode({ termsCount }: Props) {
    const [termsQueue, setTermsQueue] = useState(termsCount === "all" ? shuffle(terms) : () =>
        shuffle(terms).slice(0, termsCount),
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [knowTermsAmount, setKnowTermsAmount] = useState(0);
    const [totalTermsSeen, setTotalTermsSeen] = useState(0);
    const [isRecapComplete, setIsRecapComplete] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const current = termsQueue[currentIndex];
    
    function incrementKnownTerms() {
        setKnowTermsAmount((amount) => amount + 1);
    }
    
    function incrementTotalTermsSeen() {
        setTotalTermsSeen((amount) => amount + 1)
    }
    
    function flipCard() {
        setIsCardFlipped(curr => !curr)
    }

    function updateIndex() {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= termsQueue.length) {
            setIsRecapComplete(true);
        } else {
            setCurrentIndex(nextIndex);
        }
    }

    function restart() {
        setTermsQueue(termsCount === "all" ? shuffle(terms) : shuffle(terms).slice(0, termsCount));
        setCurrentIndex(0);
        setIsCardFlipped(false);
        setKnowTermsAmount(0);
        setTotalTermsSeen(0);
        setIsRecapComplete(false);
    }

    if (isRecapComplete)
        return (
            <RecapFeedback
                right={knowTermsAmount}
                total={totalTermsSeen}
                onRestart={restart}
            />
        );

    return (
        <div className="flex flex-col gap-4">
            <ProgressBar
                done={currentIndex}
                total={termsQueue.length}
            />

            <Flashcard
                front={current.definition}
                back={current.validAnswers}
                isFlipped={isCardFlipped}
                onDeclare={incrementTotalTermsSeen}
                onFlipChange={flipCard}
                onFlipComplete={updateIndex}
                onRemember={incrementKnownTerms}
            />
        </div>
    );
}
