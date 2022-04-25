import Product from "../models/Product";
const { Validator } = require("node-input-validator");
import { QueryString } from "../helper/QueryString";

class ProductController {
  // Tạo Sản Phẩm
  static async createProduct(req, res, next) {
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
      let product = new Product({
        name: req.body.name,
        category_id: req.body.category_id,
        subcategory_id: req.body.subcategory_id,
        price: parseFloat(req.body.price),
        desc: req.body.desc,
        status: parseInt(req.body.status),
        slug: req.body.slug,
        brand_id: req.body.brand_id,
        description: req.body.description,
        detail: req.body.detail,
      });
      if (req.files) {
        let path = "";
        req.files.forEach((file) => {
          path += file.path + ",";
        });
        path = path.substring(0, path.lastIndexOf(","));
        product.imgs = path;
      }
      const products = await product.save();
      res
        .status(200)
        .json({ message: `Tạo Sản Phẩm Thành Công`, products: products });
    } catch (error) {
      res.status(400).json({ message: `Không Thể Tạo Sản Phẩm`, err: error });
    }
  }

  // Lấy Danh Sách Sản Phẩm theo danh mục cha , danh mục con và nhãn hiệu Và Sắp Xếp Lẫn Phân Trang

  static async listProduct(req, res, next) {
    try {
      let total = await Product.countDocuments().exec();
      let products = await Product.find({})
        .populate("category_id")
        .populate("subcategory_id")
        .populate({
          path: "subcategory_id",
          populate: { path: "category_id" },
        })
        .populate("brand_id")
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Danh Sách Sản Phẩm Thành Công`,
        products: products,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Lấy Được Danh Sách Sản Phẩm `, err: err });
    }
  }

  // Lấy Danh Mục Sản Phẩm   Theo Id
  static async getProductById(req, res, next) {
    try {
      let total = await Product.countDocuments().exec();
      let products = await Product.findById(req.params.id)
        .populate("category_id")
        .limit(QueryString(req).perPage)
        .skip(QueryString(req).skip)
        .sort(QueryString(req).sort)
        .exec();
      res.status(200).json({
        message: `Lấy Sản Phẩm  Theo  ${req.params.id} thành công`,
        products: products,
        total: total,
        currentPage: QueryString(req).page,
        perPage: QueryString(req).perPage,
        totalPages: Math.ceil(total / QueryString(req).perPage),
      });
    } catch (err) {
      res.status(400).json({ message: `Không Thể Lấy Được Sản Phẩm Theo ID` });
    }
  }

  // Tìm Kiếm Sản Phẩm Theo Tên Hoặc Id
  static async searchProduct(req, res, next) {
    try {
      let total = await Product.countDocuments().exec();
      if (req.query.key !== "" && req.query.key) {
        let products = await Product.find({
          $or: [
            { name: { $regex: req.query.key, $options: "i" } },
            { id: { $regex: req.query.key, $options: "i" } },
          ],
        })
          .populate("category_id")
          .populate("subcategory_id")
          .populate({
            path: "subcategory_id",
            populate: { path: "category_id" },
          })
          .populate("brand_id")
          .limit(QueryString(req).perPage)
          .skip(QueryString(req).skip)
          .sort(QueryString(req).sort)
          .exec();
        res.status(200).json({
          message: `Tìm Kiếm Sản Phẩm Theo Tên ${req.query.key} thành công`,
          products: products,
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
          message: `Sản Phẩm  ${req.query.key} Không Tìm Thấy`,
          err: err,
        });
    }
  }

  // Xóa Mềm Danh Mục Con
  static async deleteProduct(req, res, next) {
    try {
      const products = await Product.delete({ _id: req.params.id }).exec();
      res
        .status(200)
        .json({ message: `Xóa Mèm Sản Phẩm  ${req.params.id} Thành Công` });
    } catch (err) {
      res.status(400).json({ message: `Xóa Mèm Sản Phẩm Thất Bại`, err: err });
    }
  }

  // Khôi Phục Lại Sản Phẩm
  static async resStoreProduct(req, res, next) {
    try {
      let products = await Product.restore({ _id: req.params.id }).exec();
      res.status(200).json({
        message: `Khôi Phục Sản Phẩm ${req.params.id} Thành Công`,
        products: products,
      });
    } catch (err) {
      res.status(400).json({
        message: `Khôi Phục Sản Phẩm ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }

  // Xóa Hết Sản Phẩm Theo CheckBox
  static async deleteAllCheckBoxProduct(req, res, next) {
    try {
      let products = await Product.deleteMany({
        _id: { $in: req.body._id },
      }).exec();
      res.status(200).json({
        message: `Xóa tất cả Sản Phẩm thành công`,
        products: products,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Xóa tất cả Sản Phẩm thất bại`, err: err });
    }
  }

  // Xóa Vĩnh Viễn Sản Phẩm
  static async forceDeleteProduct(req, res, next) {
    try {
      let products = await Product.deleteOne({ _id: req.params.id }).exec();
      res.status(200).json({
        message: `Xóa Vĩnh Viễn Sản Phẩm ${req.params.id} Thành Công`,
        products: products,
      });
    } catch (err) {
      res.status(400).json({
        message: `Xóa Vĩnh Viễn Sản Phẩm ${req.params.id} Thất Bại`,
        err: err,
      });
    }
  }

  // Cập Nhập Sản Phẩm
  static async updateProduct(req, res, next) {
    try {
      let total = await Product.countDocuments().exec();
      const products = await Product.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      ).exec();
      res.status(200).json({
        message: `Cập Nhật Sản Phẩm ${req.params.id} Thành Công`,
        products: products,
        total: total,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: `Không Thể Cập Nhật Sản Phẩm`, err: err });
    }
  }
}

export default ProductController;
