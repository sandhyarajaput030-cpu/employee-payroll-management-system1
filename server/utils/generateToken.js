import jwt from 'jsonwebtoken'; // ✅ Use 'import' instead of 'require'

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token lasts for 30 days
  });
};

export default generateToken; // ✅ Correct ES Module export