const mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
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
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);