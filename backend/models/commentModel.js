import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Tasks", required: true },
  createdAt: { type: Date, default: Date.now }
});

const commentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default commentModel;
