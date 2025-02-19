import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        refreshToken: { type: String },
    },
    { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log("Введений пароль:", candidatePassword);
    console.log("Хеш пароля в базі:", this.password);
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.setRefreshToken = function (token) {
    this.refreshToken = token;
    return this.save();
};

userSchema.methods.clearRefreshToken = function () {
    this.refreshToken = null;
    return this.save();
};

export const User = mongoose.model("User", userSchema);