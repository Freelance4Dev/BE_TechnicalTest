import mongoose from "mongoose";


const UserActivitySchema = new mongoose.Schema({
    email: String,
    activity_name: String,
    activity_time: String
})

const UserActivitySchemaModel = mongoose.model("users_activities", UserActivitySchema);
export default UserActivitySchemaModel;