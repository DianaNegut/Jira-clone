
import mongoose from "mongoose";
import fs from 'graceful-fs'; 

const projectSchema = new mongoose.Schema({
    name: {type:String, required: true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:String, required:true}
})


const projectModel = mongoose.models.project || mongoose.model("project", projectSchema)

export default projectModel;