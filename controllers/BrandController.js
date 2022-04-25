import Brands from "../models/Brands";
const { Validator } = require("node-input-validator");
import { QueryString } from "../helper/QueryString";


class BrandsController { 

    // Tạo Nhãn Hiệu
    static async createBrands(req, res, next) { 
        const v = new Validator(req.body, {
            name: "required|minLength:1|maxLength:100",
            slug: "required|minLength:1|maxLength:100",
          });
          const matched = await v.check();
          if (!matched) {
            res.status(422).json({ message: v.errors });
          }
          try {
            let total = await Brands.countDocuments().exec();
            const brands = await Brands(req.body).save();
      
            res
              .status(200)
              .json({ message: `Tạo Nhãn Hiệu Thành Công`, brands: brands });
          } catch (error) {
            res.status(400).json({ message: `Không Thể Thêm Nhãn Hiệu`, err: error });
          }
    }

    // Lấy Danh Mục Con Và Danh Mục Cha Của Nó
  static async listBrands(req, res, next) {
    try {
      let total = await Brands.countDocuments().exec();
      const brands = await Brands.find({  })
        .populate("category_id")
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec()
      res.status(200).json({
        message: `Lấy Danh Sách Nhãn Hàng Theo Danh Mục Thành Công`,
        data: brands,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Lấy Danh Sách Nhãn Hàng Theo Danh Mục  Thất Bại`, err: err });
    }
  }

   // Lấy Danh Mục Con Theo Id
   static async getBrandsById(req, res, next) {
    try {
      let total = await Brands.countDocuments().exec();
      let brands = await Brands.findById(req.params.id).populate("category_id")
      .limit(QueryString(req).perPage)
      .skip(QueryString(req).skip)
      .sort(QueryString(req).sort)
      .exec();
      res
        .status(200)
        .json({
          message: `Lấy Nhãn Hiệu  Theo  ${req.params.id} thành công`,
          brands: brands,
          total: total,
          currentPage: QueryString(req).page,
          perPage: QueryString(req).perPage,
          totalPages: Math.ceil(total / QueryString(req).perPage),
        });
    } catch (err) {
      res.status(400).json({ message: `Không Thể Lấy Được Nhãn Hiệu Con Theo ID` });
    }
  }


   // Tìm Kiếm Nhãn Hiệu
   static async searchBrands(req, res, next) {
    try {
      if (req.query.key !== "" && req.query.key) {
        let brands = await Brands.find({
          $or: [
            { name: { $regex: req.query.key, $options: "i" } },
            { id: { $regex: req.query.key, $options: "i" } },
          ],
        }).exec();
        res.status(200).json({
          message: `Tìm Kiếm Nhãn Hiệu Theo Tên ${req.query.key} thành công`,
          brands: brands,
        });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: `Tìm kiếm Nhãn Hiệu Theo Tên ${req.query.key} Không Thành Công` });
    }
  }

  // Xóa Mèm Nhãn Hiệu
  static async deleteBrands(req, res, next) {
    try {
      const brands = await Brands.delete({ _id: req.params.id }).exec();
      res
        .status(200)
        .json({ message: `Xóa Mèm Nhãn Hiệu ${req.params.id} Thành Công` });
    } catch (err) {
      res.status(400).json({ message: `Xóa Mèm Nhãn Hiệu Thất Bại`, err: err });
    }
  }

  // Xóa Tất Cả Theo CheckBox
  static async deleteAllCheckBoxBrands(req, res, next) {
    try {
      let brands = await Brands.deleteMany({
        _id: { $in: req.body._id },
      }).exec();
      res
        .status(200)
        .json({
          message: `Xóa tất cả Nhãn Hiệu thành công`,
          brands: Brands,
        });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Xóa tất cả Nhãn Hiệu Thất Bại`, err: err });
    }
  }

   // Khôi Phục Nhãn Hiệu
   static async resStoreBrands(req, res, next) {
    try {
      let brands = await Brands.restore({ _id: req.params.id }).exec();
      res
        .status(200)
        .json({
          message: `Khôi Phục Nhãn Hiệu ${req.params.id} Thành Công`,
          brands: brands,
        });
    } catch (err) {
      res
        .status(400)
        .json({
          message: `Khôi Phục Nhãn Hiệu ${req.params.id} Thất Bại`,
          err: err,
        });
    }
  }

   // Xóa Thật Không Khôi Phục Được
   static async forceDeleteBrands(req, res, next) {
    try {
      let brands = await Brands.deleteOne({ _id: req.params.id }).exec();
      res
        .status(200)
        .json({
          message: `Xóa Vĩnh Viễn Nhãn Hàng ${req.params.id} Thành Công`,
          brands: brands,
        });
    } catch (err) {
      res
        .status(400)
        .json({
          message: `Xóa Vĩnh Viễn Nhãn Hàng  ${req.params.id} Thất Bại`,
          err: err,
        });
    }
  }

}

export default BrandsController;