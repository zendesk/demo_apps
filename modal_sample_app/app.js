(function() {

  return {
    events: {
      'app.activated': 'init',
      'hide #myModal': 'onHide',
      'shown #myModal': 'onShown',
      'show #myModal': 'onShow',
      'hidden #myModal': 'onHidden',
      'click #modalSwitch': 'swithToModalJSExample',
      'click #toggleModalJS': 'displayModal'
    },

    init: function(){
      this.switchTo('modal');
    },

    onHide: function(){
      console.log("hide in Process");
    },

    onShown: function(){
      console.log("shown in Process");
    },

    onShow: function(){
      console.log("show in Process");
    },

    onHidden: function(){
      console.log("hidden in Process");
    },

    swithToModalJSExample: function(){
      this.switchTo('init');
    },

    displayModal: function(){
      this.switchTo('modalJS',{
        header: "This is a modal invoked by javascript",
        body: "playing around with JavaScript :)"
      });
      this.$('#myModal').modal({
        backdrop: true,
        keyboard: false,
      });
    }
  };

}());
