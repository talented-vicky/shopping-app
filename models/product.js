const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
    // the order doesn't matter since its a js obj
})

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')

// module.exports = class Product {
//     constructor(tit, img, price, des, id, userId){
//         this.title = tit,
//         this.imageUrl = img,
//         this.price = price,
//         this.description = des,
//         this._id = id ? new mongodb.ObjectId(id) : null,
//         // calling auto assigned mongodb Id and setting it as a parameter
//         // then set null if that parameter doesn't already exist
//         this.userId = userId
//     }
 
//     save() {
//         const db = getDb()
//         let dbUpdate;
//         if(this._id){ // confirming if an element with this id exists
//             dbUpdate = db
//                 .collection('products')
//                 .updateOne({_id: this._id}, {$set: this})
//         }else{
//             dbUpdate = db
//                 .collection('products')
//                 .insertOne(this)
//         }
//         return dbUpdate 
//             .then(result => {
//                 console.log(result)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     };

//     static fetchAll() {
//         const db = getDb()
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then(products => {
//                 return products
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     };

//     static findbyId(id) {
//         const db = getDb()
//         return db.collection('products')
//             .find({_id: new mongodb.ObjectId(id)})
//             .next() 
//             // .find() always returns a cursor so we're simply getting the first
//             // .findOne({_id: new mongodb.ObjectId(id)})
//             //the above wouldn't require a next() since there's no cursor
//             .then(product => {
//                 return product
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     };

//     static deletebyId(id) {
//         const db = getDb()
//         return db.collection('products')
//             .deleteOne({ _id: new mongodb.ObjectId(id)})
//             .then(() => {
//                 alert('Deleted!')
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }
// }

// // remember a normal class method is called on the object itself
// // a static method (on the other hand) is called on the instantiated class