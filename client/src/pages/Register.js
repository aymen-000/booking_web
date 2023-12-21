import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../component/Spinner'
import { useNavigate } from 'react-router-dom'
function Register() {
    const [email , setEmail]= useState('')
    const [password , setPassowrd] = useState('')
    const [name , setName] = useState('')
    const [load , setLoad] = useState(false)
    const navigate = useNavigate()
    const registerUser = (e)=>{
        setLoad(true)
        e.preventDefault()
        const data = {
            name , 
            email , 
            password
        }
        axios.post("/register", data).then((result)=>{
            setLoad(false)
            console.log("done")
        }).catch((err)=>{
            setLoad(false)
            console.log(err.message)
        })
    }
    return (
        <div>
            {
                load ? 
                    <div className='fixed top-[50%] left-[50%] bottom-[50%]'><Spinner/></div> :
                    <div className='  flex-col fixed left-[35vw] top-[35vh] space-y-4'>
                        <h1 className='text-black text-2xl font-bold text-center'>Register</h1>
                            <form className='max-w-sm mx-auto space-y-3' onSubmit={(e) => {registerUser(e)}}>
                                <div><input type='text' value={name} onChange={(e) => { setName(e.target.value) }} placeholder='Jhon Doe' className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw]' /></div>
                                <div><input type='email' value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='your@email.com' className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw]' /></div>
                                <div><input value={password} type='password' onChange={(e) => { setPassowrd(e.target.value) }} placeholder='Password' className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw]' /></div>
                                <div><button  className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw] bg-[#FF5A5F] text-white font-bold hover:bg-[#fa6268] cursor-pointer hover:opacity-80'>Register</button></div>
                                <div className='text-center'>have an acount yet ?<Link to={"../login"}>Login</Link></div>
                            </form>
                    </div>
            }
        </div>
    )
}

export default Register