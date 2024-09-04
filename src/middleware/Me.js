import jwt from "jsonwebtoken";
import User from "../models/User.js";
const me = async (req, res) => {
  const token = req.cookies.tlog;
  if (!token) return res.status(401).json({ loggedin: false });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(500);
    if (decoded) {
      try {
        const user = await User.findOne(
          { username: decoded.username },
          "-__v -password"
        ).exec();
        if (user)
          return res.status(200).json({
            loggedin: true,
            user: user,
          });
      } catch (e) {
        console.log(e);
        res.status(500);
      }
    }
  });
};
export default me;
