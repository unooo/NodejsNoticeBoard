const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
const { Schema } = mongoose;
const hashtagSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
hashtagSchema.plugin(findOrCreate);
module.exports = mongoose.model('HashTag', hashtagSchema);