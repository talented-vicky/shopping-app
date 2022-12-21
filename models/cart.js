const fs = require('fs')
const path =  require('path')

const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, prodPrice){

        // fetching previous cart
        fs.readFile(p, (err, content) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){ // i.e if we've got a cart
                cart = JSON.parse(content)
            }

            // checking cart for existing product
            const existingIndProd = cart.products.findIndex(ind => ind.id === id);
            const existingProd = cart.products[existingIndProd]
            // the above yields an array of item in the products array

            let updatedProd; // this is a dictionary of product info
            
            // We have a cart
            if(existingProd){ // wanna increase qty of existing prod
                updatedProd = {...existingProd}
                updatedProd.qty += 1
                cart.products = [...cart.products] //making sure I hv wat I had
                cart.products[existingIndProd] = updatedProd // this line tho
            }else{ // wanna add new prod and intialize qty
                updatedProd = {id: id, qty: 1}
                cart.products = [...cart.products, updatedProd]
                //making sure I hv wat I had & addinig the new item into it
            }
            cart.totalPrice += parseInt(prodPrice)
            console.log(cart)
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err))
        })
    }

    static deleteProduct(id, prodPrice) {
        // read the file to see if product with id exists, else remove

        fs.readFile(p, (err, cartContent) => {
            if(err){
                return // I didn't find a file, so nothing to delete
            }
            // pull existing cart into a new one
            const updatedCart = {...JSON.parse(cartContent)}
            
            // find the intended product(to fetch qty) and then filter it
            const product = updatedCart.products.find(prod => prod.id === id)
            if(!product){
                return // this ensures we do not attempt to delete what
                // isn't in the product list
            }
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
            console.log(updatedCart)
                        
            // deduct the price from the total price and save into file
            // updatedCart.totalPrice -=  prodPrice * product.qty
            updatedCart.totalPrice =  
                updatedCart.totalPrice - prodPrice * product.qty
            fs.readFile(p, JSON.stringify(updatedCart), err => console.log(err))
        })
    }

    static getCart(cb){
        fs.readFile(p, (err, cartContent) => {
            if(err) { cb(null) }
            else { cb(JSON.parse(cartContent)) }
        })
    }
}

