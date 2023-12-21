import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../userContext'
import { useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Spinner from '../component/Spinner'
import Places from './Places'
import { FaRegUserCircle } from "react-icons/fa"
import Booking from './Booking'
function AcountPage() {
    const {subpage} = useParams()
    const {user, setExist, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const [load , setLoad] = useState(false)
    const addClass = (type)=>{
        if (type != subpage) {
            return ' py-2 px-4 items-center border rounded-xl bg-slate-200 flex gap-2'
        }else if (type == subpage) {
            return 'border rounded-xl bg-[#FF5A5F] py-2 px-4 items-center hover:shadow-md text-white flex gap-2'
        }
    }
    const LogedOut = ()=>{
        setLoad(true)
        axios.post('/logout', user).then((result)=>{
            setLoad(false)
            setExist(false)
            setUser(null)
            navigate('/')
        }).catch((err)=>{
            setLoad(false)
            console.log(err.message)
        })
    }
  return (
    <div>
    <nav className='p-6 flex justify-center gap-x-7  '>
        <Link to='/acount/profile' className={addClass('profile')} >
            <FaRegUserCircle/>
            <div>My profile</div>
        </Link>
        <Link to='/acount/booking' className={addClass('booking')}>My bookings</Link>
        <Link to='/acount/accom' className={addClass('accom')}>My accomondations</Link>
    </nav>
    {
        subpage =='profile' && <div className='p-5 justify-center flex-col text-center space-y-4'>
            <div>Logged in as  {user?.email}</div>
            <div>
                <button className='border rounded-xl bg-[#FF5A5F] py-2 px-4 items-center hover:shadow-md text-white w-1/3' onClick={()=>{LogedOut()}}>LogOut</button>
            </div>
        </div>
    }
    {
        subpage =="accom" && <Places/>
    }
    {
        subpage =='booking' && <Booking/>
    }
    </div>

  )
}

export default AcountPage