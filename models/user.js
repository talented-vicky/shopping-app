const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            prodId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            qty: {type: Number, required: true}
        }]
    }
})

userSchema.methods.addtoCart = function(prod) {
    const existingCartIndex = this.cart.items.findIndex(ind => {
        return ind.prodId.toString() === prod._id.toString()
        // prodId is already a param in the cart (the other param being qty)
    })
    // the above will always yield -1 if false (i.e prod doesn't exist)
    let quantity = 1
    const updatedCartItems = [...this.cart.items]

    if(existingCartIndex >= 0){ // item exists, increment its qty
        quantity = this.cart.items[existingCartIndex].qty + 1

        // now let's replace prod existing qty with new incremented quantity
        updatedCartItems[existingCartIndex].qty = quantity
    }else{ // product is a new one
        updatedCartItems.push({prodId: prod._id, qty: quantity})            
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.deleteCart = function(productId) {
        const updatedCart = this.cart.items.filter(i => {
            return i.prodId.toString() !== productId.toString()
            // return i.prodId.toString() === productId.toString()
            // the above would yield elements that meet the callback function
        })
        this.cart.items = updatedCart
        return this.save()
}

userSchema.methods.clearCart = function() {
    this.cart.items = []
    return this.save()
}

module.exports = mongoose.model('User', userSchema)

//     /* IMPORTANT */
//     // if there are cart items on user object but no products in the database
//     // cause of deletion => update user cart to match database products
//     // i.e if we have an empty product array and we have items in the user
//     // cart, we simply reset the cart
//     // or if we have less products in db than we have in the cart, we wanna 
//     // find the difference and update the cart (not products in database)
