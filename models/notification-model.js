const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
  message: {type: String},
  createdAt: {type: Date, default: Date.now()},
  post: {type: Schema.Types.ObjectId, ref: 'post'},
});

notificationSchema.set('toJSON', {getters: true});
const Notification = mongoose.model('notification', notificationSchema);
module.exports = Notification;
