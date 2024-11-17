import mongoose from "mongoose";
const {Schema} = mongoose;

// Defining database model for single user/data
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    yoe:{
        type: String,
        required: true,
    },
    resumeTitle: {
        type: String,
    },
    currentLocation: {
        type: String,
        required: true,
    },
    postalAddress: {
        type: String,
        required: true,
    },
    currentEmployer: {
        type: String,
    },
    currentDesignation: {
        type: String,
    }
});

export const User = mongoose.model("User", userSchema);