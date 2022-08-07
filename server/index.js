// import fetch from 'node-fetch';
const axios = require('axios')
const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3');


//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({origin: "http://localhost:3000"}));
require('dotenv').config();
app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
    next();
});

//DATABASE
const db = new sqlite3.Database('./user.db', (err) => {
   if (err) {
            console.log("Getting error " + err);
    }else{
        console.log("Connected to database")
    }
});

//ROUTES

app.post('/signup', (req, res)=>{
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const country = req.body.country;

    db.all('SELECT EMAIL FROM USER WHERE EMAIL = ?', [email], (err, row)=>{
        if(row.length > 0){
            return res.send({message: "You already have an account. Please Sign in"})
        }else if(row.length <= 0){
            db.run('INSERT INTO USER(FIRSTNAME, LASTNAME, EMAIL, PASSWORD, COUNTRY) VALUES(?, ?, ?, ?, ?)', [firstname, lastname, email, password, country ], (err)=> {
                if(err){
                    return res.send({result: 0, message: "Error while creating your record. Please try again"});
                }else{
                    return res.send({result: 1, message:"Successfully Created", userID: email, country: country});
                }
            })
        }else{
            console.log(err);
            return res.send({result: 0, message: "Please try again"});
        }
    })
});
app.post("/login", (req, res)=>{
    const email = req.body.email;
    db.all('SELECT PASSWORD, COUNTRY FROM USER WHERE EMAIL = ?', [email], (err, row)=>{
        if(err){
            return res.send({result: 0, message: "An Error Occured. Please try again"});
        }else if(row.length > 0){
            return res.send({result: 1, password: row[0].PASSWORD, country: row[0].country })
        }else{
            return res.send({ message: "You don't have account" })
        }
    })
});
app.post("/getUser", (req, res)=> {
    const userID = req.body.userID;
    db.all('SELECT FIRSTNAME, LASTNAME FROM USER WHERE EMAIL = ?', [userID], (err, row)=>{
        if(err){
            return res.send({result: 0, message: "An Error Occured. Please try again"});
        }else if(row.length > 0){
            return res.send({result: 1, firstName: row[0].FIRSTNAME, lastName: row[0].LASTNAME  })
        }
    })
})


/**PORT CREATION **/
app.disable('X-Powered-By');
app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
    console.log("The server is running at port ", app.get('port'));
});
