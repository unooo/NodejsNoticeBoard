const mongoose = require('mongoose');

const { Schema } = mongoose;
const messageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,    
    ref : 'User',
  },
  sender: {
    type: String,
    required: true,    
    ref : 'User',
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);