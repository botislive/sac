import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAtom } from "jotai"
import { authAtomWithStorage } from "../atoms/authAtom"

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [, setIsAuthenticated] = useAtom(authAtomWithStorage)
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        if (username === 'srk@123' && password === 'admin@123') {
            setIsAuthenticated(true)
            navigate('/')
        } else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
            <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 text-center">
                    <h1 className="text-2xl font-bold text-white tracking-wide">SAC Log Book</h1>
                    <p className="text-blue-200 mt-2">Sign in to manage events & members</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 mt-4"
                        >
                            Login to Dashboard
                        </button>

                        <div className="text-center mt-6 text-xs text-gray-500">
                            Temporary Credentials: srk@123 / admin@123
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login