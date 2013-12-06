(function(){

  var RGB_MOD = 256;
  var RGB_LIMIT = 255;
  var GRAY_LIMIT = 230;
  var WHITEN_FACTOR = 80;
  var TEXT_COLOR_THRESHOLD = 160;

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
            tagColor: "#" + color[0].toString(16) + color[1].toString(16) + color[2].toString(16)
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

      var R = (code % RGB_MOD) + WHITEN_FACTOR,
          G = (code * 2 % RGB_MOD) + WHITEN_FACTOR,
          B = (code * 3 % RGB_MOD) + WHITEN_FACTOR;

      if ((R >= GRAY_LIMIT) && (G >= GRAY_LIMIT) && (B >= GRAY_LIMIT)) {
        R = G = B = GRAY_LIMIT;
      }

      return [((R >= RGB_MOD) ? RGB_LIMIT : R), ((G >= RGB_MOD) ? RGB_LIMIT : G), ((B >= RGB_MOD) ? RGB_LIMIT : B)];
    }
  };

}());