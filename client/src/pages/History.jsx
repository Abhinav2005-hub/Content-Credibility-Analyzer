import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function History() {
    const navigate = useNavigate();

    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchHistory() {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/analysis/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAnalyses(response.data.data.analyses || []);
        } catch (error) {
            console.error("Fetch history error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch analysis history"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHistory();
    }, []);

    function getStatusClass(status) {
        if (status === "completed") {
            return "text-green-400";
        }

        if (status === "failed") {
            return "text-red-400";
        }

        return "text-yellow-400";
    }

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

                    <Link
                        to="/dashboard"
                        className="text-gray-400 hover:text-white"
                    >
                        Dashboard
                    </Link>

                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Analysis History
                        </h1>

                        <p className="text-gray-400 mt-2">
                            View your previous content credibility analyses.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/analyze")}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                        New Analysis
                    </button>

                </div>

                {loading && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                        <p className="text-gray-400">
                            Loading history...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-gray-900 border border-red-800 rounded-xl p-6">
                        <p className="text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && !error && analyses.length === 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">

                        <h2 className="text-xl font-semibold">
                            No analyses yet
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Start your first content analysis.
                        </p>

                        <button
                            onClick={() => navigate("/analyze")}
                            className="mt-5 px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Analyze Content
                        </button>

                    </div>
                )}

                {!loading && !error && analyses.length > 0 && (
                    <div className="space-y-4">

                        {analyses.map((analysis) => (
                            <div
                                key={analysis.id}
                                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition"
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {analysis.content?.title ||
                                                "Untitled Content"}
                                        </h2>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Analysis #{analysis.id}
                                        </p>

                                        <p className="text-gray-500 text-sm mt-1">
                                            {new Date(
                                                analysis.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5">

                                        <span
                                            className={`capitalize font-medium ${getStatusClass(
                                                analysis.status
                                            )}`}
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
                                            View Result
                                        </button>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </main>

        </div>
    );
}

export default History;