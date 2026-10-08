import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchAnalyses() {
        try {
            const response = await api.get(
                "/analysis/history"
            );

            setAnalyses(
                response.data.data.analyses || []
            );

        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAnalyses();
    }, []);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    const totalAnalyses = analyses.length;

    const completedAnalyses = analyses.filter(
        (analysis) =>
            analysis.status === "completed"
    ).length;

    const pendingAnalyses = analyses.filter(
        (analysis) =>
            analysis.status === "pending" ||
            analysis.status === "processing"
    ).length;

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            <nav className="border-b border-gray-800">

                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <Link
                        to="/dashboard"
                        className="text-xl font-bold"
                    >
                        Content Credibility Analyzer
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white"
                    >
                        Logout
                    </button>

                </div>

            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-10">

                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Analyze content and verify claims using evidence.
                    </p>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mb-10">

                    <Link
                        to="/analyze"
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 transition"
                    >
                        <h2 className="text-xl font-semibold">
                            Analyze Content
                        </h2>

                        <p className="text-blue-100 mt-2">
                            Submit new content for credibility analysis.
                        </p>
                    </Link>

                    <Link
                        to="/history"
                        className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition"
                    >
                        <h2 className="text-xl font-semibold">
                            Analysis History
                        </h2>

                        <p className="text-gray-400 mt-2">
                            View your previous analyses and results.
                        </p>
                    </Link>

                </div>

                <div className="mb-10">

                    <h2 className="text-xl font-semibold mb-4">
                        Overview
                    </h2>

                    {loading ? (
                        <p className="text-gray-400">
                            Loading statistics...
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

                                <p className="text-gray-400">
                                    Total Analyses
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {totalAnalyses}
                                </p>

                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

                                <p className="text-gray-400">
                                    Completed
                                </p>

                                <p className="text-3xl font-bold mt-2 text-green-400">
                                    {completedAnalyses}
                                </p>

                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

                                <p className="text-gray-400">
                                    Pending
                                </p>

                                <p className="text-3xl font-bold mt-2 text-yellow-400">
                                    {pendingAnalyses}
                                </p>

                            </div>

                        </div>
                    )}

                </div>

                <div>

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-xl font-semibold">
                            Recent Analyses
                        </h2>

                        <Link
                            to="/history"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                            View All
                        </Link>

                    </div>

                    {!loading &&
                        analyses.length === 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">

                                <p className="text-gray-400">
                                    You haven't analyzed any content yet.
                                </p>

                                <Link
                                    to="/analyze"
                                    className="inline-block mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                >
                                    Start Your First Analysis
                                </Link>

                            </div>
                        )}

                    {!loading &&
                        analyses.length > 0 && (

                            <div className="space-y-3">

                                {analyses
                                    .slice(0, 5)
                                    .map((analysis) => (

                                        <div
                                            key={analysis.id}
                                            className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between"
                                        >

                                            <div>

                                                <h3 className="font-semibold">
                                                    {analysis.content?.title ||
                                                        "Untitled Content"}
                                                </h3>

                                                <p className="text-gray-500 text-sm mt-1">
                                                    Analysis #{analysis.id}
                                                </p>

                                            </div>

                                            <div className="flex items-center gap-4">

                                                <span
                                                    className={
                                                        analysis.status ===
                                                        "completed"
                                                            ? "text-green-400"
                                                            : analysis.status ===
                                                              "failed"
                                                            ? "text-red-400"
                                                            : "text-yellow-400"
                                                    }
                                                >
                                                    {analysis.status}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/analysis/${analysis.id}`
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                                                >
                                                    View
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                            </div>

                        )}

                </div>

            </main>

        </div>
    );
}

export default Dashboard;