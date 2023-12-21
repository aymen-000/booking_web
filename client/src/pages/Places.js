import { Link, useParams } from 'react-router-dom'
import { IoAdd } from "react-icons/io5"
import NewPlace from './NewPlace'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { compareSync } from 'bcryptjs'
function Places() {
    const {action} = useParams()
    const [places , setPlaces] = useState([])
    useEffect(()=>{
        axios.get('/showplaces').then((result)=>{
            setPlaces([...result.data])
        }).catch((err)=>{
            console.log('somrthing happened')
        })
    },[])
  return (
    <div>
        {
            action !="new" && <div><div className='flex justify-center '>
                <Link to="/acount/accom/new" className='border rounded-xl bg-[#FF5A5F] py-2 px-4 items-center hover:shadow-md text-white w-1/3 flex justify-center text-center gap-2' >
                    <IoAdd className='text-white'/>
                    <div>Add New Place</div> 
                </Link>
            </div>
            <div className='  px-6 py-4 space-y-3'>
                {places.length > 0 && places.map((place)=>{
                    
                    return <div> <Link to={"/acount/new/" + place._id}>
                    <div className='flex space-x-4 bg-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md max-sm:flex-col justify-center items-center '>
                        <div className='w-32 h-32 bg-gray-300 grow shrink-0 items-center flex align-middle'>
                            { place.bg[0] == undefined ? <div className='w-fit h-fit'></div> : <img src={"http://localhost:5000/" + place.bg[0]}/> }
                        </div>
                        <div className='flex-col items-center'>
                            <h2 className='text-black text-2xl'>{place.title}</h2>
                            <p className='text-gray-500'>{place.description}</p>
                        </div>
                    </div>
                    </Link></div>
                })}
            </div>
            </div>
        }
        {
            action == "new" && <NewPlace/>
        }

    </div>
  )
}

export default Places