const express = require("express");

const restapi = require("./router/rest");

const hostname = "127.0.0.1";
const port = 3000;

const app = express();

app.use(express.static('public'));
app.use(restapi);

app.listen(port, hostname, () => {
    console.log(`Server is running on https://${hostname}:${port}`);
})