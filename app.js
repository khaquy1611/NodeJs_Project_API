const http = require('http');
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import xss from 'xss-clean';
import mongoSanitize  from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import CategoryRouter from './routes/CategoryRouter';
import SubCategoryRouter from "./routes/SubCategoryRouter";
import BrandsRouter from "./routes/BrandsRouter";
import ProductRouter from './routes/ProductRouter';
import RoleRouter from './routes/RoleRouter';
import AuthRouter from "./routes/AuthRouter";
import path from "path";
import { connect  } from "./config/db";
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const rootDir = require("./helper/path");


app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "100kb"} ));

const limiter = rateLimit({
     max: 100 ,
     windowMs: 60 * 60 * 1000,
     message: `Qúa Nhiều Truy Cập Đến IP này , vui lòng thử lại!`,
     standardHeaders: true, 
	   legacyHeaders: false, 
});


// api của router
app.use('api', limiter);







app.use('/api' , CategoryRouter);
app.use('/api' , SubCategoryRouter);
app.use('/api' , BrandsRouter);
app.use('/api' , ProductRouter);
app.use('/api' , RoleRouter);
app.use('/api' , AuthRouter);
app.all('*' , (req, res , next) => {
    res.status(200).json({ message: `Không tìm thấy trang ${req.originalUrl}` });
});

//Kêt nối database

connect.main()
.then(() => {
  console.log("Kết Nối Cơ Sở Dữ Liệu Thành Công");
  server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
  });
})
.catch((err) => console.log("Không Thể Kết Nối Database", err));
