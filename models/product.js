const fs = require('fs')
const path = require('path');

const Cart = require('./cart')

const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json'
);

const helperFunc = callBack => {
    fs.readFile(p, (err, content) => {
        if(err) { 
            return callBack([])  //returns an empty array
        } 
        callBack(JSON.parse(content)); // an array of objects
    })
}

module.exports = class Product {
    constructor(id, tit, img, des, price){
        this.id = id,
        this.title = tit,
        this.imageUrl = img,
        this.description = des,
        this.price = price
    }

    save() {
        helperFunc(product => {
            if(this.id){ 
                // if there already is an id, which implied the prod already exists
                const existingProdInd = product.findIndex(prod => prod.id === this.id)
                
                // pulling all prods into updatedProd
                const updatedProd = [...product] 
                
                // replacing this (product with found id) with newly edited product
                updatedProd[existingProdInd] = this 
                fs.writeFile(p, JSON.stringify(updatedProd), err => console.log(err))
            }else{
                // here we found no id & hence assigning a random num for the new id
                this.id = Math.random().toString()
                product.push(this)
                fs.writeFile(p, JSON.stringify(product), err => console.log(err) );
            }
        })
    };

    static deletebyId(id) {
        helperFunc(products => {
            // the above is the product to delete so as to fetch its price
            const product = products.find(prod => prod.id === id)
            console.log(product)
            
            // this returns all but the particular product not in the prods array
            const updatedProd = products.filter(elem => elem.id !== id)            
            
            fs.writeFile(p, JSON.stringify(updatedProd), err => {
                if(!err){
                    Cart.deleteProduct(id, product.price)
                }
            })
        })
    }
    
    static fetchAll(cb) {
        helperFunc(cb)
    };

    static fetchById(id, cb) {
        helperFunc(products => {
            // once I call helperFunc, it's argument is a an array of js objects
            const product = products.find(prod => prod.id === id)
            cb(product)
        })
    };
}


// remember a normal class method is called on the object itself
// a static method (on the other hand) is called on the instantiated class