const Hashtag = require('../models/hashtag-model');
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");

const signFirstManager = async () => {
    const user = await User.findOne({email: "admin@gmail.com"})
    if (user) return
    const hashedPassword = await bcrypt.hash("admin", 12);
    const newUser = await new User({
        firstname: "Ofer",
        lastname: "Elfassi",
        email: "admin@gmail.com",
        password: hashedPassword,
        isManager: true,
    });
    await newUser.save();
}

const databaseInitialization = async () => {
    await signFirstManager()
    let firstHashtag = Hashtag.find({title: 'General'});
    if (!firstHashtag) {
        const firstHashtag = new Hashtag({title: 'General'});
        await firstHashtag.save();
    }
};

module.exports = databaseInitialization;
