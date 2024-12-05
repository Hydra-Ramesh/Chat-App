import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import { connectDB } from './lib/db.js';
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/message', messageRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Connect to MongoDB
  connectDB();
});


