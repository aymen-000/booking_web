import React, { useContext, useState } from 'react'
import Header from '../component/Header'
import Spinner from '../component/Spinner'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {useSnackbar} from 'notistack'
import { UserContext } from '../userContext'
import { compareSync } from 'bcryptjs'
function Login() {
    const [email , setEmail]= useState('')
    const [password , setPassowrd] = useState('')
    const [load , setLoading] = useState(false)
    const navigate = useNavigate()
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const {setUser, setExist}=useContext(UserContext)
    const [err , setErr] = useState('')

    const logIn = (e)=>{
        e.preventDefault()
        const data = {
          email , 
          password 
        }
        setLoading(true)
        axios.post('/login' , data).then(
          (result)=>{
            setLoading(false)
            setErr(result.data)
            if(!result.data.password) {
              console.log('df')
            }else {
              setUser(result.data)
              const link = '/acount'
              setExist(true)
              navigate(link)
            }

          }
        ).catch((err)=>{
          setLoading(false)
          enqueueSnackbar('FAILED TO LOGIN' , {variant:'error'})
          console.log(err.message)
        })

    }
  return (
    <div>
      {load ?  <div className='h-screen items-center justify-center flex'><Spinner/></div> 
           : 
        <div className='  flex-col  space-y-4  items-center justify-center mt-20 sm:w-[100%] sm:justify-start sm:items-start'>
           <h1 className='text-black text-2xl font-bold text-center'>Login</h1>
           <form className='max-w-sm mx-auto space-y-3 ' onSubmit={(e)=>{logIn(e)}}>
                <div><input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='your@email.com' className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw] max-sm:w-full'/></div>
                <div><input type='password' value={password} onChange={(e)=>{setPassowrd(e.target.value)}} placeholder='Password' className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw] max-sm:w-full'/></div>
                <div><button  className='border border-slate-500 rounded-2xl w-[30vw] p-2 max-md:w-[50vw] bg-[#FF5A5F] text-white font-bold hover:bg-[#fa6268] cursor-pointer hover:opacity-80 max-sm:w-full'>Login</button></div>
                <div className='  text-center'>Don't have an acount yet ?<Link to={"../register"}>Register Now</Link></div>
           </form>
        </div>}
  { err == "password wrong" ? <div className='flex justify-center'><p className='text-red-600'> Password wrong try agian </p></div> : err == "not registered " ? <div className='flex justify-center'><p className='text-red-600'> Ther is no acount with this information </p></div> : <div></div>}
  </div>
  )
}

export default Login