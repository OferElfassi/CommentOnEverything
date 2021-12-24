const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reactionSchema = new mongoose.Schema({
    like: { type: Boolean, default: false },
    report: { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now()},
    user: { type: Schema.Types.ObjectId, ref: "user"},
});

const Reaction = mongoose.model("reaction", reactionSchema);
module.exports = Reaction;
