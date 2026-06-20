import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  // ✅ NEW STATES
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:8000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE PROFILE
const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:8000/api/employees/${user._id}`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setUser(res.data);
    setEditMode(false);

    alert("Profile Updated!");
  } catch (err) {
    console.error("Update Error:", err);
  }
};
  if (!user) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const role = user?.role?.toLowerCase();
  const isAdminOrHR = role === "admin" || role === "hr";
  const isEmployee = role === "employee";

  const defaultImages = {
  admin: "https://sundancecollege.com/wp-content/uploads/2024/09/professional-business-manager-working-on-project-with-laptop-768x399.webp",
  hr: "https://www.shutterstock.com/image-photo/cheerful-indian-professional-businessman-holds-260nw-2438673023.jpg",
  employee: "https://static.vecteezy.com/system/resources/thumbnails/057/789/258/small/a-young-indian-man-in-a-suit-and-tie-standing-in-an-office-photo.jpg",
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        
        {/* LEFT */}
        <div style={styles.left}>
          <img
            src={
              (editMode ? form.profileImage : user.profileImage) ||
               defaultImages[role] ||
               "https://cdn-icons-png.flaticon.com/512/149/149071.png"
         }
            alt="profile"
            style={styles.image}
          />
          <h2>{editMode ? form.name : user.name}</h2>
          <p>{user.role}</p>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <h3>Profile Details</h3>

         {/* NAME */}
<div style={styles.row}>
  <span style={styles.label}>Name:</span>
  <span>{editMode ? form.name : user.name}</span>
</div>

{/* EMAIL */}
<div style={styles.row}>
  <span style={styles.label}>Email:</span>
  {editMode ? (
    <input
      name="email"
      value={form.email || ""}
      onChange={handleChange}
    />
  ) : (
    <span>{user.email}</span>
  )}
</div>

{/* CONTACT */}
{!isEmployee && (
  <div style={styles.row}>
    <span style={styles.label}>Contact:</span>

    {editMode ? (
      <input
        name="contact"
        value={form.contact || ""}
        onChange={handleChange}
      />
    ) : (
      <span>{user.contact || "-"}</span>
    )}
  </div>
)}

{/* DEPARTMENT */}
<div style={styles.row}>
  <span style={styles.label}>Department:</span>
  {editMode ? (
    <input
      name="department"
      value={form.department || ""}
      onChange={handleChange}
    />
  ) : (
    <span>{user.department || "-"}</span>
  )}
</div>

{/* DESIGNATION */}
<div style={styles.row}>
  <span style={styles.label}>Designation:</span>
  {editMode ? (
    <input
      name="designation"
      value={form.designation || ""}
      onChange={handleChange}
    />
  ) : (
    <span>{user.designation || "-"}</span>
  )}
</div>
          {/* PROFILE IMAGE URL */}
          {editMode && (
            <div style={styles.row}>
              <span>Image URL:</span>
              <input
                name="profileImage"
                value={form.profileImage || ""}
                onChange={handleChange}
              />
            </div>
          )}

          {/* EMPLOYEE ONLY */}
          {isEmployee && !editMode && (
  <div style={styles.row}>
    <span style={styles.label}>Joined:</span>
    <span>
      {user.createdAt
        ? new Date(user.createdAt).toDateString()
        : "-"}
    </span>
  </div>
)}

          {/* BUTTONS */}
          {isAdminOrHR && (
            <>
              {!editMode ? (
                <button
                  style={styles.btn}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button style={styles.btn} onClick={handleUpdate}>
                    Save
                  </button>
                  <button
                    style={{ ...styles.btn, background: "#6b7280", marginTop: "10px" }}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  card: {
    display: "flex",
    width: "700px",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "3px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(45deg, #ed2d57, #19231f)",
    backgroundOrigin: "border-box",
    backgroundClip: "content-box, border-box",
  },
  left: {
    width: "40%",
    background: "#f3f4f6",
    textAlign: "center",
    padding: "20px",
  },
  right: {
    width: "60%",
    padding: "20px",
  },
  image: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
row: {
  display: "flex",
  alignItems: "center",
  margin: "20px 0",
},

label: {
  width: "120px",       // fixed label width
  fontWeight: "600",
  marginRight: "30px" 
},

input: {
  flex: 1,
  padding: "10px",
},
  btn: {
    marginTop: "20px",
    padding: "10px",
    width: "100%",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProfilePage;