const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true });

client.connect();
console.log('Успешное соединение с БД');
const dbName = client.db('mangaka');
const collection = dbName.collection('users');

module.exports = collection;