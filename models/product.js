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
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // the order doesn't matter since its a js obj
})

module.exports = mongoose.model('Product', productSchema)

// // remember a normal class method is called on the object itself
// // a static method (on the other hand) is called on the instantiated class