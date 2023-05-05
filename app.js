const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const restapi = require("./router/rest");
const contAPI = require("./controllers/cont")

const hostname = "127.0.0.1";
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.static('public'));
app.use('/v1', restapi);
app.use('/mongaka', contAPI);

app.use(function (err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ message: message });
})

app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
})