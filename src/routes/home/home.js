import React, { useState} from 'react';
import Header from '../../components/Header/Header';
import './home.css';

import { useNavigate, Link } from "react-router-dom";
import thunderImage from  '../../assets/thunderstorm_weatherinfo.jpg'


export default function Home() {


  return <div className='Home'>
    <Header />
    <div className='Home__Body'>
        <div className='container'>
          <div className='row'>
        
            <div className="col-lg-6 col-md-6 col-sm-12">
            <img src={thunderImage} alt={thunderImage} />
            </div> 
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className='content'>
              <h2>Welcome to Weather Info</h2>
              <p>Find the current weather condition of any place on planet earth, by searching the name of the place.</p>
              <p>Create an account today. <Link to="/signup">Sign up</Link> and discover more <Link to="/weatherinfo">weather information</Link></p>
              </div>
            </div> 
          </div>
        </div>
    </div>
  </div>
}