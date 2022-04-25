import jwt from "jsonwebtoken";

const middleWareController = {
  verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "Token Không Hợp Lệ",
          });
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("Bạn Chưa Xác Thực");
    }
  },

  verifyTokenAndAdminAuth(req, res, next) {
    middleWareController.verifyToken(req, res, () => {
      if (req.user._id === req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json({ message: "Bạn Không Được Quyền Xóa" });
      }
    });
  },
};

export default middleWareController;