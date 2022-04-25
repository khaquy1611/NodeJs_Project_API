import mongoose from "mongoose";
import mongoose_delete from "mongoose-delete";
import slug from "mongoose-slug-generator";
const roleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true ,
        require: true
    },
    auth_name: {
        type: String,
    },
    auth_time: Number,
    create_time: {
        type: Number,
        default: Date.now
    },
    slug: {
        type: String,
        slug: "name"
    },
    menus: Array,
    
});


mongoose.plugin(slug);
roleSchema.plugin(mongoose_delete , {overrideMethods: 'all' , deletedAt : true});

export default mongoose.model('Role', roleSchema);