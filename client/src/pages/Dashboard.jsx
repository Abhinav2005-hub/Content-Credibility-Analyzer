import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <h1 className="text-xl font-bold">
                        Content Credibility Analyzer
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white transition"
                    >
                        Logout
                    </button>

                </div>
            </nav>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                <div className="mb-10">
                    <h2 className="text-3xl font-bold">
                        Dashboard
                    </h2>

                    <p className="text-gray-400 mt-2">
                        Analyze content and verify claims using evidence.
                    </p>
                </div>

                {/* Action cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Link
                        to="/analyze"
                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition"
                    >
                        <h3 className="text-xl font-semibold">
                            Analyze Content
                        </h3>

                        <p className="text-gray-400 mt-2">
                            Submit an article or text and verify its claims.
                        </p>

                        <div className="mt-5 text-blue-400">
                            Start Analysis →
                        </div>
                    </Link>

                    <Link
                        to="/history"
                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition"
                    >
                        <h3 className="text-xl font-semibold">
                            Analysis History
                        </h3>

                        <p className="text-gray-400 mt-2">
                            View your previous credibility analyses.
                        </p>

                        <div className="mt-5 text-blue-400">
                            View History →
                        </div>
                    </Link>

                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <p className="text-gray-400">
                            Total Analyses
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <p className="text-gray-400">
                            Claims Verified
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            0
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                        <p className="text-gray-400">
                            Supported Claims
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            0
                        </p>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default Dashboard;