import express from 'express';
import RoleController from '../controllers/RoleController';
import shorten from 'shorten-url';
const router = express.Router();


router.post(shorten("/role/create" , 30) ,  RoleController.createRole);
router.get(shorten("/role/list" , 30) ,  RoleController.getListRole);
router.put(shorten("/role/update/:id" , 30) ,  RoleController.updateRole);
export default router;