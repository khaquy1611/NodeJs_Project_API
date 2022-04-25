import express from 'express';
import AuthController from '../controllers/AuthController';
import middleWare from "../middleware/middlewareAuth";
import shorten from 'shorten-url';
const router = express.Router();

router.post("/signup" , AuthController.SignUp);
router.post("/signin" , AuthController.SignIn);
router.get('/user' , middleWare.verifyToken , AuthController.getAllUser);
router.delete('/user/:id' , middleWare.verifyTokenAndAdminAuth , AuthController.deleteUser);
router.post('/user/refresh' , AuthController.requestRefreshToken);

export default router;
