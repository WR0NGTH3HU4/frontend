const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const bookRoutes = require('./modules/books');

app.use(cors());
app.use(express.json()); // Ezt add hozzá a JSON adatok fogadásához

// routes
app.use('/books', bookRoutes);

// get API version
app.get('/', (req, res) => {
    res.send(`API version: ${process.env.VERSION}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
