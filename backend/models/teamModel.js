import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    companyName: { type: String, required: false }, // Modificare: companyName ca String, nu referință
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: false, 
        },
    ],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tasks",
            required: false,
        },
    ],
}, { minimize: false, timestamps: true });

const teamModel = mongoose.models.Team || mongoose.model("Team", teamSchema, "teams");
export default teamModel;
