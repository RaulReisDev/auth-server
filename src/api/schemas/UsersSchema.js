import mongoose from "mongoose";

let userSchema = mongoose.Schema({
    uuid: String,
    name: String,
    email: String,
    password: String
});

let Users = mongoose.model('Users', userSchema);

export default Users