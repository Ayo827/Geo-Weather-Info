import React, { useState, useEffect } from 'react'
import './signup.css'
import Header from '../../components/Header/Header';
import instance from '../../axios';
import bcrypt from 'bcryptjs';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';


const salt = bcrypt.genSaltSync(10)

export default function Signup() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(" ");
    const [message, setMessage] = useState("");
    const [countries, setCountries] = useState([])
    const[ country, setCountry] = useState("");
    const [processing, setProcessing] = useState(false)
    const navigate = useNavigate();
    const userID = window.localStorage.getItem("userID");

    
    useEffect(()=> {
        if(userID){
            navigate("/weatherinfo")
        }
        axios({
            method: "get",
            headers: { "Content-Type": "application/json" },
            url: "http://api.countrylayer.com/v2/all?access_key=caf344a07f5d21404a781b8982bcc9eb",
            timeout: 0
        }).then(res => {
            setCountries(res.data);
        }).catch(err => {
            console.log(err)
        })
    },[])
    const handlesignup = e => {
        const hashedPassword = bcrypt.hashSync(password.trim(), salt, '$2a$10$CwTycUXWue0Thq9StjUM0u')
        e.preventDefault();
        setProcessing(true)
            instance({
                method: 'post',
                headers: { "Content-Type": "application/json" },
                data: {firstname: firstName, email: email, lastname: lastName, password: hashedPassword, country: country},
                url: '/signup'
            }).then(result=>{
                if(parseInt(result.data.result) === 0){
                    setProcessing(false);
                    setMessage(result.data.message);
                }else if(parseInt(result.data.result) === 1){
                    setProcessing(false);
                    setMessage(result.data.message);
            
                    window.location.replace("https://geo-weatherinfo.herokuapp.com/login")
                }else{
                    setProcessing(false);
                    setMessage(result.data.message);
                }
            }).catch(err => {
                setProcessing(false);
                setMessage("An Error Occured. Please Try Again.");
            })
    }

    return <div className="Signup">
    <Header />
        <div className='Signup__container'>
            <p className='Signup__para'>Create an Account</p>
            <p>{message}</p>
            <form className='Signup__Form' onSubmit={handlesignup}>
                <input type="text" placeholder="Enter Your First Name" onChange={e => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Enter Your Last Name" onChange={e => setLastName(e.target.value)} required />
                <input type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <select value={country} onChange={e => setCountry(e.target.value)} required>
                {countries.map((country, index)=> {
                    return <option value={country.name} key={index}>{country.name}</option>
                })}
                </select>
                <input type="password" placeholder="Enter Your Password" onChange={e => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} required />
                {(password !== confirmPassword)? <span style={{color: "red"}}>Your Password is not the same</span>:  <button style={(password !== confirmPassword)? {cursor: 'not-allowed', opacity:0.3}: {cursor: 'pointer', opacity: 1}} className={(processing === true)? 'disabled': 'active'}>{(processing === true)?'Creating Your Account' : 'Create Account'}</button>}
               
                <p>Already have an account?<a href='https://geo-weatherinfo.herokuapp.com/login'>Click to Login</a></p>
            </form>
        </div>
    </div>
}