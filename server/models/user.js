import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

if (!userSchema.options.toObject) userSchema.options.toObject = {};

userSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.__v;
  delete ret.password;
  const id = ret._id;
  delete ret._id;
  ret.id = id;
}

export default mongoose.model('User', userSchema);