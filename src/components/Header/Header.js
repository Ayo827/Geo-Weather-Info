import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom";
import './Header.css';
import instance from '../../axios'


export default function Header(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const userID = window.localStorage.getItem("userID");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (userID !== null) {
          instance({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: { userID: userID },
            url: "/getUser"
          }).then(res => {
            if (parseInt(res.data.result) === 0) {
              setMessage(res.data.message);
            } else {
              setUserName(res.data.firstName + ", " + res.data.lastName);
            }
          })
        
        } 
    
      }, [])
    const handleLogout = ()=>{
        window.localStorage.clear()
        navigate("/login")
      }
  
    return <div className='Header'>
            <span onClick={()=> window.location.replace("https://geo-weatherinfo.herokuapp.com/") }>Weather Info </span>
            {userID ?<div className='info'>
            <p>Welcome {userName}!</p>
            <button onClick={ handleLogout}>Log Out</button>
          </div>: ''}
    </div>
}