import { Route, Routes } from "react-router-dom";
import { PracticeProvider } from "./context/PracticeContext";
import PracticePage from "./pages/PracticePage";
import ParametersPractice from "./pages/ParametersPractice/ParametersPractice";
import TerminologyPractice from "./pages/TerminologyLearning/TerminologyPractice";
import SkillsPractice from "./pages/SkillsLearning/SkillsLearning";
import AnalyzePractice from "./pages/AnalyzePractice";
import DiseasePractice from "./pages/DiseasePractice";
import CoursePage from "./pages/CoursePage";
import TheoryPage from "./pages/TheoryPage";
import RecapPage from "./pages/RecapPage";
import SSEPractice from "./pages/SSEPractice";
import OxygenPractice from "./pages/OxygenPractice";
import SweepingTriagePractice from "./pages/SweepingTriageLearning/SweepingTriagePractice";
import ECGPractice from "./pages/ECGPractice";
import GlucoseLearning from "./pages/GlucoseLearning/GlucoseLearning";
import DiagnosticSuspicionScorePractice from "./pages/DiagnosticSuspicionScorePractice";

export default function App() {
    return (
        <div>
            <PracticeProvider>
                <Routes>
                    <Route
                        path="/"
                        // element={<SSEPage />}
                        element={<SSEPractice />}
                    />
                    {/* <Route
                        path="/"
                        element={
                            <CoursesPage
                                coursesLinks={[
                                    {
                                        name: "Trasporto Semplice",
                                        url: "/corsi/ts",
                                    },
                                    {
                                        name: "Soccorso Sanitario Extraospedaliero",
                                        url: "/corsi/sse",
                                    },
                                    {
                                        name: "Elettrocardiogramma (ECG)",
                                        url: "/corsi/ecg",
                                    },
                                    {
                                        name: "Glicemia",
                                        url: "/corsi/glicemia",
                                    },
                                    {
                                        name: "Multiparametrico",
                                        url: "/corsi/multiparametrico",
                                    },
                                ]}
                            />
                        }
                    /> */}
                    <Route
                        path="corsi/:course"
                        element={<CoursePage />}
                    />
                    <Route
                        path="corsi/:course/teoria"
                        element={<TheoryPage />}
                    />
                    <Route
                        path="corsi/:course/pratica"
                        element={<RecapPage />}
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
                    <Route
                        path="/oxygen-practice"
                        element={<OxygenPractice/>}
                    />
                    <Route
                        path="/sweeping-triage-practice"
                        element={<SweepingTriagePractice />}
                    />
                    <Route
                        path="/ecg-practice"
                        element={<ECGPractice />}
                    />
                    <Route
                        path="/blood-glucose-practice"
                        element={<GlucoseLearning />}
                    />
                    <Route
                        path="/diagnostic-suspicion-score-practice"
                        element={<DiagnosticSuspicionScorePractice />}
                    />
                </Routes>
            </PracticeProvider>
        </div>
    );
}
