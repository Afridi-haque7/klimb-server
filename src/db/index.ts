import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);    // Getting database name from .env file instead of hardcoding it
        console.log('MongoDB connected!');
        
    } catch (error) {        
        console.log('MongoDB connection error: ' + error);
        process.exit(1);
        
    }
}

export default connectDB;