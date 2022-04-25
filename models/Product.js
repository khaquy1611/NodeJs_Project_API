import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";
import slug from "mongoose-slug-generator";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true ,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subcategory_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    desc: {
        type: String,
    },
    status: { 
        type: Number,
        default: 1
    },
    slug: {
        type: String,
        unique: true,
        slug: "name"
    },
    imgs: {
        type: Array,
        default: []
    },
    brand_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands',
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    detail: {
        type: String,
    }
} , { timestamps: true });

mongoose.plugin(slug);
productSchema.plugin(mongoose_delete , {overrideMethods: 'all' , deletedAt : true});

export default mongoose.model('Product', productSchema);