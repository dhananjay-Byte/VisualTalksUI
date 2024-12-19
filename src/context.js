import React from "react";

import { createContext,useState,useRef,useEffect } from "react";

import {io} from "socket.io-client";

import Peer from 'simple-peer'

const socketProvider = createContext();

const socket = io('https://videochatbackend-vkib.onrender.com')

const ContextProvider = ({children})=>{

    const [stream,setStream] = useState(null);
    const [id,setId] = useState('');
    const [call,setCall] = useState({});
    const [callAccepted, setCallAccpeted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name,setName] = useState('')     
    const [getAudio,setGetAudio] = useState(true);
    const [getVideo,setGetVideo] = useState(true);

    const videoStream = useRef();
    const userStream = useRef();
    const connectionRef = useRef();
    
    const userID = (id)=>{
        setId(id);
    }

    const activateAudioVideo = (type) => {
        if (!stream) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    if (videoStream.current) {
                        videoStream.current.srcObject = currentStream;
                    }
                    toggleMedia(type, currentStream); // Apply initial toggle
                    muteOwnAudio(currentStream); // Mute the local audio playback
                })
                .catch((error) => {
                    setGetAudio(false);
                    setGetVideo(false);
                    console.error("Error accessing media devices:", error);
                });
        } else {
            toggleMedia(type, stream); // Toggle existing stream
            muteOwnAudio(stream); // Mute the local audio playback
        }
    };
    
    const toggleMedia = (type, currentStream) => {
        if (type === "audio") {
            const isAudioEnabled = !getAudio;
            currentStream.getAudioTracks().forEach(track => track.enabled = isAudioEnabled);
            setGetAudio(isAudioEnabled);
        } else if (type === "video") {
            const isVideoEnabled = !getVideo;
            currentStream.getVideoTracks().forEach(track => track.enabled = isVideoEnabled);
            setGetVideo(isVideoEnabled);
        }
    };
    
    // Function to mute your own audio playback
    const muteOwnAudio = (currentStream) => {
        const audioTrack = currentStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = true; // Make sure the track is enabled
            audioTrack.onended = () => {
                // To handle cases when the microphone is disconnected
                setGetAudio(false); // Update state to reflect that audio is turned off
            };
        }
        if (videoStream.current) {
            videoStream.current.muted = true; // This will mute your own audio in the video element
        }
    };
        


    useEffect(()=>{ 

        
        socket.on("me",userID);

        socket.on("calluser",({from,name,signal})=>{
            setCall({callReceived:true,from,name,signal})
        })

        return()=>{
            socket.off("me",userID);
        }

    },[])


    useEffect(()=>{
        socket.on("refreshClient",()=>{
            window.location.reload()
        })
    },[])


    const callUser = (userid)=>{
        const peer = new Peer({initiator:true,trickle:false,stream});

        peer.on("signal",(data)=>{
            socket.emit("calluser",{userToCall:userid,signalData:data,from:id,name})
            })

        peer.on("stream",(currenStream)=>{
                userStream.current.srcObject = currenStream
            })
        socket.on("callaccepted",(signal,username)=>{
            setCallAccpeted(true);
            call.name = username;
            peer.signal(signal);
        })

        connectionRef.current = peer;
    }

    const answerCall = ()=>{
        setCallAccpeted(true);

        const peer = new Peer({initiator:false,trickle:false,stream});

        peer.on("signal",(data)=>{
                socket.emit("answercall",{signal:data,to:call.from,name})
        })

        peer.on("stream",(currenStream)=>{
            userStream.current.srcObject = currenStream
        })

        peer.signal(call.signal);

      
        connectionRef.current = peer;
        
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current?.destroy();
        socket.emit("refresh");
        window.location.reload();
    };

    return(
        <socketProvider.Provider value={{
            call,
            callAccepted,
            callEnded,
            id,
            videoStream,
            userStream,
            callUser,
            answerCall,
            leaveCall,
            name,
            setName,
            stream,
            getAudio,
            getVideo,
            activateAudioVideo
        }}>
            {children}
        </socketProvider.Provider>
    )
}

export {ContextProvider,socketProvider}