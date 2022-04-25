import express from 'express';
import ProductController from '../controllers/ProductController';
import shorten from 'shorten-url';
import upload from '../middleware/file-upload';
const router = express.Router();


router.post(shorten("/product/create" , 30), upload.array('imgs[]') , ProductController.createProduct);
router.get(shorten("/product/list" , 30), ProductController.listProduct);
router.get(shorten("/product/getInfoById/:id" , 30), ProductController.getProductById);
router.get(shorten("/product/search" , 30), ProductController.searchProduct);
router.delete(shorten("/product/:id" , 30), ProductController.deleteProduct);
router.patch(shorten("/product/restore/:id" , 30), ProductController.resStoreProduct);
router.post(shorten("/product/delete/all" , 30) , ProductController.deleteAllCheckBoxProduct);
router.delete(shorten("/product/delete/:id/force" , 30), ProductController.forceDeleteProduct);
router.put(shorten("/product/update/:id" , 30) , ProductController.updateProduct);
export default router;