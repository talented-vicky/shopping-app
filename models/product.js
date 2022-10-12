const fs = require('fs')
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json'
);

const helperFunc = callBack => {
    fs.readFile(p, (err, content) => {
        if(err){
             return callBack([]) 
            // return [] because I always wanna return an array regardless
        }
        callBack(JSON.parse(content));
    })
}

module.exports = class Product {
    constructor(tit){
        this.title = tit
    }

    save() {
        helperFunc(product => {
            product.push(this)
            fs.writeFile(p, JSON.stringify(product), err => { // js into json
                console.log(err)
            });
        })
    };

    static fetchAll(cb) {
        helperFunc(cb)
    };
}





// save() {
//     fs.readFile(p, (err, content) => {
//         let products = []
//         if(!err){
//             products = JSON.parse(content) // json into obj
//         };
//         products.push(this)
//         fs.writeFile(p, JSON.stringify(products), err => { // js into json
//             console.log(err)
//         });
//     })
// };