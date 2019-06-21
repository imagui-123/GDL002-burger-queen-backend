/* eslint-disable arrow-parens */
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const app = express();


// get a list of products from the db
app.get('/product', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          _id: doc.id,
        })),
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

// add a new product to the db
app.post('/product', (req, res, next) => {
  // console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
        },
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
});

// update a product in the db
app.get('/product/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
        });
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for product id' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

app.put('/product/:id', (req, res, next) => {
  Product.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
    Product.findOne({ _id: req.params.id }).then((product) => {
      res.send(product);
    });
  }).catch(next);
});


// delete a product from the db
app.delete('/product/:id', (req, res, next) => {
  Product.findByIdAndRemove({ _id: req.params.id }).then((product) => {
    res.send(product);
  }).catch(next);
});

module.exports = app;
