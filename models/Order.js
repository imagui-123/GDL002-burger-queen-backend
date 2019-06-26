const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// const Product = require('./Product');
// let statusType={
//   values: ['pending','preparing', 'delivering', 'delivered'],
//   message: '{Value} no es válido',
// }

const OrderSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  quantity: [{
    type: Number,
    default: 1,
  }],
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivering', 'delivered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});


OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
