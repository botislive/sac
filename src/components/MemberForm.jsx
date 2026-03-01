import { useState } from "react"
import { setMemAtom } from "../atoms/userAtom";
import { useAtom } from "jotai";
const MemberForm = () => {

    const [name, setName] = useState("");
    const [post, setPost] = useState("");
    const [phone, setPhone] = useState("");


    const roles = [
    "President", "Vice President", "Secretary", "Core Lead", 
    "Core Team", "Club Manager", "Joint Secretary", "Club Coordinator"
  ]

  const [,setMember]=useAtom(setMemAtom)

  const formhandler=(e)=>{
    e.preventDefault()
    if(name && post && phone){
        setMember({name,post,phone})
        console.log(name,post,phone)
        setName("")
        setPost("")
        setPhone("")
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
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default MemberForm