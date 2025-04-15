import mongoose from "mongoose";

interface IPatient extends mongoose.Document {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    password: string;
}

export default IPatient;