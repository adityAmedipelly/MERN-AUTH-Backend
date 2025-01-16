import express from 'express';
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"


import connectDB from './config/mongodb';
import authRouter from './routes/AuthRoute'
import userRouter from './routes/userRoute';

const app = express();
const port = process.env.PORT || 4000
connectDB()



app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

// API Endpoints
app.get('/',(req,res)=>{})

app.use('/api/auth', authRouter)

app.use('/api/user', userRouter)




app.listen(port,()=>console.log(`Server started on PORT : ${port}`))