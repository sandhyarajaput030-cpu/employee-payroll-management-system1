import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
   createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

role: {
  type: String,
  enum: ["admin", "hr"],
  required: true
}

  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;   // ✅ VERY IMPORTANT