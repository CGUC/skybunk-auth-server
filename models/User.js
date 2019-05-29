require('../models/Server');

const mongoose = require('mongoose');
//const Server = mongoose.model('Server');

const _ = require('lodash');

const { Schema } = mongoose;
//const { ObjectId } = mongoose.Types;

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

UserSchema.statics.register = function(user) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate({username: user.username}, user, {new: true})
  });
};

mongoose.model('User', UserSchema);