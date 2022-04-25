import express from 'express';
import BrandController from '../controllers/BrandController';
import shorten from 'shorten-url';
const router = express.Router();


router.post(shorten("/brands/create" , 30), BrandController.createBrands);
router.get(shorten("/brands/list" , 30), BrandController.listBrands);
router.get(shorten("/brands/getInfoById/:id" , 30), BrandController.getBrandsById);
router.get(shorten("/brands/search" , 30) , BrandController.searchBrands);
router.delete(shorten("/brands/delete/:id" , 30) , BrandController.deleteBrands);
router.patch(shorten("/brands/restore/:id" , 30), BrandController.resStoreBrands);
router.post(shorten("/brands/delete/all" , 30) , BrandController.deleteAllCheckBoxBrands);
router.delete(shorten("/brands/delete/:id/force" , 30) , BrandController.forceDeleteBrands);
export default router;