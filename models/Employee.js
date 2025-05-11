import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for assignedRooms
const assignedRoomSchema = new Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',  // Assuming you have a Room model
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
});

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    schedule: { type: String, default: 'Not assigned' },
    assignedRooms: [assignedRoomSchema],  // Updated to store objects with roomId and roomName
    username: { type: String, required: true, unique: true }, // Add username field
    password: { type: String, required: true },  // Add password field
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
