import { Route, Routes } from "react-router-dom";
import ArchitecturesPage from "./pages/ArchitecturesPage";
import CoursesPage from "./pages/CoursesPage";
import SsePage from "./pages/SsePage";
import { PracticeProvider } from "./context/PracticeContext";

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
                </Routes>
            </PracticeProvider>
        </div>
    );
}
