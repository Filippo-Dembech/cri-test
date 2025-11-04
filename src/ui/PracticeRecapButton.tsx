import { usePractice } from "../context/PracticeContext"

export default function PracticeRecapButton() {
    const { exercises } = usePractice();
    return (
        <button className="bg-red-600 text-white py-3 px-6 rounded-3xl fixed bottom-2 right-2 flex flex-col cursor-pointer">
            <span className="text-xl font-bold">Practice</span>
            <span >({exercises.length} exercises)</span>
        </button>
    )
}