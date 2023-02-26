const fs = require('fs')

const deteleFile = (path) => {
    fs.unlink(path, (err) => {
        if(err){
            console.log('just got an error')
            throw (err)
        }
        console.log('File deleted')
    })
}
exports.deteleFile = deteleFile;