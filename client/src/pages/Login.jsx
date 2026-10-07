import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/login",
                { email, password }
            );
        
            localStorage.setItem(
                "token",
                response.data.data.token
            );
        
            window.location.href = "/dashboard";
        
        } catch (error) {
            console.error(
                "Login error:",
                error.response?.data || error.message
            );
        
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Content Credibility Analyzer
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Verify claims using evidence and AI
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <h2 className="text-2xl font-semibold mb-6">
                        Login
                    </h2>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-blue-500"
                                required
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
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    <p className="text-center text-gray-400 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;