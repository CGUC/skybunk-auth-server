require('../models/GoldenTicket');

const mongoose = require('mongoose');
const GoldenTicket = mongoose.model('GoldenTicket');

const _ = require('lodash');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const ServerSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  }
});

ServerSchema.statics.get = function (id) {
  id = ObjectId(id);

  return new Promise((resolve, reject) => {
    this.findById(id).then((server) => {
      if (server) {
        resolve(server);
      } else {
        reject(Error('Couldn\'t find a server with that ID'));
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

ServerSchema.statics.getAll = function () {
  return new Promise((resolve, reject) => {
    this.find().then((servers) => {
      resolve(servers);
    }).catch((err) => {
      reject(err);
    });
  });
};

ServerSchema.statics.updateServer = function (id, updatedServerObj) {
  id = ObjectId(id);

  return new Promise((resolve, reject) => {
    this.findOneAndUpdate({ "_id": id }, { "$set": updatedServerObj}, (err, server) => {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        resolve(server);
      }
    });
  });
};

ServerSchema.statics.getTickets = function (id) {
  return new Promise((resolve, reject) => {
    GoldenTicket.find({server: id}).then((tickets) => {
      resolve(tickets.map((ticket) => {
        return ticket.ticketNumber;
      }));
    }).catch((err) => {
      reject(err);
    });
  });
};

ServerSchema.statics.addTickets = function (id, count) {
  return new Promise((resolve, reject) => {
    this.findById(id).then((server) => {
      GoldenTicket.generateTickets(server, count).then((tickets) => {
        resolve(tickets.map((ticket) => {
          return ticket.ticketNumber;
        }));
      }).catch((err) => {
        reject(err);
      })
    });
  });
};

ServerSchema.statics.delete = function (id) {
  return new Promise((resolve, reject) => {
    this.deleteOne({ _id: id }).then(() => {
      GoldenTicket.deleteMany({server: id}).then(() => {
        resolve('Successfully deleted server');
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

mongoose.model('Server', ServerSchema);