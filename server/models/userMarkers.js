import mongoose from 'mongoose';

const userMarkersSchema = mongoose.Schema({
  _id: { type: String },
  markersGeoJson: { type: Object, required: true }
});

if (!userMarkersSchema.options.toObject) userMarkersSchema.options.toObject = {};

userMarkersSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.__v;
  const id = ret._id;
  delete ret._id;
  ret.userId = id;
}

userMarkersSchema.virtual('userId').get(function() {
    return this._id;
});

userMarkersSchema.virtual('userId').set(function(userId) {
    this._id = userId;
});

export default mongoose.model('UserMarkers', userMarkersSchema);