const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>')
        res.write('<head><title>Message Input</title></head>')
        res.write('<body><form action="/texts" method="POST"><input type="text" name="messageKey"></input></form></body>')
        res.write('</html>')
        return res.end();
    }
    else if(url === '/texts' && method === 'POST'){
        const textGot = []
        req.on('data', chunk => {
            console.log(chunk)
            textGot.push(chunk)
        })
        return req.on('end', () => { // if we don't return then it follows nodejs async pattern
            const textModified = Buffer.concat(textGot).toString()
            const textValue = textModified.split('=')[1]
            fs.writeFile('typedDoc.txt', textValue, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/')
                return res.end()
            }); // only user writeFileSync when sure of small data
        })
    }
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>New Page</title></head>')
    res.write('<body><h1>new page gotten</h1></body>')
    res.write('</html>')
}

module.exports = requestHandler;