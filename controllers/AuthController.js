import { validateUser } from "../models/user";
import User from "../models/user";
import jwt from "jsonwebtoken";

let resfreshTokens = [];

class Auth {
  static async SignUp(req, res, next) {
    const { name, email, password, error } = req.body;
    try {
      const exitsUser = await User.findOne({ email: email }).exec();
      if (exitsUser) {
        return res
          .status(400)
          .json({
            message: `Vui Lòng Nhập Tài Khoản Khác`,
            notification: `${email} đã được đăng ký !`,
          });
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      res.status(200).json({
        message: `Tạo Tài Khoản Thành Công`,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (err) {
      res.status(400).json({ message: `Không Thể Tạo Tài Khoản`, err: err });
    }
  };

  // tạo ra token cho người dùng
  static generateAccessToken(user) {
    return jwt.sign(
      {
      _id: user._id ,
      admin: user.isAdmin
    }
    ,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

  }

  // tạo ra refreshToken

  static generateRefreshToken(user) {
    return jwt.sign(
      {
        _id: user._id,
        admin: user.isAdmin
      }
      ,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "365d" }
    );
  }

  static async SignIn(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).exec();
    try {
      if (!user) {
        return res.status(400).json({ message: `Tài Khoản Không Tồn Tại` });
      }
      if (!user.authenticate(password)) {
        return res.status(400).json({ message: `Mật Khẩu Không Đúng` });
      }

      const token = Auth.generateAccessToken(user);
      const refreshToken = Auth.generateRefreshToken(user);

      resfreshTokens = User.updateOne({ _id: user._id }, { refreshToken: refreshToken }).exec();
      // Lưu RefreshToken vào Cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });

    

      res.status(200).json({
        message: `Đăng Nhập Thành Công`,
        user: {
          _id: user._id,
          name: user.name,
          admin: user.isAdmin,
          email: user.email,
        },
        token,
        refreshToken
      });
    } catch (err) {
      res.status(400).json({ message: `Không Thể Đăng Nhập`, err: err });
    }
  };

  static async getAllUser(req, res, next) { 
      const user = await User.find({}).exec();
      try {
          res.status(200).json({
              message: `Lấy Tất Cả Tài Khoản Thành Công`,
              user: user
          });
      }catch(err) {
          res.status(400).json({ message: `Không Thể Lấy Tất Cả Người Dùng`, err: err });
      } 
  };

  static async deleteUser(req , res , next) {
      const user = await User.findById(req.params.id).exec();
      try {
          if(!user) {
              return res.status(400).json({ message: `Không Tìm Thấy Tài Khoản` });
          }
          await user.remove();
          res.status(200).json({
              message: `Xóa Tài Khoản Thành Công`,
              user: user
          });
      }catch(err) {
          res.status(400).json({ message: `Không Thể Xóa Tài Khoản`, err: err });
      }
  };

  static async requestRefreshToken (req, res){
    // lấy token của người dùng
    const refreshToken = req.cookies.refreshToken;
    const userRefreshToken = await User.findOne({ refreshToken: refreshToken }).exec();

    if(!refreshToken) { 
        return res.status(401).json({ message: `Không Tìm Thấy Refresh Token` });
    }
    if(!userRefreshToken) {
      return res.status(401).json({ message: `Refresh Token Không Hợp Lệ` });
    }

    // Tạo Acess Token Mới
    jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET , (err , user) => {
      if(err) {
        console.log(err);
      }
      const newAcessToken = Auth.generateAccessToken(user);
      const newRefreshToken = Auth.generateRefreshToken(user);

      resfreshTokens = User.updateOne({ _id: user._id }, { refreshToken: refreshToken }).exec();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAcessToken,
        refreshToken: newRefreshToken,
      });
    });
  }

  static async Logout (req, res){
    resfreshTokens = User.find({ refreshToken: {$ne: req.body.token }});
    console.log(resfreshTokens);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: `Đăng Xuất Thành Công`});
  }
}
export default Auth;