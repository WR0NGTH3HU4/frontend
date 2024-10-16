require('dotenv').config();
var cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT;
const stepRoutes = require('./modules/steps');
const logger = require('./modules/logger');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
app.use('/users', userRoutes); 
app.use('/steps', stepRoutes);

// get API version
app.get('/', (req, res) => {
  res.send(`API version : ${process.env.VERSION}`);
});


app.listen(port, () => {
  logger.info(`Server listening on port ${port}...`);
});
