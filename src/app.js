import express from "express";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors())

app.use(express.json({limit : "16kb"}))        // put limit on data which is comming from forms
app.use(express.urlencoded({ extended : true , limit : "16kb"}))        //  encode comming url (+ & %, etc) 
app.use(express.static("Public"))
app.use(cookieParser())


export {app} 