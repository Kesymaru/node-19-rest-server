const http = require('http');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunck => {
            body += chunck;
            if (body.length > 1e6){ // max post payload 1000000 ~~~ 1MB
                res.writeHead(413, {'Content-Type': 'text/plain'});
                res.end();
                req.connection.destroy();
            }
        });
        req.on('end', () => {
            let data = querystring.parse(body);
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: true, data}));
        });
    }
});
server.listen(5000, '127.0.0.1', () => console.log('Server running on: 127.0.0.1:5000'));
