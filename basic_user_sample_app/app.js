(function(){

  return {
    defaultState: 'loading',

    requests: {},

    events: {
      'app.activated': function(){
        var user = this.currentUser();
        var groups = user.groups();

        for (var i = 0; i < groups.length; ++i) {
          var group = groups[i];

          groups[i] = {
            id: group.id(),
            name: group.name()
          };
        }

        this.switchTo('basic_user_info', {
          id: user.id(),
          email: user.email(),
          name: user.name(),
          role: user.role(),
          groups: groups
        });
      }
    }
  };

}());
