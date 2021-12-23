const mongoose = require("mongoose");

const Hashtag = require("../models/hashtag-model");

const {DB_NAME} = require("../config/keys");

const databaseInitialization = async () => {
    // if (mongoose.connection.collections[DB_NAME]) {
    //     await mongoose.connection.collections[DB_NAME].drop();
    // }
    let firstHashtag = Hashtag.find({title: "General"})
    if(!firstHashtag){
        const firstHashtag = new Hashtag({title: "General"})
        await firstHashtag.save()
    }

}

module.exports = databaseInitialization
