import { Route, Routes } from "react-router-dom";
import ArchitecturesPage from "./pages/ArchitecturesPage";
import CoursesPage from "./pages/CoursesPage";
import SsePage from "./pages/SsePage";
import { PracticeProvider } from "./context/PracticeContext";
import PracticePage from "./pages/PracticePage";
import ParametersPractice from "./pages/ParametersPractice";
import TerminologyPractice from "./pages/TerminologyPractice";
import SkillsPractice from "./pages/SkillsPractice";
import AnalyzePractice from "./pages/AnalyzePractice";
import DiseasePractice from "./pages/DiseasePractice";

export default function App() {
    return (
        <div className="p-8">
            <PracticeProvider>
                <Routes>
                    <Route
                        path="/"
                        element={<ArchitecturesPage />}
                    />
                    <Route
                        path="/all-courses"
                        element={
                            <CoursesPage
                                courses={[
                                    "TS",
                                    "SSE",
                                    "ECG",
                                    "Glicemia",
                                    "Multiparametrico",
                                ]}
                            />
                        }
                    />
                    <Route
                        path="/sse"
                        element={<SsePage />}
                    />
                    <Route
                        path="/practice"
                        element={<PracticePage />}
                    />
                    <Route
                        path="/parameters-practice"
                        element={<ParametersPractice />}
                    />
                    <Route
                        path="/terminology-practice"
                        element={<TerminologyPractice />}
                    />
                    <Route
                        path="/skills-practice"
                        element={<SkillsPractice />}
                    />
                    <Route
                        path="/analyze-practice"
                        element={<AnalyzePractice />}
                    />
                    <Route
                        path="/disease-practice"
                        element={<DiseasePractice />}
                    />
                </Routes>
            </PracticeProvider>
        </div>
    );
}
