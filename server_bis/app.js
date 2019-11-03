'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
// const routes = require("./routes");
const dotenv = require('dotenv');
dotenv.config();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
const cors = require('cors');

const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const canvaRoutes = require("./routes/canva");
const stripeRoutes = require("./routes/stripe");
const adminRoutes = require("./routes/admin");

const preSuspendUsers = require("./jobs/jobs").preSuspendUsers;
const suspendUsers = require("./jobs/jobs").suspendUsers;



// configuring options for cors, for the client to access the full Headers
const corsOptions = {
  exposedHeaders: "*"
}

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// for postgres
// import models, { sequelize } from './server/models';
// import { sequelize } from './server/models';
const { sequelize } = require('./server/models');

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup bodyParser which allows us to use req.body
// app.use(bodyParser()); ==> deprecated, replaced by below
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("body-parser").text());


// setup cors
app.use(cors(corsOptions));


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'screenshots'))); // hm, what ?
// app.use(express.static('screenshots'));


// TODO setup your api routes here
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/canvas', canvaRoutes);
app.use('/stripe', stripeRoutes);
app.use('/admin', adminRoutes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
// app.set('port', process.env.PORT || 5000);
app.set('port', process.env.PORT);

/************************
JOBS
************************/
preSuspendUsers();
suspendUsers();


// // start listening on our port
// const server = app.listen(app.get('port'), '0.0.0.0', () => {
//   console.log(`Express server is listening on port ${server.address().port}`);
// });

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
  });
});
