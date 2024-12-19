import React, { useContext, useEffect, useState } from 'react'

import { socketProvider } from '../context'
import './notification.css'
import { MdCallEnd } from "react-icons/md";
import { IoMdCall } from "react-icons/io";

function Notification() {
  const { answerCall, call, callAccepted } = useContext(socketProvider);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Trigger the animation after the component mounts
    setActive(true);
  }, []);

  return (
    <div>
      {call.callReceived && !callAccepted && (
        <div className='border text-white flex flex-col gap-5 justify-center items-center p-[10px] rounded-lg shadow-sm shadow-white'>
          <h2 className='text-2xl text-white'> <span className='text-[#FF8F00]'>{call.name || "Anonymous User"}</span> is Calling:</h2>
          <div className='flex justify-center align-middle gap-3'>
            <button className='bg-green-600 rounded-full  p-0 text-black flex w-[30px] h-[30px] justify-center items-center' onClick={answerCall}><IoMdCall className='size-[20px]' /></button>
            <button className='bg-red-600 rounded-full p-0 text-black flex w-[30px] h-[30px] justify-center items-center' onClick={null}><MdCallEnd className='size-[20px]' /></button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Notification