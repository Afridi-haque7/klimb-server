import express from 'express';
import connectDB from './db/index';
import router from './routes/userRoutes';
import cors from 'cors';


const app = express();  // Declaring express app
const port = 5000;  // Mentioning port number
app.use(cors());    // Using cors middleware


connectDB();    // Connect backend to database

app.use('/', router);   // Defining api route

// Activating the server to listen on port 5000
app.listen(port, () => console.log(`Server is running at ${port}`));