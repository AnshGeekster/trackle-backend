import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js'
import userRoutes from  './routes/user.route.js'
import ticketRoutes from './routes/ticket.route.js'


const app = express();


const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: ['http://localhost:3000', "production-url"], // Allow specific origins
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE','OPTIONS'], 
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, 
};


app.use(cors(corsOptions));
app.use(express.json()) 
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 


app.options("*", cors()); // Allow all OPTIONS preflight requests


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/ticket',ticketRoutes)



app.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`);

})