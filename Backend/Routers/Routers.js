import express from "express";
import { fetchWeather,fetchData,dataDelete ,dataUpdate, cityFetch} from "./Controllers/weatherController.js";
const WeatherRouter=express.Router()

WeatherRouter.post('/fetch-weather',fetchWeather);
WeatherRouter.get('/cities',fetchData)

WeatherRouter.post('/update/:id',dataUpdate)

WeatherRouter.delete('/delete/:id',dataDelete)
WeatherRouter.get('/city/:id',cityFetch)
export default WeatherRouter
