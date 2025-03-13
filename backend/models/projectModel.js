import { Description } from "@mui/icons-material";
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {type:String, require: true},
    description:{type:String, require:true},
    price:{type:Number, require:true},
})


const projectModel = mongoose.models.project || mongoose.model("project", projectSchema)

export default projectModel