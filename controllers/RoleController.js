import Role from "../models/Role";
const { Validator } = require("node-input-validator");
import { QueryString } from "../helper/QueryString";



class RoleController {
    
    
    // Tạo Vai Trò Cho 
    static async createRole(req, res, next) { 
        try {
            let role = new Role({
              name: req.body.name,
            });
            const roles = await role.save();
            res
              .status(200)
              .json({ message: `Tạo Vai Trò Thành Công`, roles: roles });
          } catch (error) {
            res.status(400).json({ message: `Không Thể Tạo Vai Trò `, err: error });
          }
    }

    // Lấy Danh Sách Vai Trò
    static async getListRole(req, res, next) { 
        try {
            let total = await Role.countDocuments().exec();
            let roles = await Role.find({})
              .limit(QueryString(req).perPage)
              .skip(QueryString(req).skip)
              .sort(QueryString(req).sort)
              .exec();
            res.status(200).json({
              message: `Lấy Danh Sách Vai Trò Thành Công`,
              roles: roles,
              total: total,
              currentPage: QueryString(req).page,
              perPage: QueryString(req).perPage,
              totalPages: Math.ceil(total / QueryString(req).perPage),
            });
          } catch (err) {
            res
              .status(400)
              .json({ message: `Không Thể Lấy Được Danh Sách Vai Trò `, err: err });
          }
    }


    // Cập Nhập Vai Trò Người Dùng

    static async updateRole(req, res, next) {
        try {
          let total = await Role.countDocuments().exec();
          const roles = await Role.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
          ).exec();
          res.status(200).json({
            message: `Cập Nhật Vai Trò ${req.params.id} Thành Công`,
            roles: roles,
            total: total,
          });
        } catch (err) {
          res
            .status(400)
            .json({ message: `Không Thể Cập Nhật Vai Trò`, err: err });
        }
      }
}


export default RoleController;