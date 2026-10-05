import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Analyze() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleAnalyze(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const contentResponse = await axios.post(
                "http://localhost:5000/api/content",
                {
                    title,
                    text,
                    sourceUrl: sourceUrl || null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const contentId = contentResponse.data.data.id;

            const analysisResponse = await axios.post(
                `http://localhost:5000/api/content/${contentId}/analysis`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const analysisId = analysisResponse.data.data.analysis.id;

            navigate(`/analysis/${analysisId}`);

        } catch (error) {
            console.error("Analysis error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to start analysis"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            <nav className="border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

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

            <main className="max-w-4xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold">
                        Analyze Content
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Submit content and let the system verify its claims
                        using web evidence and AI.
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

                    <form
                        onSubmit={handleAnalyze}
                        className="space-y-6"
                    >

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Title
                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter content title"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Source URL
                            </label>

                            <input
                                type="url"
                                value={sourceUrl}
                                onChange={(e) => setSourceUrl(e.target.value)}
                                placeholder="https://example.com/article"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Content
                            </label>

                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste the article or content you want to verify..."
                                rows={12}
                                required
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500 resize-y"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 rounded-lg font-medium transition"
                        >
                            {loading
                                ? "Starting Analysis..."
                                : "Analyze Content"}
                        </button>

                    </form>

                </div>

            </main>
        </div>
    );
}

export default Analyze;