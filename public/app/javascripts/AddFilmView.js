var AddFilmView = Backbone.View.extend({
  className: 'add-film-form',
  el       : '#forms-container',
  url: '/api/films',

  events: {
    'click #add-new': 'addNewFilm'
  },

  template: _.template($('#add-new-film').html()),

  initialize: function () {
    this.render();
  },

  render: function () {
    this.$el.html(this.template());
    return this;
  },

  addNewFilm: function () {
    var title = $('#film-title').val(),
        year = $('#film-year').val(),
        poster = $('#film-poster').val(),
        collection = this.collection;

    if (title.length > 0 && year.length > 0) {
      var m = new Film();
      m.save({'name': title, 'poster': poster, 'year': "(" + year + ")"}).done(function(model, response) {
        collection.fetch(); // This works better than that below
      });
    } else {
      this.$el.append('<small>Title and year should be filled</small>');
    }

  }

});

var addFilmsView = new AddFilmView({
  collection: films
});