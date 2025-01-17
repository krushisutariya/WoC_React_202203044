const mongoose=require('mongoose');

const CoderSchema= new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})


const CoderModel = mongoose.model("coders",CoderSchema);
module.exports = CoderModel;