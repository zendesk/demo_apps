(function() {

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		events: {
			'pane.activated': 'playMusic',
			'pane.deactivated': 'stopMusic',
			'notification.merryChristmas': 'christmas',
			'notification.happyNewYear': 'newYear',
			'click #show_link': 'showLink'
		},

		startPage: function() {
			this.switchTo('index');
			this.popover({width: 400, height: 250});
			//this.popover();
		},

		playMusic: function() {
      if(this.isNotified) {
        this.audio = this.audio || this.$('#player_audio')[0];
				console.log(this.audio);
				console.log(this);
				this.audio.play();

				this.intId = setInterval(function() {
					var width = getRandomInt(600, 1500);
        //this.popover({
        //    width: width,
        //    height: width*2/3
        //});
				var backgroundSize = width.toString() + "px " + ( width*2/3 ).toString() + "px";
				this.$('#player').css('background-size', backgroundSize);
			}.bind(this), 100);
		} else {
			this.startPage();
		}
		},

		christmas: function() {
			this.switchTo('player', { christmas: true });
      this.$('#player').css('background-image', this.assetURL('christmas.jpg'));
      this.isNotified = true;
      this.popover({
        width: 1024,
        height: 600
      });
      this.popover();

      this.playMusic();
    },

    newYear: function() {
      this.switchTo('player', { newYear: true });
      this.$('#player').css('background-image', this.assetURL('new_year.jpg'));
      this.isNotified = true;
      this.popover({
        width: '1024px',
        height: '600px'
      });
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
      var appId = this.$(e.target).data('id');
      this.$('#link').css('display','block');
    }
  };

}());
