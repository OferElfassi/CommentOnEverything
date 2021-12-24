const mongoose = require('mongoose');
const ImageSchema = require('./image-schema');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  password: {type: String, required: true},
  about: {type: String, default: ''},
  image: {type: ImageSchema, default: {url: '', key: ''}},
  posts: [{type: Schema.Types.ObjectId, ref: 'post'}],
  following: [{type: Schema.Types.ObjectId, ref: 'user'}],
  followers: [{type: Schema.Types.ObjectId, ref: 'user'}],
  notifications: [{type: Schema.Types.ObjectId, ref: 'notification'}],
  isManager: {type: Boolean, default: false},
});

userSchema.set('toJSON', {getters: true});
// userSchema.set('toObject',{getters:true})
userSchema.virtual('fullName').get(function () {
  return this.firstname + ' ' + this.lastname;
});

const User = mongoose.model('user', userSchema);
module.exports = User;
