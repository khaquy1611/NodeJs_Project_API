import SubCategory from "../models/SubCategory";
const { Validator } = require("node-input-validator");
import { QueryString } from "../helper/QueryString";
class SubCategoryController {
  // Lấy Danh Mục Con Và Danh Mục Cha Của Nó
  static async listSubCategory(req, res, next) {
    try {
      let total = await SubCategory.countDocuments().exec();
      const subCategory = await SubCategory.find({ status: true })
        .populate("category_id")
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Danh Sách Danh Mục Con Thành Công`,
        data: subCategory,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Lấy Danh Sách Danh Mục Con Thất Bại`, err: err });
    }
  }

  // Tạo Danh Mục Con
  static async createSubCategory(req, res, next) {
    const v = new Validator(req.body, {
      name: "required|minLength:1|maxLength:100",
      category_id: "required|minLength:1|maxLength:1000",
    });
    const matched = await v.check();
    if (!matched) {
      res.status(422).json({ message: v.errors });
    }
    try {
      const subCategory = await SubCategory(req.body).save();

      res.status(200).json({
        message: `Tạo Danh Mục Con Thành Công`,
        subCategory: subCategory,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: `Tạo Danh Mục Con Thất Bại`, err: error });
    }
  }

  // Lấy Danh Mục Con Theo Id
  static async getSubCategoryById(req, res, next) {
    try {
      let total = await SubCategory.countDocuments().exec();
      let subCategory = await SubCategory.findById(req.params.id)
        .populate("category_id")
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Danh Mục Con Theo  ${req.params.id} thành công`,
        subCategory: subCategory,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Lấy Được Danh Mục Con Theo ID` });
    }
  }

  // Tìm Kiếm Danh Mục Con Theo Tên Hoặc Id
  static async searchSubCategory(req, res, next) {
    try {
      let total = await SubCategory.countDocuments().exec();
      if (req.query.key !== "" && req.query.key) {
        let subCategory = await SubCategory.find({
          $or: [
            { name: { $regex: req.query.key, $options: "i" } },
            { id: { $regex: req.query.key, $options: "i" } },
          ],
        })
          .populate("category_id")
          .limit(QueryString(req).perPage)
          .skip(QueryString(req).skip)
          .sort(QueryString(req).sort)
          .exec();
        res.status(200).json({
          message: `Tìm Kiếm Danh Mục Theo Tên ${req.query.key} thành công`,
          subCategory: subCategory,
          currentPage: QueryString(req).page,
          perPage: QueryString(req).perPage,
          totalPages: Math.ceil(total / QueryString(req).perPage),
          total: total,
        });
      }
    } catch (err) {
      res
        .status(400)
        .json({
          message: `Danh Mục Theo Tên ${req.query.key} Không Tìm Thấy`,
          err: err,
        });
    }
  }

  // Xóa Mềm Danh Mục Con
  static async deleteSubCategory(req, res, next) {
    try {
      const subCategory = await SubCategory.delete({
        _id: req.params.id,
      }).exec();
      res
        .status(200)
        .json({ message: `Xóa Mèm Danh Mục Con ${req.params.id} Thành Công` });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Xóa Mèm Danh Mục Con Thất Bại`, err: err });
    }
  }

  // Xóa Hết Danh Mục Con Theo CheckBox
  static async deleteAllCheckBoxSubCategory(req, res, next) {
    try {
      let subCategory = await SubCategory.deleteMany({
        _id: { $in: req.body._id },
      }).exec();
      res.status(200).json({
        message: `Xóa tất cả danh mục thành công`,
        subCategory: subCategory,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Xóa tất cả danh mục thất bại`, err: err });
    }
  }

  // Khôi Phục Lại Danh Mục Con
  static async resStoreSubCategory(req, res, next) {
    try {
      let subCategory = await SubCategory.restore({
        _id: req.params.id,
      }).exec();
      res.status(200).json({
        message: `Khôi Phục Danh Mục ${req.params.id} Thành Công`,
        subCategory: subCategory,
      });
    } catch (err) {
      res.status(400).json({
        message: `Khôi Phục Danh Mục ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }

  // Xóa Vĩnh Viễn Danh Mục Con
  static async forceDeleteSubCategory(req, res, next) {
    try {
      let subCategory = await SubCategory.deleteOne({
        _id: req.params.id,
      }).exec();
      res.status(200).json({
        message: `Xóa Vĩnh Viễn Danh Mục ${req.params.id} Thành Công`,
        subCategory: subCategory,
      });
    } catch (err) {
      res.status(400).json({
        message: `Xóa Vĩnh Viễn Danh Mục ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }
  // Cập Nhập Danh Mục Con
  static async updateSubCategory(req, res, next) {
    try {
      let total = await SubCategory.countDocuments().exec();
      const subCategory = await SubCategory.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      ).exec();
      res.status(200).json({
        message: `Cập Nhật Danh Mục ${req.params.id} Thành Công`,
        subCategory: subCategory,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Cập Nhật Danh Mục Con`, err: err });
    }
  }
}

export default SubCategoryController;
