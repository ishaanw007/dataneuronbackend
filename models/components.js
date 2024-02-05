const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  componentId: { type: Number, required: true },
  data: String,
});

const Component = mongoose.model('Component', componentSchema);

module.exports = Component;
