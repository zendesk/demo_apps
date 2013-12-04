(function(){

  return {
    defaultState: 'loading',

    requests: {
      fetchUserInfo: function(){
        return {
          url: "",
          type: 'GET',
          data: {}
        };
      }
    },

    events: {
      'app.activated': function(){
        console.log(this);
        this.requestUserInfo();
      },

      'fetchUserInfo.done': function(data){
        this.renderUserInfo(data || {});
      },

      'fetchUserInfo.fail': function(data){
        this.switchTo('fetch_fail');
      }
    },

    requestUserInfo: function() {
      this.ajax('fetchUserInfo');
    },

    renderUserInfo: function(data) {

    }
  };
}());