(function(){

  var RGB_MAX = 16;

  return {
    defaultState: 'loading',

    requests: {},

    events: {
      'app.activated': function(){
        var user = this.currentUser();
        var groups = user.groups();
        for (var i = 0; i < groups.length; ++i) {
          var temp = groups[i];
          var name = temp.name();
          var color = this.nameToColor(name);
          groups[i] = {
            id: temp.id(),
            name: name,
            color: "#" + color
          };
        }
        this.switchTo('basic_user_info', {
          "id": user.id(),
          "email": user.email(),
          "name": user.name(),
          "role": user.role(),
          "groups": groups
        });
      }
    },

    nameToColor: function(name){
      var code = 0;
      for (var j = 0; j < name.length; ++j) {
        code += name.charCodeAt(j);
      }
      return (code % RGB_MAX).toString(16) +
        (code * 2 % RGB_MAX).toString(16) +
        (code * 3 % RGB_MAX).toString(16);
    }
  };

}());