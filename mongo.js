const MongoClient = require('mongodb').MongoClient;

const urlMongo = 'mongodb://127.0.0.1:27017/blog';

const client = new MongoClient(urlMongo);

module.exports = client;
