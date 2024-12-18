const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true,
    },
    password :{
        type:String,
        required:true,
    },
    role :{
        type:String,
        required:true,
    },
})

const Login = new mongoose.model("Login" ,userSchema );
module.exports = {Login};