const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  addCount: { type: Number, default: 0 },
  updateCount: { type: Number, default: 0 },
});

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats;
