import '../dist/output.css'
import '../input.css'
import logo from '../images/logo.png'
import search from '../images/search.png'
import { BiSolidUserCircle } from "react-icons/bi"
import { FiMenu } from "react-icons/fi"
import { TfiWorld } from "react-icons/tfi"
import { Link } from 'react-router-dom'
import Login from '../pages/Login'
import { useContext } from 'react'
import { UserContext } from '../userContext'
function Header() {
  const {user, exist , setExist} = useContext(UserContext)
  return (
    <header className='h-fit'>
      <div className='flex p-5 pl-7 justify-between border-b-slate-300 border-b shadow-sm  items-center max-md:hidden'>
        <Link className='flex gap-x-2 text-center max-md:hidden' to={"/"}>
          <div className='max-lg:hidden'>
            <img src={logo} className='w-[30PX] max-lg:hidden' />
          </div>
          <div className="text-[#FF5A5F] font-extrabold text-2xl max-md:hidden ">Airbnc</div>
        </Link>
        <div className='flex gap-x-3 rounded-full shadow-md hover:shadow-lg border hover:cursor-pointer border-slate-300 p-2 px-5  max-md:hidden'>
          <div className='text-black  border-r-2 border-r-slate-300 pr-4 max-md:hidden'>Anywhere</div>
          <div className='text-black  border-r-2 border-r-slate-300 pr-4 max-md:hidden'>Any week</div>
          <div className='text-slate-500 max-sm:hidden'>add gueste</div>
          <div className='border rounded-2xl bg-[#f8545a]  opacity-80 text-white p-1 max-md:hidden'>
            <img src={search} className='w-[20PX] text-white max-md:hidden ' />
          </div>
        </div>
        <div className='flex gap-x-2'>
          <div className='text-black hover:border hover:rounded-3xl px-3 py-2  text-center hover:bg-zinc-100 cursor-pointer font-semibold max-md:hidden'>Airbnb your home </div>
          <div className='hover:border hover:rounded-3xl px-3 py-2  text-center hover:bg-zinc-100 cursor-pointer max-md:hidden'><TfiWorld className='text-2xl' /></div>
          <Link to = {exist ?"./acount" : "./login"} onClick={()=>{console.log(exist)}} className='flex gap-x-2 p-1 rounded-3xl  border px-2 hover:shadow-md cursor-pointer '>
            <BiSolidUserCircle className='text-3xl max-md:hidden ' />
            <FiMenu className='text-3xl max-md:hidden' />
            {!!user && (
              <div>
                {user.name}
              </div>
            )}
          </Link>
        </div>
      </div>
      <div className='flex gap-x-3 rounded-full shadow-md hover:shadow-lg border hover:cursor-pointer border-slate-300 p-2 px-5 flex-col md:hidden m-4  '>
        <div className=''>
          <div className='text-black font-semibold'>Any where</div>
        </div>
        <div className='flex gap-x-1'>
          <div className='text-slate-400 text-sm'>Any week .</div>
          <div className='text-slate-400 text-sm'>Add guests</div>
        </div>
      </div>
    </header>
  )
}

export default Header