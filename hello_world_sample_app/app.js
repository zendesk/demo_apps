(function() {

  return {
    events: {
      'app.activated': 'userID',
      'getOrgs.done': 'displayOrgs'
    },

    requests: {
      getOrgs: function(id) {
        return {
          url: '/api/v2/users/' + id + '/organizations.json',
          type: 'GET',
          contentType: 'application/json',
          dataType: 'json'
        };
      }
    },

    userID: function(){
      this.ajax('getOrgs', this.currentUser().id());
    },

    displayOrgs: function(data){
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {
        username: currentUser,
        organizations: data.organizations
      });
    }
  };

}());
