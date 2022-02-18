const mongoose = require('mongoose');
const Hashtag = require('../models/hashtag-model');
const Reaction = require('../models/reaction-model');
const ImageSchema = require('./image-schema');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  description: {type: String},
  createdAt: {type: Date, default: Date.now()},
  image: ImageSchema,
  reactions: [{type: Schema.Types.ObjectId, ref: 'reaction'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
  user: {type: Schema.Types.ObjectId, ref: 'user'},
  hashtag: {type: Schema.Types.ObjectId, ref: 'hashtag'},
});

postSchema.set('toJSON', {getters: true});

postSchema.static('findByHashtag', async function (hashtag) {
  const posts = await this.find({});
  const fetchedHashtag = await Hashtag.findOne({title: hashtag});

  return await posts.findOne({hashtag: fetchedHashtag._id});
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;
