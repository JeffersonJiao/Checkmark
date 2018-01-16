const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const checkmarkSchema = new Schema({
    checkmarkcode: String,
    user_id: String,
    item: String,
    poster_id: String,
    poster_name: String,
})
checkmarkSchema.plugin(timestamps);
const Checkmark = mongoose.model('checkmark',checkmarkSchema);

module.exports = Checkmark;