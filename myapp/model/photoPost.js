const mongoose = require('mongoose');

const { Schema } = mongoose;
const photoPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,    
    ref : 'User',
  },
  hashTag:[{ type: mongoose.Schema.Types.ObjectId, ref: 'HashTag' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PhotoPost', photoPostSchema);