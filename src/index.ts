import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routesV1 from './routes/v1';

dotenv.config();

declare global {
  namespace Express {
    export interface Request {
      sessionData: any;
    }
  }
}

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

routesV1(app);

const { PORT } = process.env;

mongoose
  .connect(process.env.MONGO!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('conected to mongo db');

    app.listen(PORT, () => {
      console.log(`running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('error', error);
  });

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');

// dotenv.config();

// const routesV1 = require('./routes/v1');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.json());

// routesV1(app);

// const { PORT } = process.env;

// mongoose
//   .connect(process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('conected to mongo db');

//     app.listen(PORT, () => {
//       console.log(`running on ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log('error', error);
//   });
