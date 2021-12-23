const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
  content: {type: String},
  createdAt: {type: Date, default: Date.now()},
  user: {type: Schema.Types.ObjectId, ref: 'user'},
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;
