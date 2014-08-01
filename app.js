var http = require('http'),
  fs = require('fs'),
  url = require('url'),
  querystring = require('querystring'),
  util = require('util'),
  hotelService = require('./hotelService');

var server = http.createServer().listen(8888, 'localhost');

server.on('request', function(req,res) {
  var url_parts = url.parse(req.url, true),
    path_parts = url_parts.pathname.split('/');
  console.log('//////////////////path_parts');
  console.log(path_parts);

  if (path_parts[1] === 'restapi') {
      console.log("path_parts[1] === 'restapi'");
    if (path_parts[2] === 'country') {
      console.log("path_parts[2] === 'country'");
      if (path_parts[3] !== undefined) {
        console.log("path_parts[3] !== undefined");
        if (req.method == 'POST') {
          var fullBody = '';

          req.on('data', function(chunk) {
            fullBody += chunk.toString();
          });
          req.on('end', function() {
            var decodedBody = querystring.parse(fullBody);
            console.log(decodedBody);
            if (decodedBody['_method'] && decodedBody._method === 'delete') {
              /**
              * Delete particular hotel in :name country
              */
              console.log('Delete particular hotel in :name country');
              console.log({country: {name: decodedBody['country[name]']}, hotel: {id: decodedBody['hotel[id]']}});
                hotelService.deleteHotel({country: {name: decodedBody['country[name]']}, hotel: {id: decodedBody['hotel[id]']}});
              res.statusCode = 302;
              res.setHeader('Location', '/restapi/country/' + encodeURI(decodedBody['country[name]']));
              res.end();
            } else {

              /**
              * Add new hotel in :name country
              */
              console.log('Add new hotel in :name country');
              console.log({country: path_parts[3], hotel: decodedBody['hotel[name]']});
              hotelService.addHotel({country: path_parts[3], hotel: decodedBody['hotel[name]']});
              res.statusCode = 302;
              res.setHeader('Location', '/restapi/country/' + path_parts[3]);
              res.end();
            }
          });
        } else if (req.method == 'GET') {
          /**
           * Get particular country
           */
          var fullBody = '';

          console.log('req.query');
          console.log(url_parts.query);

          req.on('data', function(chunk) {
            fullBody += chunk.toString();
          });
          req.on('end', function() {
            var decodedBody = querystring.parse(fullBody);
            console.log('======== decodedBody ========');
            console.log(decodedBody);

            var data = hotelService.getCountryData(decodeURI(path_parts[3]), url_parts.query);
            console.log('data');
            console.log(data);
            if (data) {
              console.log(JSON.stringify(data));
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.end(JSON.stringify(data));
            } else {
              console.log('No country were found with name: ' + decodeURI(path_parts[3]));
            }
          });
        }

      } else {
        if (req.method == 'POST') {

          var fullBody = '';

          req.on('data', function(chunk) {
            fullBody += chunk.toString();
          });
          req.on('end', function() {

            var decodedBody = querystring.parse(fullBody);
            var params;
            switch(decodedBody['_method']) {
              case 'put':
                params = {
                  country: {
                    name: decodedBody['country[name]']
                  },
                  hotel: {
                    id: decodedBody['hotel[id]'],
                    name: decodedBody['hotel[name]']
                  }
                };
                hotelService.updateHotel(params);
                break;
              case 'delete':
                hotelService.deleteCountry(decodedBody['country[id]']);
                break;
              default:
                /**
                 * Add new country
                 */
                hotelService.addCountry(decodedBody['country[name]']);
                console.log('By default _method undefined, so node please call addCountry');
            }

            console.log(decodedBody);
            res.statusCode = 302;
            res.setHeader('Location', '/index.html');

            res.end();
          });

        } else if (req.method == 'GET') {

          /**
           * Get all countries
           */
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(JSON.stringify(hotelService.getCountryData()));
        } else {
          console.log("[501] " + req.method + " to " + req.url);
          res.writeHead(501, "Not implemented", {'Content-Type': 'text/html'});
          res.end('<html><head><title>501 - Not implemented</title></head><body><h1>Not implemented!</h1></body></html>');
        }
      }

    }

  } else {
    switch(url_parts.pathname) {
      case '/' :
      case '/index.html' :
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(fs.readFileSync('public/index.html'));
        break;
      case '/js/jquery-2.1.0.min/index.js' :
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.end(fs.readFileSync('public/js/jquery-2.1.0.min/index.js'));
        break;
      case '/styles/style.css' :
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(fs.readFileSync('public/styles/style.css'));
        break;
      default:
        res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
        res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
        console.log("[404] " + req.method + " to " + req.url);
    }
  }

});
