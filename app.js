'use strict';
const http = require('http');
const fs = require('fs');
const PORT = process.env.PORT || 8000;

const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
    transform: (body) => {
        return cheerio.load(body);
    }
};

http.createServer((req, res) => {
    const url = "public" + (req.url.endsWith("/") ? req.url + "index.html" : req.url);
    if (fs.existsSync(url)) {
        fs.readFile(url, "utf-8", (err, data) => {
            if (!err) {
                //res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' });
                res.writeHead(200, { 'Content-Type': 'text/html' });
                
                rp.get('http://ja.wikipedia.org/wiki/Special:Randompage', options)
                    .then(($) => {
                        // return $('title').text();
                        return [$('#firstHeading').text(), $('#mw-content-text p').text()];
                    }).then(params => {
                        let rendarHtml =  data.replace("<%=title %>",params[0]).replace("<%=lead %>",params[1]);
                        //res.end(title);
                        //res.end(lead);
                        res.write(rendarHtml);
                        res.end();
                    }).catch((error) => {
                        console.error('Error:', error);
                    });
                    
                   //res.end(data);
            }
        });
    }
}).listen(PORT);

console.log(`Server running at ${PORT}`);