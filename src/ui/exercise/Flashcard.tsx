import { useState } from "react";
import type { FlashcardData } from "../../exercises";

export default function Flashcard({ front, back }: FlashcardData) {
  const [flipped, setFlipped] = useState(false);
  const [isMemorized, setIsMemorized] = useState<boolean | undefined>(undefined);

  return (
    <div
      className="w-120 h-48 flex gap-3 items-center cursor-pointer perspective-[1000px]"
    >
      <div
        onClick={() => setFlipped(!flipped)}
        className={`relative w-full h-full transition-transform duration-500 transform-3d ${flipped ? 'transform-[rotateY(180deg)]' : ''}`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 font-bold p-5 text-white rounded-2xl shadow-md backface-hidden">
          {front}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl p-5 shadow-md backface-hidden transform-[rotateY(180deg)]">
          {back}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-60">
        <button onClick={() => setIsMemorized(true)} className={isMemorized ? "border-4 bg-red-200 rounded-lg font-bold text-center p-2 border-red-500" : "text-center border-4 rounded-lg p-2"}>Indovinato</button>
        <button onClick={() => setIsMemorized(false)} className={isMemorized ? "text-center border-4 rounded-lg p-2" : "border-4 bg-red-200 rounded-lg font-bold text-center p-2 border-red-500"}>Da Rivedere</button>
      </div>
    </div>
  );
}
