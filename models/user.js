const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },  
    googleId: { type: String, unique: true, sparse: true }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword){
    const result = await bcrypt.compare(candidatePassword, this.password);
    return result;
}
module.exports = mongoose.model('User', userSchema);