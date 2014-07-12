var Film = Backbone.Model.extend({
  url : function() {
    return this.id ? '/api/films/' + this.id : '/api/films';
  },
	defaults:{
		year: 2014,
		name: '',
		id: undefined
	}
});