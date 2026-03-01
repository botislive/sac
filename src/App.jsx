import './App.css'
import { sacMemAtom } from './atoms/userAtom' 
import { useAtom } from 'jotai'
import MemberForm from './components/MemberForm.jsx'

function App() {
        const [members]=useAtom(sacMemAtom)
 
  return (
    <>
       <div>
        <h1>
          Sample sac member detials !
        </h1>
               {members.map((member)=>(
                <div key={member.name}><br/>
                    <p>Name: {member.name}</p>
                    <p>Post: {member.post}</p>
                    <p>Phone: {member.phone}</p>
                </div>
               ))}
         <br />
         <div>
          <MemberForm />
         </div>
       </div>
    </>
  )
}

export default App
