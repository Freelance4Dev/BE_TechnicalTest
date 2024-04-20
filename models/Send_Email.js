import mongoose from "mongoose";


const SendEmailSchema = new mongoose.Schema({
    date: String,
    email: String,
    decription: String
})

const SendEmailModel = mongoose.model("send_emails", SendEmailSchema);
export default SendEmailModel;