import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";
import slug from "mongoose-slug-generator";
import validator from "validator";
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: [true , 'Tên Danh Mục Phải Là Duy Nhất' ] ,
        trim: true,
        required: [true , 'Danh Mục Phải Có Tên'],
        maxLength: [40 , 'Tên Danh Mục Phải Có Ít Hơn Hoặc Bằng 40 Kí Tự'],
        minLength: [10 , 'Tên Danh Mục Phải Có Nhiều Hơn Hoặc Bằng 10 Kí Tự'],
        //validate: [validator.isAlpha , 'Tên Danh Mục Phải Chỉ Chứa Kí Tự']
    },
    description: {
        type: String,
        trim: true,
        required: [true , 'Tên Danh Mục Phải Có Mô Tả'],
    },
    slug: {
        type: String,
        unique: true,
        slug: "name"
    },
    parentId: {
        type: String,
        default: '0'
    },  
    status: Boolean
} , { timestamps: true });

mongoose.plugin(slug);

categorySchema.plugin(mongoose_delete , {overrideMethods: 'all' , deletedAt : true});

export default mongoose.model('Category', categorySchema);