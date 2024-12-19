import React, { Children, useEffect, useState } from 'react'
import './video.css'
import { CopyToClipboard } from "react-copy-to-clipboard"

import { useContext } from 'react'

import { socketProvider } from '../context'
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import Notification from './notification'

function StreamVideo() {


  const { id, callAccepted, name, callEnded, callUser, setName, call, videoStream, userStream, getAudio, getVideo, leaveCall,activateAudioVideo } = useContext(socketProvider);
  const [idtoCall,setIdToCall] = useState('');

  useEffect(()=>{
    activateAudioVideo();
    setName(localStorage.getItem('userName'));
  },[])
  return (
    <div className='w-full h-screen flex flex-col gap-[20px]'>
      <div className='flex justify-between m-2 items-center text-white'>
        <div>
        <h2 className='text-[40px]'>Visual<span className='text-[#FF8F00]'>Talk's</span></h2>
        <h2 className='text-base'>Hello, <span className='text-[#FF8F00]'> { name || 'User'}</span></h2>
          </div>
        
      <Notification />
      </div>

     

      <div className='flex justify-center gap-[40px]'>
        {
          <div>
            {callAccepted && <h2 className='text-white'>You</h2>}
            <video playsInline  ref={videoStream} autoPlay className='myvideo shadow-lg shadow-[#FF8F00]' />
          </div>
        }


        {
          userStream && callAccepted && !callEnded &&
          <div>
            <h2 className='text-white'>{call.name || "Anonymous"} </h2>
            <video playsInline ref={userStream} autoPlay className='myvideo shadow-lg shadow-white' />
          </div>
        }

      </div>

      <div className='flex justify-center gap-[20px]'>
        {
          getAudio ?  <button className='bg-white rounded-full p-0  flex w-[60px] h-[60px] justify-center items-center text-[#FF8F00]' onClick={() => activateAudioVideo("audio")}><IoMdMic className='size-[30px]' /></button> :
           <button className='bg-red-600 rounded-full p-0 text-black flex w-[60px] h-[60px] justify-center items-center'  onClick={() => activateAudioVideo("audio")}><IoMdMicOff className='size-[30px]' /></button> 
          
            
        }
        {
          getVideo ?  <button className='bg-white rounded-full p-0 text-[#FF8F00] flex w-[60px] h-[60px] justify-center items-center' onClick={() => activateAudioVideo("video")}><IoVideocam className='size-[30px]' /></button> :
           <button className='bg-red-600 rounded-full  p-0 text-black flex w-[60px] h-[60px] justify-center items-center' onClick={() => activateAudioVideo("video")}><IoVideocamOff className='size-[30px]' /></button> 
            
        }
        {
          callAccepted && !callEnded &&
          <button className='bg-red-600 rounded-full p-0 text-black flex w-[60px] h-[60px] justify-center items-center' onClick={leaveCall}><MdCallEnd className='size-[30px]' /></button>
        }
        <CopyToClipboard text={id}>
          <a className='w-[60px] h-[60px] rounded-full border cursor-pointer flex justify-center items-center'><span className='text-[#FF8F00] text-[12px] font-bold'>COPY ID</span></a>
        </CopyToClipboard>
      </div>
      <div className='flex justify-around align-middle gap-4'>
      {
         !callAccepted &&
          <div className='flex justify-center items-center gap-[20px]'>
        <input type='text' value={idtoCall} onChange={e=>setIdToCall(e.target.value)} placeholder='Enter ID' className='bg-[#0C0C0C] text-white text-[20px] border-white border-b-white border-b-2'/>
            
        <button className='bg-green-600 rounded-full  p-0 text-black flex w-[60px] h-[60px] justify-center items-center' onClick={()=>callUser(idtoCall)}><IoMdCall className='size-[30px]' /></button>
        </div>
      }

      </div>

      
    </div>

  )
}

export default StreamVideo