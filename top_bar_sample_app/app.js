(function() {

  'use strict';

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var MIN = 600,
      MAX = 1500,
      WIDTH_BORDER = 20,
      HEIGHT_BORDER = 100,
      INTERVAL = 100;

  return {

    events: {

      'pane.activated': 'paneOnActivated',
      'pane.deactivated': 'paneOnDeactivated',
      'notification.christmas': 'christmas',
      'notification.new_year': 'newYear',
      'click .show_link': 'showLink'

    },

    startPage: function() {
      this.switchTo('index');
      this.popover({ width: 480, height: 320 });
    },

    paneOnActivated: function() {
      if (this.isNotified) {
        this.playMusic();
      } else {
        this.startPage();
      }
    },

    playMusic: function() {
      this.$('.player').css('background-image', 'url(' + this.pictureURL + ')');
      this.audio = this.$('.player_audio')[0];
      this.audio.play();
      this.intId = setInterval(function() {
        var width = getRandomInt(MIN, MAX);
        var height = width * 2 / 3;
        var backgroundSize = width.toString() + "px " + height.toString() + "px";
        this.$('.player').css('background-size', backgroundSize);
        this.popover({
          width: width + WIDTH_BORDER,
          height: height + HEIGHT_BORDER
        });
      }.bind(this), INTERVAL);
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

    paneOnDeactivated: function() {
      if(this.isNotified){
        this.stopMusic();
        this.switchTo('index');
        this.isNotified = false;
        this.popover({ width: 400, height: 250 });
      }
    },

    stopMusic: function() {
      clearInterval(this.intId);
      this.audio.pause();
    },

    showLink: function(e) {
      //substring to grab to class name
      var startIndex = "show_link".length + 1;
      var eventName = e.toElement.className.substring(startIndex);
      var uri = e.currentTarget.baseURI.split("/")[2];
      //create command
      var command = this.I18n.t('command', {
        app_id: this.id(),
        event: eventName,
        uri: uri,
        email: this.currentUser().email()
      });
      this.$('code').text(command);
      this.$('.link').css('display','block');
    }
  };

}());
