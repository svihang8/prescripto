import mongoose from "mongoose";

interface IDoctor extends mongoose.Document {
    firstName: string;
    lastName: string;
    specialization: string;
    email: string;
    password: string;
}

export default IDoctor;