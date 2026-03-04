import { useState } from "react"
import { setMemAtom } from "../atoms/userAtom";
import { useAtom } from "jotai";
const MemberForm = () => {

    const [name, setName] = useState("");
    const [post, setPost] = useState("");
    const [phone, setPhone] = useState("");
    const [year, setYear] = useState("");
    const [branch, setBranch] = useState("");

  const roles = [
    "President", "Vice President", "Secretary", "Core Lead", 
    "Core Team", "Club Manager", "Joint Secretary", "Club Coordinator"
  ]

  const years = ["I", "II", "III", "IV"];

  const branches = [
    "CSE",
    "CSE-AI",
    "IT",
    "ECE",
    "EEE",
    "ME",
    "CE"
  ];

  const [,setMember]=useAtom(setMemAtom)

  const formhandler=(e)=>{
    e.preventDefault()
    if(name && post && phone && year && branch){
        setMember({name,post,phone,year,branch})
        console.log(name,post,phone,year,branch)
        setName("")
        setPost("")
        setPhone("")
        setYear("")
        setBranch("")
    }
    
}
  
  return (
    <div>
        <div>
            <h1>User Form !</h1>
            <div>
                <form onSubmit={formhandler}>

                    <input value={name} onChange={(e)=>setName(e.target.value)}type="text" placeholder='Enter your Name'/>
                    <div className="input-group">
                        <label htmlFor="role-select">Select Position: </label>
                        <select 
                        value={post} 
                        onChange={(e)=>setPost(e.target.value)}
                        id="role-select" 
                        >
                        <option value="" disabled>-- Choose a Role --</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                            {role}
                            </option>
                        ))}
                        </select>
                    </div>
                           
                    <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="text" placeholder='Enter your phone number' />

                    <div className="input-group">
                        <label htmlFor="year-select">Select Year: </label>
                        <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        id="year-select"
                        >
                        <option value="" disabled>-- Choose Year --</option>
                        {years.map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                            {yearOption}
                            </option>
                        ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="branch-select">Select Branch: </label>
                        <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        id="branch-select"
                        >
                        <option value="" disabled>-- Choose Branch --</option>
                        {branches.map((branchOption) => (
                            <option key={branchOption} value={branchOption}>
                            {branchOption}
                            </option>
                        ))}
                        </select>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default MemberForm
