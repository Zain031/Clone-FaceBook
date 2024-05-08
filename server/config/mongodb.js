require("dotenv").config()
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const uri = process.env.MONGO_URI


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const database = client.db("database_fb")



module.exports = database

