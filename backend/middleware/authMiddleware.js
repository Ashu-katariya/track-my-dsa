const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // token header se lo
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // "Bearer token" → token nikaalna
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user id request ke sath attach
    req.userId = decoded.id;

    next(); // ✅ allow request
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
