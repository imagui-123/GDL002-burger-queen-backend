const express = require('express');

const Order = require('../models/Order');
const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

// const app = express();

module.exports=(app, next) =>{

app.get('/order', requireAdmin, (req, res) => {
  Order.find({})
    .sort([['createdAt', -1]])
    .populate('product User')
    .then((Order) => {
      res.send(Order);
    });
});


app.get('/order/:orderId', requireAuth, (req, res) => {
  Order.findById(req.params.orderId)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          order: doc,
        });
      } else {
        res.status(401)
          .json({ message: 'No valid entry found for order id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// add a new order to the db
app.post('/order', requireAuth, (req, res, next) => {
  Order.create(req.body)
    .then((order) => {
      res.send(order);
    })
    .catch(next);
});


// update an order in the db
app.put('/order/:id', requireAuth, (req, res, next) => {
  Order.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() => {
    Order.findOne({ _id: req.params.id }).then((order) => {
      res.send(order);
    });
  }).catch(next);
});

// delete an order from the db
app.delete('/order/:id', requireAuth, (req, res, next) => {
  Order.findByIdAndRemove({ _id: req.params.id })
    .then((doc) => {
      if (doc) {
        res.status(201)
          .json({ message: 'Order deleted' });
      } else {
        res.status(401)
          .json({ message: 'No valid entry' });
      }
    }).catch(next);
});

}
