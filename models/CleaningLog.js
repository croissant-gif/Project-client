// models/CleaningLog.js
import mongoose from 'mongoose';

const CleaningLogSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomName: String,
  user: String, // optional, if you want to track who cleaned
  status: String, // e.g., "STARTED", "FINISHED"
  startTime: Date,
  finishTime: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CleaningLog || mongoose.model('CleaningLog', CleaningLogSchema);
