(function() {

  return {
    events: {
      'app.activated': 'sayHello',
      'getOrganizations.done': 'displayOrganizations'
    },

    requests: {
      getOrganizations: function(id) {
        return {
          url: '/api/v2/users/' + id + '/organizations.json',
          type: 'GET',
          contentType: 'application/json',
          dataType: 'json'
        };
      }
    },

    sayHello: function(){
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {
        username: currentUser,
      });
      this.ajax('getOrganizations', this.currentUser().id());
    },

    displayOrganizations: function(data){
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {
        username: currentUser,
        organizations: data.organizations
      });
    }
  };

}());
