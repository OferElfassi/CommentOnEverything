const mongoose = require('mongoose')
const Schema =mongoose.Schema

const ImageSchema = new Schema({
    url:String,
    key:String
})

module.exports = ImageSchema
