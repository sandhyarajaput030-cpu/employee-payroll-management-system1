import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },

    recipients: {
      type: [String], // admin | hr | employee | all
      default: []
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    link: { type: String, default: "" },

    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Log when a notification is created for easier debugging
notificationSchema.post('save', function (doc) {
  try {
    console.log(`Notification saved: type=${doc.type || 'N/A'} message=${doc.message} recipients=${JSON.stringify(doc.recipients)} userId=${doc.userId}`);
  } catch (err) {
    // ignore logging errors
  }
});

export default mongoose.model("Notification", notificationSchema);