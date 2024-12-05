import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRouter from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
const app = express();

const PORT = process.env.PORT;
app.use(express.json());
app.use('/api/v1/auth', authRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Connect to MongoDB
  connectDB();
});


