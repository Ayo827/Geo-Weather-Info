import React, { useState, useEffect } from 'react';
import './login.css';
import Header from '../../components/Header/Header';
import instance from '../../axios';
import bcrypt from 'bcryptjs';
import { useNavigate, Link } from "react-router-dom";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[message, setMessage] = useState("");
    const navigate = useNavigate();
    const userID = window.localStorage.getItem("userID");
    const [processing, setProcessing] = useState(false)

    useEffect(()=> {
        if(userID){
            navigate("/weatherinfo")
        }
    },[])

    const handleLogin = e => {
        e.preventDefault();
        setProcessing(true)
        instance({
            method: 'post',
            headers: { "Content-Type": "application/json" },
            data: { email: email},
            url: '/login'
        }).then(result=>{
            if(parseInt(result.data.result) === 0){
                setProcessing(false)
                setMessage(result.data.message);
            }else if(parseInt(result.data.result) === 1){
                bcrypt.compare(password.trimEnd(), result.data.password, (err, isMatch) => {
                    if(isMatch){
                        setProcessing(false)
                        window.localStorage.setItem("userID", email);
                        window.localStorage.setItem("country", result.data.country)
                        navigate("/weatherinfo");
                    }else{
                        setProcessing(false)
                        setMessage("Your Password is wrong");
                    }
                });
            }else{
                setProcessing(false);
                setMessage(result.data.message);
            }
        }).catch(err => {
            setProcessing(false)
            setMessage("An Error Occured. Please Try Again.");
        })

    }

    return <div className="Login">
    <Header />
        <div className='Login__container'>
            <p className='Login__para'>{message}</p>
            <form className='Login__Form' onSubmit={handleLogin}>
                <input type="email" placeholder="Enter Email" onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Enter Your Password" onChange={e => setPassword(e.target.value)} required />
                <button className={(processing === true)? 'disabled': 'active'}>{(processing === true)? 'Logging In': 'Login'}</button>
                <p>Don't have an account?<a href='http://geo-weatherinfo.herokuapp.com/signup'>Click to Signup</a></p>
            </form>
        </div>
    </div>
}