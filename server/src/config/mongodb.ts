import mongoose from "mongoose";


const connectDB = async ()=>{
   
    mongoose.connection.on('connected', ()=>console.log("Database connected"))

    await mongoose.connect("mongodb+srv://aditya:5QoZaHnDA3Pv6ltW@cluster0.qqyta.mongodb.net/mernAuth")




}

export default connectDB