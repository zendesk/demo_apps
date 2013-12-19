(function() {

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    events: {
      'pane.activated': 'playMusic',
      'pane.deactivated': 'stopMusic',
      'notification.christmas': 'christmas',
      'notification.new_year': 'newYear',
      'click .show_link': 'showLink'

    },

    startPage: function() {
      this.switchTo('index');
      this.popover({width: 480, height: 320});
    },

    playMusic: function() {
      if(this.isNotified) {
        this.$('#player').css('background-image', 'url(' + this.pictureURL + ')');
        this.audio = this.$('#player_audio')[0];
        this.audio.play();
        this.intId = setInterval(function() {
          var width = getRandomInt(600, 1500);
          var height = width*2/3;
          var backgroundSize = width.toString() + "px " + height.toString() + "px";
          this.$('#player').css('background-size', backgroundSize);
          this.popover({
            width: width + 20,
            height: height + 100
          });
        }.bind(this), 100);
      } else {
        this.startPage();
      }
    },

    christmas: function() {
      this.popover('hide');
      this.switchTo('player', { christmas: true });
      this.updatePlayerBackground('christmas.jpg');
    },

    newYear: function() {
      this.popover('hide');
      this.switchTo('player', { newYear: true });
      this.updatePlayerBackground('new_year.jpg');
    },

    updatePlayerBackground: function(imageName) {
      this.pictureURL = this.assetURL(imageName);
      this.isNotified = true;
      this.popover();
    },

    stopMusic: function() {
      if(this.isNotified) {
        clearInterval(this.intId);
        this.audio.pause();
      }
      this.switchTo('index');
      this.isNotified = false;
      this.popover({width: 400, height: 250});

    },

    showLink: function(e) {
      console.log(e);
      //substring to grab to class name
      var startIndex = "show_link".length + 1;
      var eventName = e.toElement.className.substring(startIndex);
      var uri = e.currentTarget.baseURI.split("/")[2];

      var command = this.I18n.t('command', {
        app_id: this.id(),
        event: eventName,
        uri: uri,
        email: this.currentUser().email()
      });
      this.$('code').text(command);
      this.$('#link').css('display','block');
    }
  };

}());
