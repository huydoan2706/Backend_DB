const express = require('express');
require('dotenv').config();
const vehiclesIn = require('./routes/vehicles_in');
const vehiclesOut = require('./routes/vehicles_out');
const history = require('./routes/history');

const app = express();
app.use(express.json());

app.use('/vehicles-in', vehiclesIn);
app.use('/vehicles-out', vehiclesOut);
app.use('/history', history);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
