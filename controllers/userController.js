const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

require('../models/User');

const User = mongoose.model('User');

/**
 * Methods:
 *  post(/) => Creates and registers user using goldenTicket
 *  get(/) => Gets list of all users
 *  get(/:id) => Gets user by id
 *  put(/:id/register) => Registers user with given ticketNumber
 *  delete(/:id) => Deletes user with given id
 */

router.post('/', (req, res) => {
  User.create(req.body).then((user) => {
    user.register(req.body.ticketNumber).then((user) => {
      res.json(user);
    }).catch((err) => {
      res.status(500).json(err);
    });
  }).catch((err) => {
    res.status(400).json(err);
  })
});

router.get('/', (req, res) => {
  User.getAll().then((users) => {
    res.json(users);
  }).catch((err) => {
    res.status(500).json(err.message);
  });
});

router.get('/:id', (req, res) => {
  User.get(req.params.id).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/:id/password', (req, res) => {
  User.changePasswordById(req.params.id, req.body.password).then((password) => {
    res.json(password);
  }).catch((err) => {
    res.status(500).json(err);
  });
});

router.put('/:id/register', (req, res) => {
  User.registerById(req.params.id, req.body.ticketNumber).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  User.delete(req.params.id).then((msg) => {
    res.json(msg);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

module.exports = router;