import mongoose from "mongoose";
const crypto = require('crypto');
import mongoose_delete from "mongoose-delete";
import validator from "validator";
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const User = new Schema({
    name: {
        type: String,
        unique: true ,
        trim: true,
        required: [true , 'Tên Người Dùng Không Được Để Trống'],
    },
    phone: {
        type: String,
    },
    email: { 
        type: String,
        unique: true,
        required: [true , 'Email Không Được Để Trống'],
        lowercase: true,
        validate: [validator.isEmail , 'Email Phải Đúng Định Dạng'],
    },
    password: {
        type: String,
        required: [true , 'Mâth Không Được Để Trống'],
        minLength: 0,
        select: false
    },
    passwordConfirm: { 
        type: String,
        // required: [true , 'Chưa Confirm PassWord'],
        // validate: { 
        //     validator: function(el) { 
        //         return el === this.password;
        //     },
        //     message: 'Password Confirm Không Khớp'
        // }
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/dzqbzqgjw/image/upload/v1589788981/default_user_photo_qxqjqe.png'
    },
  
    passWordChangeAt: Date,
    passWordResetToken: String,
    passWordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    create_time: {
        type: Number, 
        default: Date.now
    },
    refresh_token: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'admin', 'lead-guide'],
        default: 'user'
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    },
});

User.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;
    next();

});

User.methods.correctPassWord = async function(candidatePassword , userPassword) {
    return await bcrypt.compare(candidatePassword , userPassword);
};


User.pre('save' , function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passWordChangeAt = Date.now() - 1000;
    next();
});

User.pre('/^find/' , function(next) {
    this.find({ active: { $ne: false } });
    next();
});

User.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      console.log(changedTimestamp, JWTTimestamp);
      return JWTTimestamp < changedTimestamp;
    }
  
    return false;
  };

User.methods.createPasswordResetToken = function() { 
    const resetToken = process.env.RESET_TOKEN;
    this.passWordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);
    this.passWordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


export default mongoose.model('User', User);