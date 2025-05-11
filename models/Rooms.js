import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomName: { type: String, required: true },
    roomType: { type: String, required: true },
    specialRequest: { type: String, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: { type: String, default: 'Vacant Clean' },
    arrivalDate: { type: Date, default: null },
    departureDate: { type: Date, default: null },
    arrivalTime: { type: String, default: '' },
    reason: { type: String, default: '' },
    startTime: { type: Date, default: null },    // Add startTime field
    finishTime: { type: Date, default: null },   // Add finishTime field
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
