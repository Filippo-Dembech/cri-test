export type ModeType = "flashcard" | "type" | "match";
export type TerminologyData = {
    definition: string;
    validAnswers: string[];
}
export type TermEntry = {
    definition: string;
    validAnswers: string[];
};
export type MatchCard = { id: string; text: string; type: "def" | "term"; pairIdx: number };
export type MatchStatus = "idle" | "correct" | "wrong";