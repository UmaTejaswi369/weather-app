import express from "express";
import  connectDB from './config/db.js'
import cors from 'cors'
import dotenv from 'dotenv'
import WeatherRouter from "./Routers/Routers.js";
const app=express()
import bodyParser from "body-parser";

dotenv.config()
connectDB();


app.use(cors({ origin: "http://localhost:5173" })); // Change to your frontend URL
app.use(express.json());  // ✅ Use this to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.json())
app.use('/api/weather',WeatherRouter)

const PORT=5000;
app.listen(PORT,()=> {
console.log("server is running!")
})