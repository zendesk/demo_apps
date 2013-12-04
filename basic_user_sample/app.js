(function(){

  return {
    defaultState: 'loading',

    requests: {},

    events: {
      'app.activated': function(){
        var user = this.currentUser();
        console.log(user.groups());
        this.switchTo('basic_user_info', {
          "id": user.id(),
          "email": user.email(),
          "name": user.name(),
          "role": user.role(),
          "groups": user.groups()
        });
      }
    }
  };

}());