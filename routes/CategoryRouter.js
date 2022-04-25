import express from 'express';
import CategoryController from '../controllers/CategoryController';
import shorten from 'shorten-url';
const router = express.Router();

router.post(shorten("/category/create" , 30), CategoryController.createCategory);
router.get(shorten("/category/list" , 30), CategoryController.listCategory);
router.get(shorten("/category/parentIdList" , 30), CategoryController.listCategoryForParentId);
router.get(shorten("/category/getInfoById/:id" , 30) , CategoryController.getCategoryById);
router.get(shorten("/category/search" , 30) , CategoryController.searchCategory);
router.delete(shorten("/category/delete/:id" , 30) , CategoryController.deleteCategory);
router.patch(shorten("/category/restore/:id" , 30), CategoryController.resStoreCategory);
router.delete(shorten("/category/delete/:id/force" , 30) , CategoryController.forceDeleteCategory);
router.post(shorten("/category/delete/all" , 30) , CategoryController.deleteAllCheckBoxCategory);
router.put(shorten("/category/update/:id" , 30) , CategoryController.updateCategory);
export default router;