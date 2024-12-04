import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB Connected...');
    }catch(e){
        console.error(e);
        process.exit(1);
    }
}