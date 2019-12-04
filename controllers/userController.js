const express = require('express');

const HttpErrors = require('http-errors');

const router = express.Router();
const mongoose = require('mongoose');

require('../models/User');

const User = mongoose.model('User');

/**
 * Methods:
 *  post(/) => Creates and registers user using goldenTicket
 *  get(/) => Gets list of all users
 *  get(/:id) => Gets user by id
 *  put(/:id/register) => Registers user with given goldenTicket
 *  delete(/:id) => Deletes user with given id
 *  post(/login) => login a user (return the user document)
 */

router.post('/', (req, res) => {
  User.create(req.body).then((user) => {
    res.json(user);
  }).catch((err) => {
    if (err instanceof HttpErrors.HttpError) {
      res.status(err.status).json(err.message);
    } else {
      res.status(500).json(err);
    }
  });
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
  User.registerById(req.params.id, req.body.goldenTicket).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.post('/login', (req, res) => {
  User.login(req.body.username, req.body.password).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(err.code).json({err});
  });
});

/* TODO: re-add delete endpoint once security becomes a thing
router.delete('/:id', (req, res) => {
  User.delete(req.params.id).then((msg) => {
    res.json(msg);
  }).catch((err) => {
    res.status(400).json(err);
  });
});
*/
module.exports = router;
