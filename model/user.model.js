const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({

    date: {
        type: Date,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    summoner:{
        type: String,
        required: true
    }
});
const User = mongoose.model('User', userSchema, 'users');
module.exports =
{ User };