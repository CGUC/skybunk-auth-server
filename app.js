// Import our node modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize express app
const app = express();

// Connect to mongodb
// connect returns a Promise object - get used to these.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// Due to the asyrnchonous nature of nodeJs, a promise allows us to safely execute code only
// once a certain operation has finished
// For example, in this case the function passed into the .then clause is only
// executed once the .connect(...) call has finished.
// If something fails within the .connnect(...) call then the code passed in to the
// .catch clause is executed instead.
const db = require('./config/database');

mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Initialize the Middleware for our imported node modules
// Middleware is a function(s) that occur before every HTTP request
// so certain modules require us to use their middleware in order
// for them to work
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set preflight headers to allows cors
app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'content-type, page, authorization');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, DELETE');
  next();
});

const serverController = require('./controllers/serverController');

app.use('/servers', serverController);

// Start the server on port 3000
// Use the port environment variable (needed for heroku) or 300 (dev)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
