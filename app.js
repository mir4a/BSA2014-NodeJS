var express = require('express'),
	app = express(),
  bodyParser = require('body-parser'),
	hotelService = require('./hotelService'),
  connect = require('connect'),
  methodOverride = require('method-override');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}));

/**
 * Get all countries
 */
app.get('/restapi/country', function (req, res) {
	res.send(hotelService.getCountryData());
});

/**
 * Get particular country
 */
app.get('/restapi/country/:name', function (req, res) {
	var data = hotelService.getCountryData(req.params.name, req.query);
	if (data){
		res.send(data);
	} else {
		res.send('No country were found with name: ' + req.params.name);
	}
});

/**
 * Add new country
 */
app.post('/restapi/country', function (req, res) {
  hotelService.addCountry(req.body.country.name);
  res.redirect('/restapi/country');
	res.end();
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
app.get('/help', function(req, res){
	var text = [
		'<hr>',
		'<b>localhost:3000/restapi/country</b>',
		'returns the list of available countries',
		'<br />',
		'<b>localhost:3000/restapi/country/%name%</b>',
		'where %name% is name of the country from the list',
		'<br />',
		'<b>localhost:3000/restapi/country/%name%/%id%</b>',
		'where <b>%id%</b> is a id of the hotel in <b>%name%</b> country',
		'<br />',
		'<hr>'];
	res.send(text.join('<br />'));

});

app.listen(3000);
console.log('Server started on port 3000. Go to localhost:3000 for further instructions');