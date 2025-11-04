import { createContext, useContext, useState, type ReactNode } from "react";
import type { Exercise } from "../exercises";

type PracticeContextType = {
    exercises: Exercise[];
    addExercise: (exercise: Exercise) => void;
    removeExercise: (exercise: Exercise) => void;
    toggleExercise: (exercise: Exercise) => void;
};

const PracticeContext = createContext<PracticeContextType | undefined>(
    undefined
);

export const PracticeProvider = ({ children }: { children: ReactNode }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    
    function addExercise(exercise: Exercise){
        if (exercises.some(ex => ex.id === exercise.id)) return;
        setExercises(exercises => [ ...exercises, exercise ])
    }
    
    function removeExercise(targetExercise: Exercise) {
        setExercises(exercises => exercises.filter(exercise => exercise.id != targetExercise.id))
    }
    
    function toggleExercise(targetExercise: Exercise) {
        if (exercises.some(exercise => exercise.id === targetExercise.id)) {
            removeExercise(targetExercise);
        } else {
            addExercise(targetExercise);
        }
    }

    return (
        <PracticeContext.Provider value={{ exercises, addExercise, removeExercise, toggleExercise }}>
            {children}
        </PracticeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePractice = () => {
    const context = useContext(PracticeContext);
    if (!context)
        throw new Error(
            "usePractice() must be used inside a <PracticeContext>"
        );
    return context;
};
