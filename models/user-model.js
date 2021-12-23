const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true},
    about: {type: String,default:""},
    imageUrl: {type: String,default:""},
    posts:[ {type: Schema.Types.ObjectId, ref: "post"} ],
    following:[ {type: Schema.Types.ObjectId, ref: "user"} ],
    followers:[ {type: Schema.Types.ObjectId, ref: "user"} ],
    notifications: [{type: Schema.Types.ObjectId, ref: "notification"}],
    isManager: {type: Boolean,default:false}
});

userSchema.virtual("fullName").get(function () {
    return this.firstName+" "+this.lastName;
})

const User = mongoose.model("user", userSchema);
module.exports = User;
