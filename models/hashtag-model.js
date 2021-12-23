const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hashtagSchema = new mongoose.Schema({
    title: { type: String },
    posts: [{ type: Schema.Types.ObjectId, ref: "post" }],
});
const Hashtag = mongoose.model("hashtag", hashtagSchema);
module.exports = Hashtag;