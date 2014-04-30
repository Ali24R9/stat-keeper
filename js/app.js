App = Ember.Application.create();

App.ApplicationSerializer = DS.LSSerializer.extend();

App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'stat-keeper'
});

App.Router.map(function() {
  this.resource('teams', { path: '/'}, function() {
    this.resource('team', { path: 'teams/:id' }, function() {
      this.resource('new_player', { path: 'players/new' });
      this.resource('players', {path: 'players'});
    });
  });

});

App.NewPlayerRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('player');
  }
});

App.TeamsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('team');
  }
});

App.TeamRoute = Ember.Route.extend({
  model: function(params) {
    var team = this.get('team');
    return this.store.find('team', params.id);
  }
});

App.PlayersRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('player')
  }
});

App.NewPlayerController = Ember.ObjectController.extend({
  needs: "team",
  team: Ember.computed.alias("controllers.team.model"),
  actions: {
    createPlayer: function() {
      var name = this.get('newName');
      if (!name.trim()) {return;}

      var player = this.store.createRecord('player', {
        name: name
      });

      this.set('newName', '');

      var team = this.get('team').get('model');
      team.get('players').pushObject(player);
      player.save();
      team.save();
    }
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
  players: DS.hasMany('player', {async:true}),
  name: DS.attr('string'),
  city: DS.attr('string')
});

App.Player = DS.Model.extend({
  team: DS.belongsTo('team'),
  name: DS.attr('string'),
});

