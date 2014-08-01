var express = require('express'),
  app = express(),
  http = require('http'),
  fs = require('fs'),
  url = require('url'),
  querystring = require('querystring'),
  util = require('util'),
  bodyParser = require('body-parser'),
  hotelService = require('./hotelService'),
  connect = require('connect'),
  methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}));


/**
 * Get particular country
 */
app.get('/restapi/country/:name', function (req, res) {
  var data = hotelService.getCountryData(req.params.name, req.query);
  if (data) {
    res.send(data);
  } else {
    res.send('No country were found with name: ' + req.params.name);
  }
});


/**
 * Delete particular country
 */
app.delete('/restapi/country', function (req, res) {
  console.log(req.body);
  hotelService.deleteCountry(req.body.country.id);
  res.redirect('/restapi/country');
  res.end();
});

/**
 * Delete particular hotel in :name country
 */
app.delete('/restapi/country/:name', function (req, res) {
  console.log(req.body);
  hotelService.deleteHotel(req.body);
  res.redirect('/restapi/country');
  res.end();
});

/**
 * Add new hotel in :name country
 */
app.post('/restapi/country/:name', function (req, res) {
  console.log(req.params);
  console.log(req.body);
  hotelService.addHotel({country: req.params.name, hotel: req.body.hotel.name});
  res.redirect('/restapi/country');
  res.end();
});

/**
 * Update hotel in particular country
 */
app.put('/restapi/country', function (req, res) {
  console.log(req.body);
  hotelService.updateHotel(req.body);
  res.redirect('/restapi/country');
  res.end();
});

/**
 * Help page
 */
app.get('/help', function (req, res) {
  var text = [
    '<hr>', '<b>localhost:3000/restapi/country</b>', 'returns the list of available countries', '<br />', '<b>localhost:3000/restapi/country/%name%</b>', 'where %name% is name of the country from the list', '<br />', '<b>localhost:3000/restapi/country/%name%/%id%</b>', 'where <b>%id%</b> is a id of the hotel in <b>%name%</b> country', '<br />', '<hr>'];
  res.send(text.join('<br />'));

});

app.listen(3000);
console.log('Server started on port 3000. Go to localhost:3000 for further instructions');

var server = http.createServer().listen(8888, 'localhost');

server.on('request', function(req,res) {
  var url_parts = url.parse(req.url, true);

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
    case '/restapi' :
      console.log("[501] " + req.method + " to " + req.url);
      res.writeHead(501, "Not implemented", {'Content-Type': 'text/html'});
      res.end('<html><head><title>501 - Not implemented</title></head><body><h1>Not implemented!</h1></body></html>');
      break;
    case '/restapi/country' :
      if (req.method == 'POST') {

        /**
         * Add new country
         */

        var fullBody = '';

        req.on('data', function(chunk) {
          fullBody += chunk.toString();
        });
        req.on('end', function() {

          var decodedBody = querystring.parse(fullBody);
          console.log(decodedBody);
          res.statusCode = 302;
          res.setHeader('Location', '/index.html');
          hotelService.addCountry(decodedBody['country[name]']);

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
      break;
    default:
      res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
      res.end('<html><head><title>404 - Not found</title></head><body><h1>Not found.</h1></body></html>');
      console.log("[404] " + req.method + " to " + req.url);
  }
});
