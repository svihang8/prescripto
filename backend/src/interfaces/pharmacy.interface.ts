import mongoose from "mongoose";

interface IPharmacy extends mongoose.Document {
    name: string;
    address: string;
    email: string;
    password: string;
}

export default IPharmacy;