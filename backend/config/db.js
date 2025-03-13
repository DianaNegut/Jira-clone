import mongoose from "mongoose"
import mongo from "mongoose"


export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://diananegut:123@jira-project.8emu9.mongodb.net/?retryWrites=true&w=majority&appName=Jira-project").then(()=>console.log("DB Connected"));
}