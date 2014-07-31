var _ = require("underscore");

var HotelService = function(){

  this.getFilm = function(name){
    return _.find(this.FilmList, function(item){
      return item.name === name;
    });
  };

  this.getCountryData = function(name, query){
    if (name){
      var item = _.findWhere(this.CountryList, {name: name});
      if (item) {
        if (query.hotel) {
          if (query.hotel === 'all') {
            return {hotels: item.hotels};
          } else {
            return _.findWhere(item.hotels, {id: Number(query.hotel)});
          }
        } else {
          return {name:item.name, id: item.id};
        }
      }
    } else {
      return _.map(this.CountryList, function(item){
        return {name:item.name, id: item.id}
      });
    }
  };

  this.deleteCountry = function(id){
    this.CountryList = _.reject(this.CountryList, function(item){return item.id === Number(id);});
  };

  this.updateHotel = function(param) {
    var country = _.findWhere(this.CountryList, {name: param.country.name}),
        _hotel = _.findWhere(country.hotels, {id: Number(param.hotel.id)});
    _hotel.name = param.hotel.name;
  };


  this.deleteHotel = function(param) {
    var country = _.findWhere(this.CountryList, {name: param.country.name});
        country.hotels = _.reject(country.hotels, function(item){return item.id === Number(param.hotel.id)});
  };

  this.addHotel = function(param) {
    var country = _.findWhere(this.CountryList, {name: param.country}),
        _hotel = {name: param.hotel},
        ids = _.pluck(country.hotels, 'id');
    _hotel['id'] = _.max(ids) + 1;
    country.hotels.push(_hotel);
  };

  this.addCountry = function(name){
    var country = {name: name};
    var ids = _.pluck(this.CountryList, 'id');
    country['id'] = _.max(ids) + 1;
    this.CountryList.push(country);
  };

  this.changeCountry = function(item){
    var currentModel = _.findWhere(this.FilmList, {id: item.id});
    _.extend(currentModel, item);
  };

  this.CountryList = [
    {
      name: "Australia",
      id: 1,
      hotels: [
        {
          name: "Ritz",
          id: 1
        },
        {
          name: "Carlton",
          id: 2
        }
      ]
    },
    {
      name: "New Zealand",
      id: 2,
      hotels: [
        {
          name: "Ship Yard",
          id: 1
        },
        {
          name: "Green Gray",
          id: 2
        }
      ]
    },
    {
      name: "Sri Lanka",
      id: 3,
      hotels: [
        {
          name: "Induruwa Bach",
          id: 1
        },
        {
          name: "Bentota Club",
          id: 2
        }
      ]
    },
    {
      name: "Indonesia",
      id: 4,
      hotels: [
        {
          name: "BahaMaha",
          id: 1
        }
      ]
    },
    {
      name: "Cambodia",
      id: 5,
      hotels: [
        {
          name: "Green Days",
          id: 1
        },
        {
          name: "Angkor Suit",
          id: 2
        }
      ]
    },
    {
      name: "India",
      id: 6,
      hotels: [
        {
          name: "Maharadj",
          id: 1
        },
        {
          name: "Carlton",
          id: 2
        }
      ]
    },
    {
      name: "Pakistan",
      id: 7,
      hotels: [

      ]
    },
    {
      name: "Malaysia",
      id: 8,
      hotels: [
        {
          name: "Mali",
          id: 1
        }
      ]
    },
    {
      name: "Georgia",
      id: 9,
      hotels: [
        {
          name: "Genatsvali",
          id: 1
        }
      ]
    }

  ];
};

module.exports = new HotelService();