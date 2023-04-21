const express = require("express");
const cont = express.Router();
const {insDB, findAll, findOne} = require("../services/serv");
const urlencodedParser = express.urlencoded({extended: false});

cont.get('/comments', async (req,res) => {
    const find = await findAll();
    res.send(find);
})

cont.get('/comments/:id', async (req,res) => {
    let id = req.params.id;
    const result = await findOne(id);
    if (result === null){
        res.status(404);
        res.send('Error');
    }
    else{
        res.send(result)
    }
})

cont.post('/comments', urlencodedParser, async (req,res) => {
    if (!req.body) return res.status(404).send(Error);
    body = req.body;
    await insDB(body);
    console.log(insDB);
    res.send('Данные добавлены');
})

module.exports = cont;