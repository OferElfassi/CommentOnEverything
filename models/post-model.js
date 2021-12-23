const mongoose = require('mongoose');
const Hashtag = require('../models/hashtag-model');
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema({
  description: {type: String},
  createdAt: {type: Date, default: Date.now()},
  imageUrl: {type: String},
  reactions: [{type: Schema.Types.ObjectId, ref: 'reaction'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  hashtag: {type: Schema.Types.ObjectId, ref: 'hashtag'},
});
postSchema.static('findByHashtag', async function (hashtag) {
  const posts = await this.find({});
  const fetchedHashtag = await Hashtag.findOne({title: hashtag});

  return await posts.where({hashtag: fetchedHashtag._id});
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;