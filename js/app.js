App = Ember.Application.create();

App.ApplicationSerializer = DS.LSSerializer.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'stat-keeper'
});

App.Router.map(function() {
  this.resource('teams', { path: '/'}, function() {
    this.resource('team', { path: 'teams/:team_id' });
  });

});

App.TeamsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('team');
  }
});

App.TeamRoute = Ember.Route.extend({
  model: function(params) {
    var team = this.get('team');
    return this.store.find('team', params.team_id);
  }
});

App.TeamsController = Ember.ArrayController.extend({
  actions: {
    createTeam: function() {
      var name = this.get('newName');
      if (!name.trim()) {return;}

      var city = this.get('newCity');
      if (!city.trim()) {return;}

      var team = this.store.createRecord('team', {
        name: name,
        city: city
      });

      this.set('newName', '');
      this.set('newCity', '');


      team.save();
    }
  }
});

App.Team = DS.Model.extend({
  players: DS.hasMany('player'),
  name: DS.attr('string'),
  city: DS.attr('string')
});

App.Player = DS.Model.extend({
  team: DS.belongsTo('team'),
  name: DS.attr('string')
});

