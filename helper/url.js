const fs = require('fs')

const deteleFile = (path) => {
    fs.unlink(path, (err) => {
        if(err){
            throw (err)
        }
    })
}
exports.deteleFile = deteleFile;