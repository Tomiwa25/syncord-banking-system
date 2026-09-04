const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    role: {
        type: String,
        enum: ["CUSTOMER", "ADMIN", "OPERATIONS", "SUPPORT"], default: "CUSTOMER"
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        delete returnedObject.password;
        return returnedObject;
    },
});

const user = mongoose.model('User', userSchema);

module.exports = user;
