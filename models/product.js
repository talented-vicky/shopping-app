const products = [];

module.exports = class Product {
    constructor(tit){
        this.title = tit
    }

    save() {
        products.push(this)
    }
    // this would refer to the object created based on the class

    static fetchAll() {
        return products
    }
    // static ensures I'm calling fetchall directly on the class
}