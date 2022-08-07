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

    useEffect(()=> {
        if(userID){
            navigate("/weatherinfo")
        }
    },[])

    const handleLogin = e => {
        e.preventDefault();
        instance({
            method: 'post',
            headers: { "Content-Type": "application/json" },
            data: { email: email},
            url: '/login'
        }).then(result=>{
            if(parseInt(result.data.result) === 0){
                setMessage(result.data.message);
            }else if(parseInt(result.data.result) === 1){
                bcrypt.compare(password.trimEnd(), result.data.password, (err, isMatch) => {
                    if(isMatch){
                        console.log(result.data.country)
                        window.localStorage.setItem("userID", email);
                        window.localStorage.setItem("country", result.data.country)
                        navigate("/");
                    }else{
                        setMessage("Your Password is wrong");
                    }
                });
            }else{
                setMessage(result.data.message);
            }
        }).catch(err => {
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
                <button>Login</button>
                <p>Don't have an account?<Link to='/signup'>Click to Signup</Link></p>
            </form>
        </div>
    </div>
}