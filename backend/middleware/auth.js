import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "doddleDocsSecretKeySecure123");
    
    // Attach decoded user id to request
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
