import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import './weather.css';
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as ttmaps from "@tomtom-international/web-sdk-maps";
import instance from '../../axios'
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function Weather() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const mapElement = useRef();
  const [mapZoom, setMapZoom] = useState(7);
  const [map, setMap] = useState({});
  const [tempc, setTempC] = useState(null);
  const [tempf, setTempF] = useState(null)
  const [humidity, setHumidity] = useState(null);
  const [showtempC, setShowTempC] = useState(false);
  const [showtempF, setShowTempF] = useState(false);
  const [showHumdity, setShowHumdity] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const userID = window.localStorage.getItem("userID");
  const country = window.localStorage.getItem("country")

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
      axios({
        method: "get",
        headers: { "Content-Type": "application/json" },
        url: `http://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_weatherAPIKEY}&q=${country}`
      }).then(res => {
        setTempC(res.data.current.temp_c);
        setTempF(res.data.current.temp_f);
        setHumidity(res.data.current.humidity);
      }).catch(err => console.log(err))
      instance({
        method: "get",
        headers: { "Content-Type": "application/json" },
        url: `https://api.tomtom.com/search/2/geocode/${country}.json?key=${process.env.REACT_APP_tomtom__APIKey}&language=en-GB`
      }).then(res => {
        const geocode = []
        // for(let i = 0; i < res.data.results.length; i++){
        let row = {
          lat: res.data.results[0].position.lat,
          lon: res.data.results[0].position.lon,
          streetName: res.data.results[0].address.streetName,
          municipalitySubdivision: res.data.results[0].address.municipalitySubdivision,
          municipality: res.data.results[0].address.municipality,
          countrySubdivision: res.data.results[0].address.countrySubdivision,
          country: res.data.results[0].address.country,
          freeFormAddress: res.data.results[0].address.freeformAddress,
        }
        geocode.push(row);
        // }
        geocode.forEach((element, index) => {
          let map = ttmaps.map({
            key: `"${process.env.REACT_APP_tomtom__APIKey}"`,
            container: mapElement.current,
            center: [element.lon, element.lat],
            zoom: mapZoom
          });
          var marker = new ttmaps.Marker().setLngLat([element.lon, element.lat]).addTo(map);
          var popupOffsets = {
            top: [0, 0],
            bottom: [0, -70],
            'bottom-right': [0, -70],
            'bottom-left': [0, -70],
            left: [25, -35],
            right: [-25, -35]
          }
          var popup = new ttmaps.Popup({ offset: popupOffsets }).setHTML(element.freeFormAddress);
          marker.setPopup(popup).togglePopup();
          setMap(map);
          const date = new Date();
          const year = date.getFullYear();
          const day = date.getDate();
          const time = date.getTime();
          const rn = Math.floor((Math.random() * 100) + 1)

          const join = year + "" + day + "" + time + "" + rn;
          axios({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
              "name": `"${element.lat}_${join}"`,
              "type": "Feature",
              "geometry": {
                "radius": 75,
                "type": "Point",
                "shapeType": "Circle",
                "coordinates": [element.lon, element.lat]
              }
            },
            url: `https://api.tomtom.com/geofencing/1/projects/${process.env.REACT_APP_tomtom__ProjectID}/fence?key=${process.env.REACT_APP_tomtom__APIKey}&adminKey=${process.env.REACT_APP_tomtom__AdminKey}`
          }).then(res => {
            map.addLayer({
              'id': Math.random().toString(),
              'type': 'fill',
              'source': {
                'type': 'geojson',
                // data,
                'data': {
                  'type': res.data.type,
                  "geometry": {
                    "type": res.data.geometry.type,
                    "coordinates": [res.data.geometry.coordinates[0], res.data.geometry.coordinates[1]]
                  }
                },
              },
              'layout': {},
              'paint': {
                'fill-color': '#ff0000',
                'fill-opacity': 0.5
              }
            })
            map.setCenter([parseFloat(element.lon), parseFloat(element.lat)]);
          }).catch(err => console.log(err))
        })
      }).catch(err => {
        console.log(err)
      });
    } else {
      navigate("/login")
    }

  }, [])

  const searchCity = e => {
    e.preventDefault();
    if ((search.length === 0) || (search === " ")) {
      setMessage("Please enter a location.")
    } else {
      axios({
        method: "get",
        headers: { "Content-Type": "application/json" },
        url: `http://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_weatherAPIKEY}&q=${country}`
      }).then(res => {
        setTempC(res.data.current.temp_c);
        setTempF(res.data.current.temp_f);
        setHumidity(res.data.current.humidity);
      }).catch(err => console.log(err))
      instance({
        method: "get",
        headers: { "Content-Type": "application/json" },
        url: `https://api.tomtom.com/search/2/geocode/${country}.json?key=${process.env.REACT_APP_tomtom__APIKey}&language=en-GB`
      }).then(res => {
        const geocode = []
        // for(let i = 0; i < res.data.results.length; i++){
        let row = {
          lat: res.data.results[0].position.lat,
          lon: res.data.results[0].position.lon,
          streetName: res.data.results[0].address.streetName,
          municipalitySubdivision: res.data.results[0].address.municipalitySubdivision,
          municipality: res.data.results[0].address.municipality,
          countrySubdivision: res.data.results[0].address.countrySubdivision,
          country: res.data.results[0].address.country,
          freeFormAddress: res.data.results[0].address.freeformAddress,
        }
        geocode.push(row);
        // }
        geocode.forEach((element, index) => {
          let map = ttmaps.map({
            key: `"${process.env.REACT_APP_tomtom__APIKey}"`,
            container: mapElement.current,
            center: [element.lon, element.lat],
            zoom: mapZoom
          });
          var marker = new ttmaps.Marker().setLngLat([element.lon, element.lat]).addTo(map);
          var popupOffsets = {
            top: [0, 0],
            bottom: [0, -70],
            'bottom-right': [0, -70],
            'bottom-left': [0, -70],
            left: [25, -35],
            right: [-25, -35]
          }
          var popup = new ttmaps.Popup({ offset: popupOffsets }).setHTML(element.freeFormAddress);
          marker.setPopup(popup).togglePopup();
          setMap(map);
          const date = new Date();
          const year = date.getFullYear();
          const day = date.getDate();
          const time = date.getTime();
          const rn = Math.floor((Math.random() * 100) + 1)

          const join = year + "" + day + "" + time + "" + rn;
          axios({
            method: "post",
            headers: { "Content-Type": "application/json" },
            data: {
              "name": `"${element.lat}_${join}"`,
              "type": "Feature",
              "geometry": {
                "radius": 75,
                "type": "Point",
                "shapeType": "Circle",
                "coordinates": [element.lon, element.lat]
              }
            },
            url: `https://api.tomtom.com/geofencing/1/projects/${process.env.REACT_APP_tomtom__ProjectID}/fence?key=${process.env.REACT_APP_tomtom__APIKey}&adminKey=${process.env.REACT_APP_tomtom__AdminKey}`
          }).then(res => {
            map.addLayer({
              'id': Math.random().toString(),
              'type': 'fill',
              'source': {
                'type': 'geojson',
                // data,
                'data': {
                  'type': res.data.type,
                  "geometry": {
                    "type": res.data.geometry.type,
                    "coordinates": [res.data.geometry.coordinates[0], res.data.geometry.coordinates[1]]
                  }
                },
              },
              'layout': {},
              'paint': {
                'fill-color': '#ff0000',
                'fill-opacity': 0.5
              }
            })
            map.setCenter([parseFloat(element.lon), parseFloat(element.lat)]);
          }).catch(err => console.log(err))
        })
      }).catch(err => {
        console.log(err)
      });
    }

  }

  const draw = () => {
    map.addLayer({
      'id': Math.random().toString(),
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [-123.123779, 48.227039],  // contig. u.s.
              ]
            ]
          }
        }
      },
      'layout': {},
      'paint': {
        'fill-color': '#ff0000',
        'fill-opacity': 0.5
      }
    })
    map.setCenter([parseFloat(-123.123779), parseFloat(48.227039)]);
  };
  return <div className='Home'>
    <Header />
    <div className='Home__Body'>
      <div className='Home__Search'>
        <form className="Home__FormSearch">
          <input type="text" placeholder="Enter Name of City" onChange={e => setSearch(e.target.value)} required />
          <button onClick={searchCity}>Search</button>
        </form>
      </div>
      <p>{message}</p>
      <div className='Map'>
        <div className='conatiner'>
          <div className='row'>
            {/* {map.map((m, index)=> {   */}
            <div className={(mapElement === undefined) ? 'noDisplay' : 'section'}>
              <div className='temp'>
                <button onClick={() => {
                  setShowTempC(true);
                  setShowTempF(false);
                  setShowHumdity(false)
                }}>Temperature in (&#8451;)</button>
                {((showtempC === true) && (tempc !== null)) ? <div style={{ display: 'flex', maxWidth: 240 + 'px', zIndex: 100, flexDirection: "row" }}><div className="mapboxgl-popup-tip" style={{
                  alignSelf: "center",
                  borderBottom: "none",
                  borderTopColor: "#fff", transform: 'translate(10px'
                }}></div>
                  <div className='mapboxgl-popup-content'>{tempc}&#8451; </div></div> : ''}
              </div>
              <div className='temp'>
                <button onClick={() => {
                  setShowTempF(true);
                  setShowTempC(false);
                  setShowHumdity(false)
                }}>Temperature in (&#8457;)</button>
                <p>{((showtempF === true) && (tempf !== null)) ? <div style={{ display: 'flex', maxWidth: 240 + 'px', zIndex: 100, flexDirection: "row" }}><div className="mapboxgl-popup-tip" style={{
                  alignSelf: "center",
                  borderBottom: "none",
                  borderTopColor: "#fff", transform: 'translate(10px'
                }}></div>
                  <div className='mapboxgl-popup-content'>{tempc}&#8457; </div></div> : ''}</p>

              </div>
              <div className='temp'>
                <button onClick={() => {
                  setShowHumdity(true);
                  setShowTempF(false);
                  setShowTempC(false);
                }}>Humidity (%)</button>
                <p>{((showHumdity === true) && (humidity !== null)) ? <div style={{ display: 'flex', maxWidth: 240 + 'px', zIndex: 100, flexDirection: "row" }}><div className="mapboxgl-popup-tip" style={{
                  alignSelf: "center",
                  borderBottom: "none",
                  borderTopColor: "#fff", transform: 'translate(10px'
                }}></div>
                  <div className='mapboxgl-popup-content'>{humidity}%; </div></div> : ''}</p>
              </div>
            </div>
            <div className="col-12 mapDiv" ref={mapElement}>
            </div>
            {/*   })}  */}
          </div>
        </div>
      </div>
    </div>
  </div>
}