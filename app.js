const mysql = require('mysql');
const express = require('express');
const multer = require("multer");
const e = require('express');
const async = require("async");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const ERROR_STATUS_CODE=500;
let lastInsertedRId=-1;
let lastInsertedPId=-1;
let successful=true;
app.use(express.static("public"));
app.use(multer().none());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const con = mysql.createConnection({
    host: "bunnyshelter.coc0mg7ngmna.us-east-2.rds.amazonaws.com",
    user: "Nullpointers",
    password: "Nullpointers69420",
    database: "Austin_Bunny_Shelter" // Add database name here
});  

insertRabbitTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO RABBIT(R_ID, RABBIT_NAME, DATE_OF_BIRTH, RABBIT_STATUS, SEX, BREED) VALUES (NULL, '${req.body.RName}', '${req.body.dob}', '${req.body.rStat}', '${req.body.sex}', '${req.body.breed}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            console.log(result);
            lastInsertedRId=result.insertId;
            return resolve(result);
        });
    });
};
insertMyStuffTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO MYSTUFF(R_ID, NOTES, Kibble, Carrier, Medication, Treats, Blankets, Toys, Drop_off_Date, Pick_up_Date) VALUES ('${lastInsertedRId}', '${req.body.notes}', '${req.body.kibble}', '${req.body.carrier}', '${req.body.medic}', '${req.body.treats}', '${req.body.blankets}', '${req.body.toys}', '${req.body.dropD}', '${req.body.picKD}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};
insertBoarderTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO BOARDER(R_ID, Brought_my_Food, Need_Grooming, Stuff_I_like, Drop_off_Date, Pick_up_Date) VALUES (${lastInsertedRId}, '${req.body.hasFood}', '${req.body.needGroom}', '${req.body.likedStuff}', '${req.body.dropD}', '${req.body.picKD}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};
insertCustomerTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO CUSTOMER(C_ID, Fname, Mname, Lname, Email, HomePhone, MobilePhone, WorkPhone, EmergencyContact) VALUES (NULL, '${req.body.Fname}', '${req.body.Mname}', '${req.body.Lname}', '${req.body.email}', '${req.body.homeP}', '${req.body.WorkP}', '${req.body.mobileP}', '${req.body.emergencyC}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            lastInsertedPId=result.insertId;
            return resolve(result);
        });
    });
};
insertAddressTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO ADDRESS(PERSON_ID, Street, City, USState, Zip) VALUES (${lastInsertedPId}, '${req.body.street}', '${req.body.city}', '${req.body.state}', '${req.body.zip}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        });
    });
};
insertVetTable = (req) =>{
    return new Promise((resolve, reject)=>{
        con.query(`INSERT INTO VETERINARIAN (DR_ID, C_ID, Name, Phone) VALUES (NULL, ${lastInsertedPId}, '${req.body.Vname}', '${req.body.VPhone}')`, (err, result)=>{
            if(err){
                return reject(err);
            }
            lastInsertedPId=result.insertId;
            return resolve(result);
        });
    });
};
app.post("/UpdateTable", async function(req, res){
    try{
        const promise1=await insertRabbitTable(req);
        const promise2=await insertMyStuffTable(req);
        const promise3=await insertBoarderTable(req);
        const promise4=await insertCustomerTable(req);
        const promise5=await insertAddressTable(req);
        const promise6=await insertVetTable(req);
        res.status(200).send({
            success: true});
    }
    catch(error){
        console.log(error);
        res.status(ERROR_STATUS_CODE).send("Server side error");
    }

});
RabbitwithDropDGetter = (req) =>{
    return new Promise((resolve, reject)=>{
        let dropofdate=req.query.dropD;
        con.query('SELECT Rabbit_Name FROM RABBIT, BOARDER WHERE BOARDER.R_ID=RABBIT.R_ID AND Drop_off_Date = '+mysql.escape(dropofdate), (err, result)=>{
            if (err){
                console.log(err);
                return reject(err);
            }
            else{
                console.log(result);
                return resolve(result);
            }
        });
    });
};
app.get("/getRabbitsWithDropD", async function (req, res){
    try{
        console.log("reached");
        console.log(req.query.dropD);
        const resultElements= await RabbitwithDropDGetter(req);
        console.log("hereaswell");
        res.status(200).send(resultElements);
        console.log(resultElements);
    }
    catch(err){
        res.status(ERROR_STATUS_CODE).send("Server side error");
    }
});
app.get("/getRabbitsWithPickD", (req, res) => {
    let pickofdate=req.query.pickD;
    let qry='SELECT Rabbit_Name FROM RABBIT, BOARDER INNNER JOIN RABBIT ON BOARDER.R_ID=RABBIT.R_ID WHERE Drop_off_Date = ?';
    con.connect(function(err) {
        con.query(qry, [pickofdate], function(err, result, fields) {
            if (err) res.send(err);
        });
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
