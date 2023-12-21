import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Spinner from '../component/Spinner'
import Error from '../component/Error'
import { compareSync } from 'bcryptjs'
import { CiStar } from "react-icons/ci"
import { Link, useNavigate } from 'react-router-dom'

function Index() {
  const [loading , setLoading] = useState(true)
  const [err ,setErr] = useState(false)
  const navigate = useNavigate()
  const [allPalces , setAllPlaces] = useState([])
  const [love , setLove] = useState(false)
  const [cliked ,setClicked] = useState(false)
  const starAdd = (id, liked)=>{
    setLove(liked)
    console.log('loved is : ' + love)
    axios.put('/starAdd' , { liked ,  id}).then((result)=>{
      console.log("done")
      axios.get('/allPlaces' ).then((result)=>{
        setLoading(false)
        setAllPlaces([...result.data])
      }).catch((err)=>{
        setLoading(false)
        setErr(true)
      })

    }).catch((err)=>{
      console.log('err')
    })

  }
  useEffect(()=>{ 
    axios.get('/allPlaces' ).then((result)=>{
      setLoading(false)
      setAllPlaces([...result.data])
    }).catch((err)=>{
      setLoading(false)
      setErr(true)
    })
  }, [])
  return (
    <div className='grid grid-cols-4 p-6 max-sm:grid-cols-1 max-xl:grid-cols-3 max-md:grid-cols-2 gap-4 items-center'>
       {
          loading == true ? <Spinner/> : 
          err == true ? <Error/> : 
          allPalces.length > 0 && allPalces.map((item)=>{
            return <Link to={"/placepage/" + item._id} className='mx-auto cursor-pointer' >
              <div >
                { item.bg.length ==0 ? <img className='max-sm:w-[70vw] max-sm:h-[300px]  max-xl:h-[30vw]  max-md:w-[45vw]  w-[45vw]   h-[300px] rounded-xl' src={"http://localhost:5000/" + item.photos[0]}/> : <img src={"http://localhost:5000/" + item.bg[0]} className='max-sm:w-[70vw] max-sm:h-[300px]  max-xl:h-[30vw]  max-md:w-[45vw]  w-[45vw]   h-[300px] rounded-xl'/> }
              </div>
              <div className='flex justify-between items-center'>
                <div>
                  <div className=''>
                    <h2 className='text-black text-xl font-bold'>{item.title}</h2>
                  </div>
                  <div className=''>
                    <p className='text-gray-600 '> {item.address} </p>
                  </div>
                  <div className='text-gray-600'>
                    <p>{item.price}$ night</p>
                  </div>
                </div>
                <div className='p-5'>
                  {console.log(item._id)}
                  <CiStar   onClick={(e)=>{setClicked(!cliked) ; starAdd(item._id, !item.liked)}} className={item.liked ? "text-3xl text-red-600 bg-black rounded-xl p-1" : "text-3xl bg-black rounded-xl p-1 text-white"}/>
                </div>
              </div>
              </Link>
          })
        }
    </div>
  )
}

export default Index