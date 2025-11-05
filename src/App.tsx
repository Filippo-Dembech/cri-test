import { Route, Routes } from "react-router-dom";
import ArchitecturesPage from "./pages/ArchitecturesPage";
import CoursesPage from "./pages/CoursesPage";
import SsePage from "./pages/SsePage";
import { PracticeProvider } from "./context/PracticeContext";
import PracticePage from "./pages/PracticePage";
import ParametersGame from "./pages/ParametersGame";

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
                        path="/parameters-game"
                        element={<ParametersGame />}
                    />
                </Routes>
            </PracticeProvider>
        </div>
    );
}
