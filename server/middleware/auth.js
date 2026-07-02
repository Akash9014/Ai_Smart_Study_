const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token =
    req.headers["x-auth-token"] ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

console.log("TOKEN:", token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {

    console.log("VERIFY ERROR:", err.message);

    return res.status(401).json({ message: "Token is not valid" });

  }

};

module.exports = authMiddleware;