import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";

const subCategorySchema = new mongoose.Schema({ 
    name: {
        type: String,
        unique: true ,
        trim: true,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    status: Boolean
} , { timestamps: true });

subCategorySchema.plugin(mongoose_delete , {overrideMethods: 'all' , deletedAt : true});

export default mongoose.model('SubCategory', subCategorySchema); 
