import Notice from "../models/Notice.js";

/* ================================
   CREATE NOTICE (Admin/HR)
================================ */
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({
      title: req.body.title,
      message: req.body.message,
      createdBy: req.user._id,
      role: req.user.role?.toLowerCase() // ✅ IMPORTANT
    });

    await Notification.create({
      message: `New notice: ${req.body.title}`,
      type: "NOTICE",
      recipients: ["admin", "hr", "employee"],
      link: "/hr-dashboard/notice-board",
    });


    res.status(201).json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating notice" });
  }
};

/* ================================
   GET ALL NOTICES
================================ */
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices
    });
  } catch (error) {
    console.error("Get Notices Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ================================
   DELETE NOTICE
================================ */
export const deleteNotice = async (req, res) => {
  try {
    const user = req.user;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    // ✅ ADMIN can delete all
    if (user.role === "admin") {
  await Notice.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
}

    // ✅ HR can delete ONLY HR notices
    if (user.role === "hr" && notice.role === "hr") {
  await Notice.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
}

    return res.status(403).json({
      success: false,
      message: "Not allowed"
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting notice" });
  }
};