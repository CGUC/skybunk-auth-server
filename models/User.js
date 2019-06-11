require('../models/Server');
require('../models/GoldenTicket');

const mongoose = require('mongoose');
const Server = mongoose.model('Server');
const GoldenTicket = mongoose.model('GoldenTicket');

const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  servers: [{
    type: Schema.Types.ObjectId,
    ref: 'Server'
  }]
});

UserSchema.statics.get = function (id) {
  return new Promise((resolve, reject) => {
    this.findById(id).populate('servers').select('-password').then((user) => {
      if (user) {
        resolve(user);
      } else {
        reject(Error('Couldn\'t find a user with that ID'));
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.statics.getAll = function () {
  return new Promise((resolve, reject) => {
    this.find().populate('servers').select('-password').then((servers) => {
      resolve(servers);
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.statics.create = function(user, ticketNumber) {
  return new Promise((resolve, reject) => {
    const newUser = new this(user);
    newUser.servers = [];

    // Encrypt the password and save
    newUser.changePassword(newUser.password).then(() => {
      resolve(newUser);
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.statics.changePasswordById = function(id, newPassword) {
  return new Promise((resolve, reject) => {
    this.findById(id).then((user) => {
      user.changePassword(newPassword).then((password) => {
        resolve(password);
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.methods.changePassword = function (newPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          this.password = hash;
          this.servers.forEach((serverId) => {
            Server.findById(serverId).then((server) => {
              server.changeUserPassword(this, newPassword);
            });
          });
          this.save().then(() => {
            resolve(hash);
          }).catch((err) => {
            reject(err);
          });
        }
      });
    });
  });
};

UserSchema.statics.registerById = function(id, ticketNumber) {
  return new Promise((resolve, reject) => {
    this.findById(id).then((user) => {
      user.register(ticketNumber).then(() => {
        resolve(user);
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.methods.register = function(ticketNumber) {
  return new Promise((resolve, reject) => {
    GoldenTicket.findOne({ticketNumber}).then(async (ticket) => {
      if (!ticket) {
        reject('Not a valid ticket');
      } else {
        this.servers.push(ticket.server);
        const user = await this.save();
        await ticket.remove();
        user.populate('servers', (err) => {
          if (err)
            reject(err);
          else
            resolve(user);
        });
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

UserSchema.statics.login = function (username, password) {
  return new Promise((resolve, reject) => {
    this.findOne({username}).then((user) => {
      if (!user) {
        reject(Error('Username does not exist'));
      } else {
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (isMatch && !err) {
            user.populate('servers', (err) => {
              if (err)
                reject(err);
              else
                resolve(user);
            });
          } else {
            reject(Error('Password is incorrect'));
          }
        });
      }
    });
  });
};

UserSchema.statics.delete = function (id) {
  return new Promise((resolve, reject) => {
    this.deleteOne({_id: id}).then((usr) => {
      resolve('Successfully removed user');
    }).catch((err) => {
      reject(err);
    });
  });
};

mongoose.model('User', UserSchema);