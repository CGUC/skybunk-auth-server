const mongoose = require('mongoose');

const { Schema } = mongoose;

const GoldenTicketSchema = new Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  server: {
    type: Schema.Types.ObjectId,
    ref: 'Server'
  }
});

GoldenTicketSchema.statics.generateTickets = function (server, count) {
  const promises = [];
  for (let i = 0; i < count; i++) {
    const ticket = new this({
      ticketNumber: Math.random().toString(36).substring(2),
      server: server
    });
    promises.push(ticket.save());
  };

  return Promise.all(promises);
};

GoldenTicketSchema.statics.verifyTicket = function (ticketNumber) {
  return new Promise((resolve, reject) => {
    this.findOne({ ticketNumber }).then((ticket) => {
      resolve(ticket);
    }).catch((err) => {
      reject(err);
    });
  });
};

mongoose.model('GoldenTicket', GoldenTicketSchema);