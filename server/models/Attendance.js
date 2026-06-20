import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // ✅ Must refer to User model
    required: true
  },
  date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Present', 'Absent', 'Half Day', 'Leave'], 
    required: true 
  },
  checkIn: Date,   // ✅ Store as Date object
  checkOut: Date,  // ✅ Store as Date object
  workHours: {
  type: Number,
  default: 0
},
dateString: {
  type: String,
  required: true
},
  notes: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, dateString: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;