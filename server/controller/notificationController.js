import Notification from "../models/Notification.js";

// GET NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    // More robust matching: check recipients array contains role or 'all', or matches the userId
    const query = {
      $or: [
        { recipients: { $in: [role, "all"] } },
        { userId }
      ]
    };

    console.log(`GetNotifications: role=${role} userId=${userId} query=${JSON.stringify(query)}`);

    const notifications = await Notification.find(query).sort({ createdAt: -1 });

    console.log(`Notifications found: ${notifications.length}`);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CLEAR
export const clearNotifications = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    const query = {
      $or: [
        { recipients: { $in: [role, "all"] } },
        { userId }
      ]
    };

    console.log(`ClearNotifications: role=${role} userId=${userId}`);

    await Notification.deleteMany(query);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};