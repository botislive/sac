import { useState } from "react"


function Login() {

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
   
const submithandler=()=>{
     
}

  return (
    <div>
        <div>
            <h1>Login Page</h1>
        </div>

        <div>
            <form onSubmit={submithandler}>
                <input value={username} onChange={(e)=>setUsername(e.target.value)} type="text" placeholder='ENTER YOUR USERNAME' />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='ENTER YOUR PASSWORD'/>
                <button type='submit'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login