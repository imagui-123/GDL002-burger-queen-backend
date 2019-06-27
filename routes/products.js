/* eslint-disable arrow-parens */
// const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// const app = express();
const {
  requireAuth,
  requireAdmin,
  isAdmin,
} = require('../middleware/auth');

// module.exports = (app, next, test) => {
//   app.get('/products', (request, response) => {
//     response.json({ hola: 'hola' });
//   });
//   typeof next === 'function' ? next() : test();
// };


module.exports = (app, next, secondNext) => {
  // get a list of products from the db
  app.get('/products', requireAdmin, (req, res) => {
    console.log('products');
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
  app.post('/products', requireAdmin, (req, res, next) => {
    if (!isAdmin(req)) {
      res.status(403).json({
        message: 'Require admin',
      });
    }
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
      .catch(err => (
        (/duplicate key/.test(err.message))
          ? next(403)
          : next(500)
      ));
  });

  // update a product in the db
  app.get('/products/:productId', requireAuth, (req, res) => {
    const id = req.params.productId;
    Product.findById(id)
      .select('name price _id')
      .exec()
      .then(doc => {
        console.log('From database', doc);
        if (doc) {
          res.status(201).json({
            product: doc,
          });
        } else {
          res
            .status(401)
            .json({ message: 'No valid entry found for product id' });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });

  app.put('/products/:id', requireAdmin, (req, res, next) => {
    if (req.body.roles && !isAdmin(req)) {
      console.log(isAdmin);
      return next(403);
    }
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body)
      .then(() => {
        Product.findOne({ _id: req.params.id })
          .then((product) => {
            res.send(product);
          });
      }).catch(next);
  });

  // delete a product from the db
  app.delete('/products/:id', requireAdmin, (req, res, next) => {
    Product.findByIdAndRemove({ _id: req.params.id }).then((product) => {
      res.send(product);
    }).catch(next);
  });

  return typeof next === 'function' ? next() : secondNext();
};
