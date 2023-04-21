const collection = require("../configs/conf");

async function insDB(body){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const newdate = `${day}:${month}:${year}`;
    body.date = newdate;
    await collection.insertOne(body);
}

async function findAll(){
    const findA = await collection.find().toArray();
    return findA;
}

async function findOne(id){
    const findO = await collection.findOne({name: id})
    return findO;
}

module.exports = {
    insDB,
    findAll,
    findOne
};