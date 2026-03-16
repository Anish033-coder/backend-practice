import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors())

app.use(express.json({limit : "16kb"}))        // put limit on data which is comming from forms
app.use(express.urlencoded({ extended : true , limit : "16kb"}))        //  encode comming url (+ & %, etc) 
app.use(express.static("Public"))
app.use(cookieParser())


// routes import
import userRouter  from "./routes/user.routes.js";

// router declaration

app.use("/api/v1/users", userRouter)

export {app} 