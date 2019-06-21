const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// const Product = require('./Product');

const OrderSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  statusOrder: {
    type: String,
    enum: ['Pending', 'Preparing', 'Delivering', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;