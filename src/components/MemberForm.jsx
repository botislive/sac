import { useState } from "react"
import { setMemAtom } from "../atoms/userAtom";
import { useAtom } from "jotai";

const MemberForm = () => {
    const [name, setName] = useState("");
    const [post, setPost] = useState("");
    const [phone, setPhone] = useState("");
    const [year, setYear] = useState("");
    const [branch, setBranch] = useState("");
    const [, setMember] = useAtom(setMemAtom);

    const roles = [
        "President", "Vice President", "Secretary", "Core Lead",
        "Core Team", "Club Manager", "Joint Secretary", "Club Coordinator"
    ]

    const years = ["I", "II", "III", "IV"];

    const branches = [
        "CSE", "CSE-AI", "IT", "ECE", "EEE", "ME", "CE"
    ];

    const formhandler = (e) => {
        e.preventDefault()
        if (name && post && phone && year && branch) {
            setMember({ name, post, phone, year, branch })
            setName("")
            setPost("")
            setPhone("")
            setYear("")
            setBranch("")
        }
    }

    return (
        <form onSubmit={formhandler} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter full name"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Enter phone number"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role / Position</label>
                    <select
                        value={post}
                        onChange={(e) => setPost(e.target.value)}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                        <option value="" disabled>-- Select a Role --</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="" disabled>Year</option>
                            {years.map((yearOption) => (
                                <option key={yearOption} value={yearOption}>{yearOption}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                        <select
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="" disabled>Branch</option>
                            {branches.map((branchOption) => (
                                <option key={branchOption} value={branchOption}>{branchOption}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
                Register Member
            </button>
        </form>
    )
}

export default MemberForm
