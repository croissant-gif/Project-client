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
    schedule_date: { type: String },         // Date of assignment (e.g. '2025-08-05')
    schedule_start: { type: String },    // e.g. '09:00'
    schedule_finish: { type: String },    // e.g. '11:30'
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
