import express from 'express';
import SubCategoryController from '../controllers/SubCategoryController';
import shorten from 'shorten-url';
const router = express.Router();



router.post(shorten("/subcategory/create" , 30), SubCategoryController.createSubCategory);
router.get(shorten("/subcategory/list" , 30), SubCategoryController.listSubCategory);
router.get(shorten("/subcategory/getInfoById/:id" , 30), SubCategoryController.getSubCategoryById);
router.get(shorten("/subcategory/search" , 30), SubCategoryController.searchSubCategory);
router.delete(shorten("/subcategory/:id" , 30), SubCategoryController.deleteSubCategory);
router.patch(shorten("/subcategory/restore/:id" , 30), SubCategoryController.resStoreSubCategory);
router.delete(shorten("/subcategory/delete/:id/force" , 30), SubCategoryController.forceDeleteSubCategory);
router.post(shorten("/subcategory/delete/all" , 30) , SubCategoryController.deleteAllCheckBoxSubCategory);
router.put(shorten("/subcategory/update/:id" , 30) , SubCategoryController.updateSubCategory);
export default router;