const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const app = express();
require('dotenv').config()
const morgan = require('morgan')
const port = process.env.PORT || 5000;

// /middleware 
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.send('Hello World');
});
















// mongodb end
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})