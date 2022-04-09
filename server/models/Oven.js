const { Schema } = require('mongoose');
// require Item schema as base
const Item = require('./Item');

const ovenSchema = new Schema({
  startedAtTime: {
    type: Date,
  },
  duration: {
    type: Number,
    min: 0,
  },
  isReady: {
    type: Boolean,
  },
});

module.exports = ovenSchema;
