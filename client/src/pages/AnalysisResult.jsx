import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function AnalysisResult() {
    const { analysisId } = useParams();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchAnalysis() {
        try {
            if (!analysisId) {
                setError("Invalid analysis ID");
                return null;
            }

            const response = await api.get(
                `/analysis/${analysisId}`
            );

            const data = response.data.data;

            setAnalysis(data);

            return data;

        } catch (error) {
            console.error("Fetch analysis error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch analysis"
            );

            return null;
        }
    }

    useEffect(() => {
        let interval;

        async function loadAnalysis() {
            if (!analysisId) {
                setError("Invalid analysis ID");
                setLoading(false);
                return;
            }

            const data = await fetchAnalysis();

            setLoading(false);

            if (
                data &&
                data.status !== "completed" &&
                data.status !== "failed"
            ) {
                interval = setInterval(async () => {
                    const updatedData = await fetchAnalysis();

                    if (
                        updatedData &&
                        (
                            updatedData.status === "completed" ||
                            updatedData.status === "failed"
                        )
                    ) {
                        clearInterval(interval);
                    }
                }, 3000);
            }
        }

        loadAnalysis();

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [analysisId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>

                    <h2 className="text-2xl font-bold mt-5">
                        Loading Analysis...
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Please wait while we load your analysis.
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">

                <div className="text-center">

                    <p className="text-red-400 text-lg">
                        {error}
                    </p>

                    <Link
                        to="/dashboard"
                        className="inline-block mt-5 text-blue-400 hover:text-blue-300"
                    >
                        Back to Dashboard
                    </Link>

                </div>

            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">

                <div className="text-center">

                    <p className="text-gray-400">
                        Analysis not found.
                    </p>

                    <Link
                        to="/dashboard"
                        className="inline-block mt-5 text-blue-400 hover:text-blue-300"
                    >
                        Back to Dashboard
                    </Link>

                </div>

            </div>
        );
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

                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        {analysis.content?.title || "Analysis Result"}
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Analysis ID: {analysis.id}
                    </p>

                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">

                    <p className="text-gray-400 text-sm">
                        Status
                    </p>

                    <p className="text-xl font-semibold mt-1 capitalize">
                        {analysis.status}
                    </p>

                    {analysis.status !== "completed" &&
                        analysis.status !== "failed" && (
                            <p className="text-yellow-400 mt-3">
                                Analysis is still running...
                            </p>
                        )}

                    {analysis.status === "failed" && (
                        <p className="text-red-400 mt-3">
                            Analysis failed. Please try again.
                        </p>
                    )}

                    {analysis.status === "completed" && (
                        <p className="text-green-400 mt-3">
                            Analysis completed successfully.
                        </p>
                    )}

                </div>

                {analysis.status === "completed" &&
                    analysis.summary && (

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                                <p className="text-gray-400 text-sm">
                                    Total Claims
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {analysis.summary.totalClaims}
                                </p>

                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                                <p className="text-gray-400 text-sm">
                                    Supported
                                </p>

                                <p className="text-3xl font-bold mt-2 text-green-400">
                                    {analysis.summary.supported}
                                </p>

                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                                <p className="text-gray-400 text-sm">
                                    Contradicted
                                </p>

                                <p className="text-3xl font-bold mt-2 text-red-400">
                                    {analysis.summary.contradicted}
                                </p>

                            </div>

                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                                <p className="text-gray-400 text-sm">
                                    Insufficient Evidence
                                </p>

                                <p className="text-3xl font-bold mt-2 text-yellow-400">
                                    {analysis.summary.insufficientEvidence}
                                </p>

                            </div>

                        </div>
                    )}

                <div className="space-y-6">

                    {analysis.content?.claims?.length > 0 ? (

                        analysis.content.claims.map((claim) => {

                            const result =
                                analysis.verificationResults?.find(
                                    (item) =>
                                        item.claimId === claim.id
                                );

                            return (
                                <div
                                    key={claim.id}
                                    className="bg-gray-900 border border-gray-800 rounded-xl p-6"
                                >

                                    <h2 className="text-lg font-semibold">
                                        Claim
                                    </h2>

                                    <p className="text-gray-300 mt-3 leading-7">
                                        {claim.text}
                                    </p>

                                    {result && (
                                        <div className="mt-6">

                                            <div className="flex flex-wrap gap-3">

                                                <span className="px-3 py-1 rounded-full bg-gray-800 text-sm">

                                                    Assessment:{" "}

                                                    <span className="font-semibold">
                                                        {result.assessment}
                                                    </span>

                                                </span>

                                                <span className="px-3 py-1 rounded-full bg-gray-800 text-sm">

                                                    Confidence:{" "}

                                                    <span className="font-semibold">
                                                        {result.confidence || "N/A"}
                                                    </span>

                                                </span>

                                            </div>

                                            <div className="mt-5">

                                                <h3 className="font-semibold">
                                                    Explanation
                                                </h3>

                                                <p className="text-gray-400 mt-2 leading-7">
                                                    {result.explanation}
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                    {claim.evidence?.length > 0 && (

                                        <div className="mt-6">

                                            <h3 className="font-semibold">
                                                Evidence
                                            </h3>

                                            <div className="space-y-3 mt-3">

                                                {claim.evidence.map(
                                                    (evidence) => (

                                                        <div
                                                            key={evidence.id}
                                                            className="border border-gray-800 rounded-lg p-4"
                                                        >

                                                            <p className="text-gray-300 text-sm leading-6">
                                                                {evidence.text}
                                                            </p>

                                                            {evidence.source && (
                                                                <a
                                                                    href={
                                                                        evidence.source.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm break-all"
                                                                >
                                                                    {evidence.source.title ||
                                                                        evidence.source.domain ||
                                                                        "View Source"}
                                                                </a>
                                                            )}

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}

                                </div>
                            );
                        })

                    ) : (

                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

                            <p className="text-gray-400">
                                No claims were extracted from this content.
                            </p>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default AnalysisResult;