const express = require('express');
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Product = require('../models/Product');

const app = express();

// get a list of orders from the db
app.get('/order', (req, res, next) => {
  Order.find()
    .select('product quantity _id statusOrder createdAt')
    .sort([['createdAt', -1]])
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          statusOrder: doc.statusOrder,
          createdAt: doc.createdAt,
        })),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// add a new order to the db
app.post('/order', (req, res, next) => {
  //  Product.findById(req.body.productId)
  const _id = req.body.productId;
  console.log(`id${ _id}`);
  
  Product.findOne(_id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
          
        });
      }
      console.log(req.body.productId)
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err,
      });
  });
});

//update an order in the db
app.put('/order/:id', (req, res, next) => {
  Order.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
    Order.findOne({_id: req.params.id}).then((order) =>{
      res.send(order);
    });
  }).catch(next);
});

//delete an order from the db
app.delete('/order/:id', (req, res, next) => {
  Order.findByIdAndRemove({_id: req.params.id})
    .then((order) =>{
      res.send(order);
    }).catch(next);
});

module.exports = app;
