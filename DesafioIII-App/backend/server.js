
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/geoapp')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

const Report = require('./models/Report');
const reportsRouter = require('./routes/reports');

app.use('/reports', reportsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta', PORT));
