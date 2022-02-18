const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hashtagSchema = new mongoose.Schema({
  title: {type: String},
  posts: [{type: Schema.Types.ObjectId, ref: 'post'}],
});
hashtagSchema.set('toJSON', {getters: true});
const Hashtag = mongoose.model('hashtag', hashtagSchema);
module.exports = Hashtag;
