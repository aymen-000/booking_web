import React, { useEffect } from 'react'
import { MdCloudUpload } from "react-icons/md"
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../component/Spinner'
import { useContext } from 'react'
import { UserContext } from '../userContext'
import { redirect } from 'react-router-dom'
import { FaWifi } from "react-icons/fa"
import { MdOutlinePets } from "react-icons/md"
import { PiTelevisionSimpleBold } from "react-icons/pi"
import { FaRadio } from "react-icons/fa6"
import { MdOutlineLocalParking } from "react-icons/md"
import { MdOutlineDeleteForever } from "react-icons/md"
import { GrCheckboxSelected } from "react-icons/gr"
import { MdOutlineStarBorder } from "react-icons/md";

function NewPlace() {
    const {id} = useParams()
    console.log("id")
    console.log(id)
    const [price , setPrice] = useState(0)
    const [ selecteBg, setSelecteBg] = useState([])
    const {user} = useContext(UserContext)
    const [title, setTitle] = useState('')
    const [adress, setAdress] = useState('')
    const [description, setDescription] = useState('')
    const [wifiChecked, setWifiChecked] = useState(false)
    const [parkingChecked, setParkingChecked] = useState(false)
    const [tvChecked, setTvChecked] = useState(false)
    const [privateChecked, setPrivateChecked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [pets , setPets] = useState(false)
    const [radio , setRadio] = useState(false)
    const [images , setImages] = useState([])
    const [link , setLink ] = useState('')
    const [checkin , setCheckin] = useState('')
    const [checkout , setCheckout] = useState('')
    const [allChecked , setAllChecked] = useState([])
    const [max , setMax] = useState(0)
    const navigate = useNavigate()
    useEffect (()=>{
        if (id == undefined) {
            return
        }else {
            axios.get('/explace/'+ id ).then(({data})=>{
                setCheckin(data.checkin)
                setCheckout(data.checkout)
                setAdress(data.address)
                setImages(data.photos) 
                setPets(data.perks.includes('pets'))
                setWifiChecked(data.perks.includes('wifi'))
                setRadio(data.perks.includes('radio'))
                setTvChecked(data.perks.includes('tv'))
                setParkingChecked(data.perks.includes('parking'))
                setDescription(data.description)
                setTitle(data.title)
                setMax(data.maxguests)
                setPrice(data.price)
            }).catch((err)=>{
                console.log('somthing happend ')
            })

        }
    },[id])
    const handleChecked = (checked , name) => {
        console.log(checked)
        if (checked) {
            setAllChecked((prev)=>{
                return [...prev , name]
            })
        }else {
            setAllChecked((prev)=>{
                return [...prev.filter((item)=>{return item != name})]
            })
        }
    }
    console.log('list : ')
    console.log(allChecked)
    const handlePost = (e) => {
        setLoading(true)
        e.preventDefault()
        const data = {
            owner : user.userId,
            title : title, 
            address : adress,
            perks : allChecked,
            description : description,
            checkin : checkin , 
            checkout : checkout , 
            maxguests : max,
            photos : images ,
            bg  : selecteBg ,
            price : price ,
        }
        if (id) {
            axios.put('/place' , {id , ...data}).then((result)=>{
                console.log('updated')
                navigate('/acount/accom')
            }).catch((err)=>{
                console.log('err when try to update ')
            })
        }else {
            console.log('post a new data')
            axios.post('/place' , data).then((result) => {
                setLoading(false)
                console.log('donne')
                navigate('/acount/accom')
            }).catch((err) => {
                setLoading(false)
                console.log(err.message)
            })
        }

        //...............................post all the information ..............................//
    }
    const postImgByLink = (e)=>{
        e.preventDefault()
        setLoading(true)
        axios.post('/postImageByLink' , {link:link}).then(
            (result)=>{
                setLoading(false)
                setImages((prev)=>{
                    return [...prev ,  result.data]
                })
                console.log('images')
                console.log(images)
                setLink('')
            }
        ).catch(
            (err)=>{
                setLoading(false)
                console.log(err.message)
            }
        )
    }
    //...................update 
    const update = (e) =>{
        e.preventDefault()
    }
    //........................upload fieles ................//
    const uploadFiles =(e)=>{
        let data = new FormData()
        const filesname = e.target.files
        for(let i =0 ; i< filesname.length ; i++){
            data.append('photos',filesname[i])
        }
        axios.post('/upload' , data ,{headers : {"Content-Type" : "multipart/form-data"}}).then((result)=>{
            console.log('results')
            console.log(result.data)
            setImages((prev)=>{
                return [...prev ,...result.data]
            })
        }).catch((err)=>{ console.log('err'); console.log(err.message)})
    }
    const star = (item, bg)=>{
        if (item == bg ) {
            return "text-2xl cursor-pointer  relative bottom-[62px] rounded-xl bg-black opacity-75 left-[120px] text-red-600"
        }else {
            return "text-2xl cursor-pointer  relative bottom-[62px] rounded-xl bg-black opacity-75 left-[120px] text-white"
        }
    }
    console.log('selected : .................')
    console.log(selecteBg)
    return (
        <div>
            {
                loading ? <div className='h-screen items-center justify-center flex'><Spinner /></div> :
                    <form className='p-5 space-y-3' onSubmit={(e) => { handlePost(e) }}>
                        <h2 className='text-2xl font-bold  '>Tilte</h2>
                        <p className='text-slate-500'>Title for your place should be short and catchy sa an advertisement</p>
                        <input placeholder='title, for exemple:My lovely apt' value={title} onChange={(e) => { setTitle(e.target.value) }} className='border-2  rounded-xl p-2 w-full' />
                        <h2 className='text-2xl font-bold  '>Adress</h2>
                        <input placeholder='Adress' className='border-2  rounded-xl p-2 w-full' value={adress} onChange={(e) => { setAdress(e.target.value) }} />
                        <h2 className='text-2xl font-bold  '>Photos</h2>
                        <div className='flex'>
                            <input placeholder='Add photo link....jpg' className='border-2  rounded-xl p-2 w-full' value={link} onChange={(e)=>{setLink(e.target.value)}} />
                            <button onClick={(e)=>{postImgByLink(e)}} className='border rounded-xl bg-slate-400   py-2 px-2 items-center hover:shadow-md text-white w-1/3 flex justify-center text-center gap-2'>Add Photo</button>
                        </div>
                        <p className='text-gray-500'>check select to select it like a cover image </p>
                        <div className='flex space-x-2'>
                            
                            <div className="flex space-x-2 flex-wrap items-start">
                                {images.length>0 && images.map((item)=>{
                                    
                                      return <div className='rounded-xl  '><img src={"http://localhost:5000/"+ item} className='w-[150px] h-[150px] rounded-xl '/>
                                        <MdOutlineDeleteForever className='text-white text-2xl cursor-pointer relative bottom-[36px] rounded-xl bg-black opacity-75 left-[8px]' onClick={()=>{setImages((p)=>{return images.filter((img)=>{return img != item})})}}/>
                                        <MdOutlineStarBorder  className = {star(item , selecteBg)}  onClick={(e)=>{ setSelecteBg(item) } } />
                                    
                                      
                                      </div>


                                })}
                                <div >
                                <label className='flex px-4 space-x-2 py-6 bg-transparent border-2 rounded-lg items-center hover:shadow-md w-[150px] h-[150px]'>
                                <input type='file' multiple className='hidden' onChange={(e)=>{uploadFiles(e)}} />
                                <MdCloudUpload />
                                <div>Upload</div>
                                </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold  '>Description</h2>
                            <textarea className='border-2  rounded-xl p-2 w-full h-fit' disabled={false} value={description} onChange={(e) => { setDescription(e.target.value) }}></textarea>
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold '>Perks</h2>
                            <p className='text-slate-500'>select all the perks of your place</p>
                            <div className='my-4 grid grid-cols-3 max-md:grid-cols-2 gap-4'>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md items-center'>
                                    <input type='checkbox' name='wifi' value={wifiChecked} checked={wifiChecked} onChange={(e) => { setWifiChecked(!wifiChecked) ; handleChecked(e.target.checked , e.target.name)}}  />
                                    <FaWifi />
                                    <span>Wifi</span>
                                </div>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md items-center'>
                                    <input type='checkbox' name='parking' value={parkingChecked} checked={parkingChecked} onChange={(e) => { setParkingChecked(!parkingChecked) ; handleChecked(e.target.checked , e.target.name) }} />
                                    <MdOutlineLocalParking/>
                                    <span>Free Parking</span>
                                </div>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md items-center'>
                                    <input type='checkbox' name='tv' value={tvChecked} checked={tvChecked} onChange={(e) => { setTvChecked(!tvChecked) ; handleChecked(e.target.checked , e.target.name) }} />
                                    <PiTelevisionSimpleBold/>
                                    <span>Tv</span>
                                </div>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md'>
                                    <input type='checkbox' name='Private' checked={privateChecked} value={privateChecked} onChange={(e) => { setPrivateChecked(!privateChecked) ; handleChecked(e.target.checked,e.target.name) }} />
                                    <span>Private Entrance</span>
                                </div>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md items-center'>
                                    <input type='checkbox' name='pets' value={pets} checked={pets} onChange={(e) => { setPets(!pets) ; handleChecked(e.target.checked,e.target.name)}} />
                                    <MdOutlinePets/>
                                    <span>Pets</span>
                                </div>
                                <div className='flex space-x-2 border border-slate-200 rounded-lg p-4 hover:shadow-md items-center'>
                                    <input type='checkbox' name='radio' value={radio} checked={radio} onChange={(e) => {setRadio(!radio); handleChecked(e.target.checked, e.target.name) }} />
                                    <FaRadio/>
                                    <span>radio</span>
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <h1 className='text-2xl font-bold'>Check in&out times</h1>
                                <p className='text-slate-500'>add check in and out times , remeber there is time to cleaning rooms</p>
                                <div className='grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-2 gap-2 '>
                                    <div className='space-y-2'>
                                        <h4 className='text-1xl font-bold'> Check in</h4>
                                        <input placeholder='14:00' className='border-2  rounded-xl p-2 ' value={checkin}  onChange={(e)=>{setCheckin(e.target.value) }}/>
                                    </div>
                                    <div className='space-y-2'>
                                        <h4 className='text-1xl font-bold'>Check out</h4>
                                        <input placeholder='14:00' className='border-2  rounded-xl p-2 'value={checkout}  onChange={(e)=>{setCheckout(e.target.value)}} />
                                    </div>
                                    <div className='space-y-2'>
                                        <h4 className='text-1xl font-bold'>Max number</h4>
                                        <input placeholder='9' type='number' min={0} className='border-2  rounded-xl p-2 'value={max}  onChange={(e)=>{setMax(e.target.value)}} />
                                    </div>
                                    <div className='space-y-2'>
                                        <h4 className='text-1xl font-bold'>Price</h4>
                                        <input placeholder='9' type='number' min={0} className='border-2  rounded-xl p-2 'value={price}  onChange={(e)=>{setPrice(e.target.value)}} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center my-4'>
                                <button className='border rounded-xl bg-[#FF5A5F] py-2 px-4 items-center hover:shadow-md text-white w-2/3 max-md:w-full flex justify-center'>Save</button>
                            </div>
                        </div>
                    </form>}
        </div>
    )
}

export default NewPlace