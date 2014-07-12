var FilmView = Backbone.View.extend({
	className: 'film-container',
	template: _.template($('#film-template').html()),
  events: {
    'click [data-change]':'changeName',
    'blur [data-change]': 'finishChangeName',
    'click [data-remove]': 'deleteFilm'
  },

	initialize: function(){
		this.render();
	},

	render: function(){
    var id = this.model.get('id'),
        name = this.model.get('name'),
        poster = this.model.get('poster'),
        year = this.model.get('year');
		this.$el.html(this.template({'name': name, id: id, 'poster': poster, 'year': year}) + '<button data-remove="'+id+'">delete</button>');
		return this;
	},

  changeName: function (e) {
    console.log(e);
    console.log(this);
    var $el = $(e.target);
    $el.attr('contenteditable', true);
    $el.focus();
  },

  finishChangeName: function (e) {
    var $el = $(e.target),
        name = $el.text(),
        id = $el.data('change'),
        model = this.model;
    model.save({name: name});
  },

  deleteFilm: function () {
    console.log(this);
    this.$el.remove();
    this.model.destroy({success: function(model, response) {
      console.info('removed well');
      console.info(response);
    }, error: function(model, response) {
      console.log('something went wrong');
      console.log(response.status);
    }});
  }

});