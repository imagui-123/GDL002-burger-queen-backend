const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ProductSchema = new mongoose.Schema({
  //  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'Name field is required'],
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// eslint-disable-next-line max-len
ProductSchema.plugin(mongoosePaginate); // to tell the model itself that we should be able to request paginated list from it.
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
