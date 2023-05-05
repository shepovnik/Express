const express = require("express");
const cont = express.Router();
const { getcom, getcomid, postcom, postApi, chApi, insMod, updMod, delMod, findM, findOneM  } = require('../services/serv');

const jsonParser = express.json();

cont.post('/comments',jsonParser, postcom);

cont.get('/comments', getcom);

cont.get('/comments/:id', getcomid);

cont.post('/apikey', jsonParser, postApi);

cont.get('/models/', findM);

cont.post('/models', chApi, jsonParser, insMod);

cont.get('/models/:id', findOneM);

cont.put('/models/:id', chApi, jsonParser, updMod);

cont.delete('/models/:id', chApi, delMod);

module.exports = cont;