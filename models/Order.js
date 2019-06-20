const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
// const Product = require('./Product');

let statusType={
  values: ['pending','preparing', 'delivering', 'delivered'],
  message: '{Value} no es válido',
}

const OrderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  statusOrder: {
    type: statusType,
    default:'pending'
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


OrderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;