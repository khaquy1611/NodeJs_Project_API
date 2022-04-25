import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";
import slug from "mongoose-slug-generator";
const brandsSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true , "Tên Thương Hiệu Không Được Để Trống"],
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: [true  , "Thuộc về Danh Mục Nào"],
    },
    slug: {
        type: String,
        unique: true,
        slug: "name"
    },
    status: Boolean
});

mongoose.plugin(slug);
brandsSchema.plugin(mongoose_delete , {overrideMethods: 'all' , deletedAt : true});

export default mongoose.model('Brands', brandsSchema);