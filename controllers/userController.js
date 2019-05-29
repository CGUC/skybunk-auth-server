const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

require('../models/User');

const User = mongoose.model('User');

/**
 * Methods:
 *  post(/) => Registers user using goldenTicket
 *  get(/) => Gets list of all users
 *  get(/:id) => Gets user by id
 *  put(/:id) => Updates user with given id
 *  delete(/:id) => Deletes user with given id
 */

// TODO: Add something to prove caller is legit
router.post('/', (req, res) => {
  User.register(req.body).then((user) => {
    res.json(user);
  }).catch((err) => {
    res.status(400).json(err);
  })
});

router.get('/', (req, res) => {
  Server.getAll().then((servers) => {
    res.json(servers);
  })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

router.get('/:id', (req, res) => {
  Server.get(req.params.id).then((server) => {
    res.json(server);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  Server.updateServer(req.params.id, req.body).then((server) => {
    res.json(server);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.get('/:id/tickets', (req, res) => {
  Server.getTickets(req.params.id).then((server) => {
    res.json(server);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.put('/:id/tickets', (req, res) => {
  Server.addTickets(req.params.id, req.body.count).then((tickets) => {
    res.json(tickets);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  Server.delete(req.params.id).then((msg) => {
    res.json(msg);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

module.exports = router;