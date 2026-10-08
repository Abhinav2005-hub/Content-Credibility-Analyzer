import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import AnalysisResult from "./pages/AnalysisResult";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/analyze"
                        element={<Analyze />}
                    />

                    <Route
                        path="/analysis/:analysisId"
                        element={<AnalysisResult />}
                    />

                    <Route
                        path="/history"
                        element={<History />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;