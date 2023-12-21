import React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import { UserContext } from '../userContext'
import { useContext } from 'react'
import { CiLocationOn } from "react-icons/ci"
import Spinner from '../component/Spinner'
import { useNavigate } from 'react-router-dom'
import { differenceInCalendarDays } from 'date-fns'
function PlacePage() {
    const {exist} = useContext(UserContext)
    const navigate = useNavigate()
    const {id} = useParams()
    const [place , setPlace] = useState('')
    const [showPhotos , setShowPhotos] = useState(false)
    const [loading  ,setLoading] = useState(false)
    const [name , setName] = useState('')
    const [phone , setPhone] = useState('')
    const [checkin , setCheckin] = useState('')
    const [checkout , setCheckout] = useState('')
    const [num , setNum] = useState(1)
    const [response  , setResponse] = useState(true)
    const [days , setDays] = useState(0) 

    const getDefference =()=>{
        setDays(differenceInCalendarDays(checkout , checkin))
    }
    const Submit =()=>{
        getDefference()
        if (days > 0 && exist)  {
            const data =  {
                title : place.title , 
                name , 
                phone , 
                checkin , 
                checkout , 
                num , 
                price : place.price*days , 
                photo : place.photos[0]
            }
            axios.post('/applyForPlace', data).then((result)=>{
                if(result.data){
                    navigate("/acount/booking")
                }
            }).catch((err)=>{
                console.log(err)
            })
        }else if (!exist) {
            navigate('/login')
        }
        
    }
    useEffect(()=>{
        setLoading(true)
        axios.get('/OnePlace/'+id ).then((result)=>{
            setLoading(false)
            setPlace(result.data)
        }).catch((err)=>{
            console.log(err)
        })
    }, [])
    if (showPhotos) {
        return <div className='h-fit inset-0 absolute bg-black '>
            <div className='flex items-center cursor-pointer hover:shadow-lg p-6 fixed' onClick={()=>{setShowPhotos(false)}} ><IoClose className='text-white  font-bold text-2xl'/> <span className='text-white  text-2xl'>Close</span></div>
            <div className='flex-col space-y-3 w-4/6 mx-auto my-20'>
                <h1 className='text-white  text-2xl flex justify-center'> photos of  {place?.title}</h1>
                {place && place.photos.length>0 && place.photos.map((img)=>{
                    return <div>
                        <img src={'http://localhost:5000/'+ img} className='rounded-lg w-full h-[60vw] '/>
                    </div>
                })}
            </div>
        </div>
    }
  return (
    <div className='bg-gray-300 p-4 my-4 mx-auto rounded-lg w-5/6'>
        { place && 
        <div>
        <div>
            <h1 className='text-black text-2xl font-mono'>{place.title}</h1>
            <div className='flex space-x-1 items-center'>
                <CiLocationOn/>
                <a className='text-lg font-extrabold underline' href='/'>{place.address}</a>
            </div>
        </div>
        <div className='flex gap-2 object-cover my-3 max-sm:flex-col'>
            <div className='w-1/2 max-sm:w-full relative'>
                <img src={'http://localhost:5000/'+ place?.photos[0]} className='rounded-lg h-[400px] '/>
                <button className='px-3 py-2 rounded-lg bg-white text-black text-center absolute  bottom-2 left-3 opacity-60 hover:opacity-90 ' onClick={(e)=>{setShowPhotos(true)}}>show more photos</button>
            </div>
            <div className='w-1/2 bg-white flex-col gap-2  max-sm:hidden'>
                <div className='object-cover h-1/2'>
                    <img src={"http://localhost:5000/" + place?.photos[1]} className='h-[200px] w-full rounded-lg'/>
                </div>
                <div className='object-cover h-1/2'>
                    {place.photos[2]?<img src={"http://localhost:5000/" + place?.photos[2]} className='h-[200px] w-full rounded-lg'/> : <div className='bg-gray-300 h-[200px] w-full'>
                    </div>}
                </div>
            </div>   
        </div>
        <div className='flex justify-between space-x-2 mt-4 max-md:flex-col mx-auto w-5/6'>
            <div className='w-1/2 max-md:w-full'>
                <div>
                    <h1 className='text-black font-semibold text-2xl my-2'>Description :</h1>
                    <p className='font-serif'> {place.description}</p>
                </div>
                <div>
                    <p><span className='text-xl  font-extrabold'>checkin : </span>{place.checkin}</p>
                    <p><span className='text-xl  font-extrabold'>checkout : </span>{place.checkout}</p>
                    <p><span className='text-xl  font-extrabold'>max number of geusts: </span> {place.maxguests}</p>
                </div>

            </div>
            <div className='bg-white rounded-lg  space-y-2 my-2 w-1/2 p-3 max-md:w-full'>
                <div className='text-center font-black'>Price : {place.price}</div>
                <div className='border-2   rounded-lg p-3 hover:shadow-md text-center cursor-pointer'>
                    <label>Checkin :</label>
                    <input type='date' value={checkin} onChange={(e)=>{setCheckin(e.target.value)}}/>
                </div>
                <div className='border-2   rounded-lg p-3 hover:shadow-md text-center cursor-pointer'>
                    <label>Checkout :</label>
                    <input type='date' value={checkout} onChange={(e)=>{setCheckout(e.target.value)}}/>
                </div>
                <div className='border-2 space-x-2   rounded-lg p-3 hover:shadow-md text-center cursor-pointer'>
                    <label>num of geusts :</label>
                    <input type='Number' max={place.maxguests} min={0} className='border-2   rounded-lg p-1' value={num} onChange={(e)=>{setNum(e.target.value)}}/>
                </div>
                <div className='border-2 space-x-2   rounded-lg p-3 hover:shadow-md text-center cursor-pointer'>
                    <label>Full Name:</label>
                    <input type='text' className='border-2   rounded-lg p-1'value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <div className='border-2 space-x-2   rounded-lg p-3 hover:shadow-md text-center cursor-pointer'>
                    <label>Phone Number:</label>
                    <input type='tel' className='border-2   rounded-lg p-1' value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
                </div>
                <div>
                    <button className='w-full mx-auto border rounded-xl bg-[#FF5A5F] py-2 px-4 items-center hover:shadow-md text-white   flex justify-center my-2' onClick={(e)=>{
                        e.preventDefault() ; 
                        Submit()
                    }}>Apply</button>
                </div>
        </div>
        </div>
    
        </div>}
    </div>
  )
}

export default PlacePage