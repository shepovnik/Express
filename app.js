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

app.listen(port, hostname, () => {
    console.log(`Server is running on https://${hostname}:${port}`);
})

app.use((req, res) => {
    res.status(404).send('"400 Bad Request"');
})

app.use((err, req, res) => {
    res.status(500).send('"400 Bad Request serve"')
})
