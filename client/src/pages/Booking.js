import React from 'react'
import { useEffect , useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../component/Spinner'
import { CiCalendarDate } from "react-icons/ci"
import { MdOutlineNightlight } from "react-icons/md"
import { MdOutlinePriceChange } from "react-icons/md"
import { differenceInCalendarDays } from 'date-fns'
function Booking() {
  const [booking , setBooking] = useState([])
  const [load , setLoad] = useState(false)
  const getData = ()=>{
    setLoad(true)
    axios.get('/GetBookingPlace').then((result)=>{
      setLoad(false)
      setBooking([...result.data])
    }).catch((err)=>{
      setLoad(false)
    })
  }
  useEffect(()=>{getData()}, []) 
  return (
    <div>
      {
        load ? <div className='flex justify-center fixed top-[44%]'><Spinner/></div> : <div className='flex-col space-y-4'>
          {booking.length >0 && booking.map((place)=>{
            return <div className='flex space-x-4 mx-auto bg-gray-300 w-5/6 rounded-lg '>
              <div className='w-1/6'>
                <img src={"http://localhost:5000/"+ place.photo} className='rounded-tl-lg  rounded-bl-lg h-full'/>
              </div>
              <div className='items-center my-auto space-y-2'>
                <h1 className='text-2xl text-black font-bold'>{place.title}</h1>
                  <div>
                      <div className='flex space-x-2 items-center'><MdOutlineNightlight className='mr-1'/> {differenceInCalendarDays(place.checkout , place.checkin)} nights </div>
                      <div className='flex space-x-3 items-center'><CiCalendarDate className='mr-1'/> {place.checkin} =&gt; <CiCalendarDate className='mr-1'/> { place.checkout}</div>
                  </div>
                  <div className='flex space-x-5 items-center'><MdOutlinePriceChange className='mr-1' /> Total Price : {place.price}</div>
                </div>
              </div>
          })}
        </div>
      }
    </div>
  )
}

export default Booking