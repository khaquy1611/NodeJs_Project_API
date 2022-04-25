import Category from "../models/Category";
const { Validator } = require("node-input-validator");
import { QueryString } from "../helper/QueryString";
class CategoryController {
  // Lấy Danh Sách Danh Mục Và Sắp Xếp Lẫn Phân Trang

  static async listCategory(req, res, next) {
    try {
      let total = await Category.countDocuments().exec();
      let category = await Category.find({})
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Danh Sách Danh Mục Thành Công`,
        category: category,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Lấy Được Danh Sách Danh Mục`, err: err });
    }
  }
  // Lọc Theo Parent Id
  static async listCategoryForParentId(req, res, next) {
    // lấy tham số parentId từ chuỗi query string từ url xuống
    const parentId = req.query.parentId || "0";
    console.log(parentId);
    try {
      let category = await Category.find({ parentId: parentId }).exec();
      res.status(200).json({ status: 0, data: category, parentId: parentId });
    } catch (err) {
      console.error(`Ngoại Lệ`, error);
      res.status(400).json({
        status: 1,
        message: `Không thể lấy danh sách danh mục theo id danh mục cha`,
      });
    }
  }

  static async createCategory(req, res, next) {
    const v = new Validator(req.body, {
      name: "required|minLength:1|maxLength:100",
      description: "required|minLength:1|maxLength:100",
      slug: "required|minLength:1|maxLength:100",
    });
    const matched = await v.check();
    if (!matched) {
      res.status(422).json({ message: v.errors });
    }
    try {
      const category = await Category(req.body).save();

      res
        .status(200)
        .json({ message: `Tạo Danh Mục Thành Công`, category: category });
    } catch (error) {
      res.status(400).json({ message: `Không Thể Thêm Danh Mục`, err: error });
    }
  }
  static async getCategoryById(req, res, next) {
    try {
      let total = await Category.countDocuments().exec();
      let category = await Category.findById(req.params.id)
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Danh Mục  ${req.params.id} thành công`,
        category: category,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res.status(400).json({ message: `Không Thể Lấy Được Danh Mục Theo ID` });
    }
  }
  // Tìm Kiếm Danh Mục
  static async searchCategory(req, res, next) {
    try {
      if (req.query.key !== "" && req.query.key) {
        let category = await Category.find({
          $or: [
            { name: { $regex: req.query.key, $options: "i" } },
            { id: { $regex: req.query.key, $options: "i" } },
          ],
        }).exec();
        res.status(200).json({
          message: `Tìm Kiếm Danh Mục Theo Tên ${req.query.key} thành công`,
          category: category,
        });
      }
    } catch (err) {
      res
        .status(400)
        .json({ message: `Danh Mục Theo Tên ${req.query.key} Không Tìm Thấy` });
    }
  }

  // Xóa Mèm Danh Mục
  static async deleteCategory(req, res, next) {
    try {
      const category = await Category.delete({ _id: req.params.id }).exec();
      res
        .status(200)
        .json({ message: `Xóa Mèm Danh Mục ${req.params.id} Thành Công` });
    } catch (err) {
      res.status(400).json({ message: `Xóa Mèm Danh Mục Thất Bại`, err: err });
    }
  }

  // Xóa Tất Cả Theo CheckBox
  static async deleteAllCheckBoxCategory(req, res, next) {
    try {
      let category = await Category.deleteMany({
        _id: { $in: req.body._id },
      }).exec();
      res.status(200).json({
        message: `Xóa tất cả danh mục thành công`,
        category: category,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Xóa tất cả danh mục thất bại`, err: err });
    }
  }

  // Khôi Phục Lại Danh Mục
  static async resStoreCategory(req, res, next) {
    try {
      let category = await Category.restore({ _id: req.params.id }).exec();
      res.status(200).json({
        message: `Khôi Phục Danh Mục ${req.params.id} Thành Công`,
        category: category,
      });
    } catch (err) {
      res.status(400).json({
        message: `Khôi Phục Danh Mục ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }

  // Xóa Thật Không Khôi Phục Được
  static async forceDeleteCategory(req, res, next) {
    try {
      let category = await Category.deleteOne({ _id: req.params.id }).exec();
      res.status(200).json({
        message: `Xóa Vĩnh Viễn Danh Mục ${req.params.id} Thành Công`,
        category: category,
      });
    } catch (err) {
      res.status(400).json({
        message: `Xóa Vĩnh Viễn Danh Mục ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      ).exec();
      res.status(200).json({
        message: `Cập Nhật Danh Mục ${req.params.id} Thành Công`,
        category: category,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Cập Nhật Danh Mục`, err: err });
    }
  }
}

export default CategoryController;
