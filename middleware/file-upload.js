import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb){ 
        cb(null , 'uploads');
    },
    filename: function(req, file, cb) { 
        let ext = path.extname(file.originalname);
        cb(null , Date.now() + ext);
    }
})


const upload = multer({ 
    storage: storage,
    fileFilter: function(req , file , callback) {
        if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
            callback(null , true);
        } else  {
            console.log("Chỉ Hỗ Trợ file có đuôi jpg , jpeg , gif , png");
            callback(null , false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

export default upload;