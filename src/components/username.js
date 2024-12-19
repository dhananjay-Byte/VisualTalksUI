import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { socketProvider } from '../context'

function Username() {
  const {setName, videoStream} = useContext(socketProvider);

  const username = (e)=>{
    localStorage.setItem('userName',e.target.value)
  }

  useEffect(()=>{
    if(localStorage.getItem('userName')){
      localStorage.removeItem('userName');
    }

  },[])
  return (
    <div className=' h-screen flex justify-center items-center'>
      <div className='border text-white h-max flex flex-col gap-5 justify-center items-center p-[80px] rounded-lg shadow-md shadow-white'>
        <h2>Visual<span className='text-[#FF8F00]'>Talk's</span></h2>
        <div className='flex items-center gap-[20px]'>
          <input type='text' placeholder='Enter your Username' onChange={(e)=>username(e)} className='bg-[#0C0C0C] text-white text-[25px] border-white border-b-white border-b-2' />
          <Link to='/lobby'><button className='text-[#FF8F00]'>Enter</button></Link>

        </div>
        <h2>or</h2>
        <Link to='/lobby'><button className='w-max'>Enter <span className='text-[#FF8F00]'>Anonymously</span></button></Link>

      </div>
    </div>

  )
}

export default Username