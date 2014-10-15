(function() {

  return {
    events: {
      'app.created':  'init',
      'iframe.handshake': 'handleHandshake',
      'iframe.messageReceived': 'handleMessageReceived',
      'click .send_message .btn': 'sendChatMessage'
    },

    init: function() {
      this.switchTo('iframe');
    },

    handleHandshake: function(data) {
      if (data.awesome) {
        this.$("#chat_content").append("IFrame communication is up and running!");
      }
    },

    handleMessageReceived: function(data) {
      if (data.awesome) {
        this.$('#chat_content').append('<br/>Received message from the iFrame: ' + data.message)
      }
    },

    sendChatMessage: function(event) {
      event.preventDefault();

      this.$form = this.$('form').eq(0);
      this.formData = this.$form.serializeArray();
      var message = this.formData[0].value;
      
      if (message) {
        this.$("#chat_content").append("<br/><br/>Sending message '" + message + "' to the iFrame...");
        this.postMessage('app.message', { message: message });        
      }
    }

  };

}());
