import projectModel from "../models/projectModel.js";
import fs from 'fs';


const addProject = async (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let image_filename = `${req.file.filename}`;

        
        const project = new projectModel({
            name: req.body.name,
            description: req.body.description, 
            price: req.body.price, 
            image: image_filename
        });

        
        await project.save();
        res.json({ success: true, message: "Project Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};


const getProjects = async (req, res) => {
    try {
        const projects = await projectModel.find();
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error" });
    }
}


export { addProject,getProjects };