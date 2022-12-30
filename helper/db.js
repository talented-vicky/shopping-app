const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient

const mongodbUrl = "mongodb+srv://talented_vicky:DameeBlaq@talented-vicky.uaveq.mongodb.net/shop?retryWrites=true&w=majority"

let _db;

const mongoDBConnect = callback => {
    mongoClient.connect(mongodbUrl) // connecting
        .then(client => {
            console.log("successfully connected to mongoDB")
            _db = client.db() // storing connection to database
            // needs parameter if no db name specified in mongodbUrl
            callback()
        })
        .catch(err => {
            console.log(err)
            throw err
        })
};

const getDb = () => {
    // returning access to the database connection if it exists
    if(_db){
        return _db
    }
    throw "No databse found"
};

exports.mongoDBConnect = mongoDBConnect;
exports.getDb = getDb;  