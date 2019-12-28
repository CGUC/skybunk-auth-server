require('../models/GoldenTicket');

const mongoose = require('mongoose');
const GoldenTicket = mongoose.model('GoldenTicket');

const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
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
    unique: true
  },
  accessKey: {
    type: String,
    required: true
  }
});

ServerSchema.statics.create = async function(server) {
  const newServer = new this(server);

  // Encrypt the password and save
  const accessKey = uuidv4();
  const salt = bcrypt.genSaltSync(10);
  newServer.accessKey = bcrypt.hashSync(accessKey, salt);
  await newServer.save();

  newServer.accessKey = accessKey;
  return newServer;
};

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

ServerSchema.statics.verifyAccessKey = async function (id, accessKey) {
  try {
    const server = await this.findById(id, 'accessKey');
    if (server) {
      return bcrypt.compareSync(accessKey, server.accessKey);
    }
  } catch (err) {
    }
  return false;
}

mongoose.model('Server', ServerSchema);