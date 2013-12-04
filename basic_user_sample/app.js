(function(){

  return {
    defaultState: 'loading',

    requests: {},

    events: {
      'app.activated': function(){
        var user = this.currentUser();
        this.switchTo('basic_user_info', {
          "email": user.email(),
          "name": user.name(),
          "role": user.role()
        });
      }
    }
  };

}());