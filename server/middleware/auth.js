const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Not authorized Login again" });
  }
  try {
    const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = token_decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = authMiddleware;
