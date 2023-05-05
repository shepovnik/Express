const ObjectId = require('mongodb').ObjectId;
const dbName = require("../configs/conf");
const crypto = require('crypto');

async function insDocDB(body){
    const usersCollection = await db.collection('users');
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${day}:${month}:${year}`;
    body.date = formattedDate;
    await usersCollection.insertOne(body);
}

async function newDate(body){
    const collection = await dbName.collection('models');
    const currentDate = new Date();
    body.created_at = currentDate;
    body.updated_at = currentDate;
    await collection.insertOne(body);
}

async function findAll(){
    const collection = await dbName.collection('users');
    const findA = await collection.find().toArray();
    return findA;
}

async function findOne(id){
    const collection = await dbName.collection('users');
    const findO = await collection.findOne({_id: new ObjectId(id)});
    return findO;
}

async function postcom(req,res){
    if (req.headers['content-type'] === 'application/json'){
        body = req.body;
        if (!body.name || !body.text || body == "") {
            res.status(404).send('Error');
        }
        else{
            await insDocDB(body);
            const find = await findAll();
            res.send(find);
        }
    }
    else{
        res.status(404).send('Error');
    }
}

async function getcom(req,res){
    const find = await findAll();
    res.send(find);
}

async function getcomid(req, res){
    let usid = req.params.id;
    const result = await findOne(usid);
        if(result === null){
            res.status(404);
            res.send('Error!');
        }
        else{
            res.send(result);
        }
}

async function chApi(req, res, next){
    try{
        const collection = await dbName.collection('apikey');
        const apiKey = req.query.apiKey;
        const findApi = await collection.findOne({ _id: apiKey});
        if (findApi){
            next();
        }
        else {        
            const error = new Error("Invalid API key");
            error.statusCode = 401;
            throw error;
        }
    }
    catch (err) {
        next(err);
    }
}

async function insMod(req, res, next){
    try{
        const collection = await dbName.collection('models');
        if (req.headers['content-type'] === 'application/json'){
            const body = req.body;
            if (!body.name || !body.modelname || !body.type || !body.object || !body.overview || !body.comment || body === "" || Object.keys(body).length !== 6) {
                const error = new Error('Invalid request body');
                error.status = 400;
                throw error;
            }
            else{
                await newDate(body);
                const find =  await collection.find().toArray();
                res.send(find);
            }
        }
        else{
            const error = new Error('Invalid content-type');
            error.status = 400;
            throw error;
        }
    }
    catch (err) {
        next(err);
    }
}

async function updMod(req, res, next){
    try {
        const collection = await dbName.collection('models');
        if (req.headers['content-type'] === 'application/json'){
            body = req.body;
            if (!body.name || !body.modelname || !body.type || !body.object || !body.overview || !body.comment || body === "" || Object.keys(body).length !== 6) {
                const error = new Error('Invalid request body');
                error.statusCode = 400;
                throw error;
            }
            else{
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateDoc = {
                    $set: {
                        name: body.name,
                        modelname: body.modelname,
                        type: body.type,
                        object: body.object,
                        overview: body.overview,
                        comment: body.comment,
                        updated_at: new Date()
                    }
                };
                const result = await collection.updateOne(filter, updateDoc);
                if (result.modifiedCount === 0) {
                    const error = new Error(`Object with id ${id} not found`);
                    error.statusCode = 404;
                    throw error;
                } else {
                    const find =  await collection.find().toArray();
                    res.send(find);
                }
            }
        }
        else{
            const error = new Error('Invalid content type');
            error.statusCode = 400;
            throw error;    
        }
    }
    catch (err) {
        next(err);
    }
}

async function delMod(req, res, next){
    try{
        const collection = await dbName.collection('models');
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const foundObject = await collection.findOne(filter);
        if (!foundObject){
            const error = new Error(`Object with id: "${id}" not found`);
            error.status = 404;
            throw error;
        }
        else{
            await collection.deleteOne(filter);
            res.send(`Object with id: "${id}" deleted successfully`);
        }
    }
    catch (err) {
        next(err);
    }
}

async function newApi(body){
    try{
        const collection = await dbName.collection('apikey');
        const newapikey = crypto.randomBytes(16).toString('hex');
        if (!body || Object.keys(body).length === 0) {
            const error = new Error('Request body cannot be empty');
            error.status = 404;
            throw error;
        }
        else{
            body._id = newapikey;
            await collection.insertOne(body);
            const findApi = await collection.findOne({ _id: newapikey});
            return findApi;
        }
    }
    catch (err) {
        throw err;
    }
}

async function postApi(req, res, next){
    try{
        if (req.headers['content-type'] === 'application/json'){
            const body = req.body;
            if (!body.name || body.name === "" || Object.keys(body).length !== 1){ 
                const error = new Error('Invalid request body');
                error.statusCode = 400;
                throw error;
            }
            else{
                const findApi = await newApi(body);
                res.send(findApi);
            }
        }
        else{
            const error = new Error('Invalid content type');
            error.statusCode = 400;
            throw error; 
        }
    }
    catch (err) {
        next(err);
    }
}

async function findM(req, res, next){
    try{
        const collection = await dbName.collection('models');
        const findAll = await collection.find().toArray();
        if (findAll === 0){
            const error = new Error('No models found');
            error.status = 404;
            throw error;
        }
        else{
            res.send(findAll);
        }
    }
    catch (err) {
        next(err);
    }
}

async function findOneM(req, res, next){
    try{
        const collection = await dbName.collection('models');
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const foundObject = await collection.findOne(filter);
        if (!foundObject){
            const error = new Error('No models found');
            error.status = 404;
            throw error;
        }
        else{
            res.send(foundObject);   
        }
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    getcom,
    getcomid,
    postcom,
    postApi,
    chApi,
    insMod,
    updMod,
    delMod,
    findM,
    findOneM
}