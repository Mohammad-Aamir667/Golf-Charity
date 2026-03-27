const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

const adminOnly = (req, res, next) => {
  const hardcodedAdminEmail = (process.env.ADMIN_EMAIL || "admin@example.com")
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
