const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.locals = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send("Please authenticate");
  }
};

module.exports = auth;
