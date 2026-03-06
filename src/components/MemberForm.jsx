import { useState } from "react"
import { setMemAtom } from "../atoms/userAtom"
import { useAtom } from "jotai"
import { toast } from "sonner"

const ROLES = ["President", "Vice President", "Secretary", "Core Lead", "Core Team", "Club Manager", "Joint Secretary", "Club Coordinator"]
const YEARS = ["I", "II", "III", "IV"]
const BRANCHES = ["CSE", "CSE-AI", "IT", "ECE", "EEE", "ME", "CE"]

const MemberForm = () => {
    const [name, setName] = useState("")
    const [post, setPost] = useState("")
    const [phone, setPhone] = useState("")
    const [year, setYear] = useState("")
    const [branch, setBranch] = useState("")
    const [, setMember] = useAtom(setMemAtom)

    const formhandler = (e) => {
        e.preventDefault()
        if (name && post && phone && year && branch) {
            setMember({ name, post, phone, year, branch })
            toast.success("Member registered successfully!")
            setName("")
            setPost("")
            setPhone("")
            setYear("")
            setBranch("")
        } else {
            toast.error("Please fill all required fields")
        }
    }

    return (
        <form onSubmit={formhandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
                <label className="label-dark" htmlFor="member-name">Full Name</label>
                <input
                    id="member-name"
                    className="input-dark"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    placeholder="Enter full name"
                    required
                />
            </div>

            <div>
                <label className="label-dark" htmlFor="member-phone">Phone Number</label>
                <input
                    id="member-phone"
                    className="input-dark"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    type="tel"
                    placeholder="Enter phone number"
                    required
                />
            </div>

            <div>
                <label className="label-dark" htmlFor="member-post">Role / Position</label>
                <div style={{ position: 'relative' }}>
                    <select
                        id="member-post"
                        className="select-dark"
                        value={post}
                        onChange={e => setPost(e.target.value)}
                        required
                    >
                        <option value="" disabled>— Select a Role —</option>
                        {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"><polyline points="4 6 8 10 12 6" /></svg>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                    <label className="label-dark" htmlFor="member-year">Year</label>
                    <div style={{ position: 'relative' }}>
                        <select id="member-year" className="select-dark" value={year} onChange={e => setYear(e.target.value)} required>
                            <option value="" disabled>Year</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <svg style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"><polyline points="3 5 6 9 9 5" /></svg>
                    </div>
                </div>
                <div>
                    <label className="label-dark" htmlFor="member-branch">Branch</label>
                    <div style={{ position: 'relative' }}>
                        <select id="member-branch" className="select-dark" value={branch} onChange={e => setBranch(e.target.value)} required>
                            <option value="" disabled>Branch</option>
                            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <svg style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"><polyline points="3 5 6 9 9 5" /></svg>
                    </div>
                </div>
            </div>

            <button id="btn-register-member" type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
                Register Member
            </button>
        </form>
    )
}

export default MemberForm
