import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  companyName: { type: String, required: true },
  uniqueId: { type: String, unique: true },
  createdTimestamp: { type: Number, default: Date.now },
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


teamSchema.index({ name: 1, companyName: 1 }, { unique: true });


teamSchema.pre('save', function(next) {
  if (!this.createdTimestamp) {
    this.createdTimestamp = Date.now();
  }
  this.uniqueId = `${this.name}_${this.companyName}_${this.createdTimestamp}`;
  next();
});

const teamModel = mongoose.models.Team || mongoose.model("Team", teamSchema, "teams");
export default teamModel;