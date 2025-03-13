import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
    name:{type:String, requiered:true},
    email:{type:String, requiered:true, unique:true},
    phone:{type:String, requiered:true, unique:true},
    password:{type:String, requiered:true},
    companyName:{type:String, requiered:true, unique:true},
    tasks:{type:Object, default:{}}

},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;