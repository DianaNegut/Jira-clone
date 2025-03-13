import projectModel from "../models/projectModel.js";
import fs from 'fs';

// Add project item
const addProject = async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        let image_filename = `${req.file.filename}`;

        // Create a new project
        const project = new projectModel({
            name: req.body.name,
            description: req.body.description, // Fix: Use req.body.description
            price: req.body.price, // Fix: Use req.body.price
            image: image_filename
        });

        // Save the project to the database
        await project.save();
        res.json({ success: true, message: "Project Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

export { addProject };