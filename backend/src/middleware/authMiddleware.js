const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect  = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized", message: "Please log in to continue." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found", message: "No user associated with this token." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token", message: "Your session has expired or token is invalid." });
  }
};


const adminOnly = (req, res, next) => {
  const hardcodedAdminEmail = (process.env.ADMIN_EMAIL || "admin@test.com")
    .trim()
    .toLowerCase();
  const userEmail = (req.user?.email || "").trim().toLowerCase();
  const isAdminByRole = req.user?.role === "admin";
  const isHardcodedAdmin = userEmail && userEmail === hardcodedAdminEmail;

  if (!isAdminByRole && !isHardcodedAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
};

module.exports = { protect, adminOnly };
