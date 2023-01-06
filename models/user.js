const getDB = require('../helper/db').getDb
const mongodb = require('mongodb')

module.exports = class User {
    constructor(first_name, last_name, email, cart, id){
        this.firstname = first_name,
        this.lastname = last_name,
        this.email = email,
        this.cart = cart, // cart = {items: []}
        this._id = id
    }

    save(){
        const db = getDB()
        return db.collection('users')
            .insertOne(this)
            .then(user => {
                console.log(`successfully created ${user.firstname}`)
            })
            .catch(err => {
                console.log(err)
            })
    }
    
    addtoCart(prod){        
        // checking if product exist
        const existingCartIndex = this.cart.items.findIndex(ind => {
            return ind.prodId.toString() === prod._id.toString()
            // prodId is already a param in the cart (the other param being qty)
        })
        // the above will always yield -1 if false (i.e prod doesn't exist)
        let quantity = 1
        const updatedCartItems = [...this.cart.items]

        if(existingCartIndex >= 0){
            // this means item exists, so let's just increment its qty
            quantity = this.cart.items[existingCartIndex].qty + 1

            // now let's replace prod existing qty with new incremented quantity
            updatedCartItems[existingCartIndex].qty = quantity
        }else{
            // product is a new one
            // let's just push this new product into the cart
            updatedCartItems.push({prodId: new mongodb.ObjectId(prod._id), qty: 1})            
        }
        const db = getDB()
        const updatedCart = {
            items: updatedCartItems
        }
        db.collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)}, 
                {$set: {cart: updatedCart}}
            )
            .then()
            .catch(err => {
                console.log(err)
            })
    }

    getCart(){
        const db = getDB()
        const prodIds = this.cart.items.map(i => {
            return i.prodId
        }) // this actually returns an array

        return db.collection('products')
            .find({_id: {$in: prodIds}}) //chekn if id exists in prodIds array
            .toArray() // converts output to js array
            .then(prods => {
                return prods.map(prod => {
                    return {
                        ...prod, 
                        qty: this.cart.items.find(i => {
                            return i.prodId.toString() === prod._id.toString()
                        }).qty
                    }
                })
            })
    }
    /* IMPORTANT */
    // if there are cart items on user object but no products in the database
    // cause of deletion => update user cart to match database products
    // i.e if we have an empty product array and we have items in the user
    // cart, we simply reset the cart
    // or if we have less products in db than we have in the cart, we wanna 
    // find the difference and update the cart (not products in database)

    deleteProdFromCart(productId) {
        const updatedCart = this.cart.items.filter(i => {
            return i.prodId.toString() !== productId.toString()
            // return i.prodId.toString() === productId.toString()
            // the above would yield elements that meet the callback function
        })
        const db = getDB()
        return db.collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: {items: updatedCart}}}
            )
            .then(result => {
                console.log('deleted from cart successfully')
            })
            .catch(err => {
                console.log(err)
            })
    }

    addOrder(){
        const db = getDB()
        return this.getCart()
        // fetch cart so as to pull all products in it
            .then(prods => {
                // save product infor in items key and embed user info also
                const orders = {
                    items: prods,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.firstname
                    }
                }
                return db.collection('orders').insertOne(orders)
            })
            .then(result => {
                this.cart = {items: []}
                return db.collection('users').updateOne(
                        {_id: new mongodb.ObjectId(this._id)},
                        {$set: {cart: {items: []}}}
                    )
                // set cart empty after placed in order collection
            })
            .catch(err => console.log(err))
    }

    getOrder(){
        const db = getDB()
        return db.collection('orders')
            .find({"user._id": new mongodb.ObjectId(this._id)})
            // the 1st param is us accessing the _id key nested in user obj
            .toArray()
            .then()
            .catch(err => {
                console.log(err)
            })
    }

    static findbyId(userId){
        const db = getDB()
        return db.collection('users')
            .find({_id: new mongodb.ObjectId(userId)})
            .next()
            .then(user => {
                console.log(user)
                return user
            })
            .catch(err => {
                console.log(err)
            })
    }
}