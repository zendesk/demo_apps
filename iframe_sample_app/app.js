(function() {

  return {
    events: {
      'app.created':  'init',
      'iframe.hello': 'handleHello',
      'iframe.messageReceived': 'handleMessageReceived',
      'click .send_message .btn': 'sendChatMessage'
    },

    init: function() {
      this.switchTo('iframe');
    },

    handleHello: function(data) {
      if (data.awesome) {
        var name = this.currentUser().name();
        this.$("#chat_content").append("Sending a message to app with name '" + name + "'");
        this.postMessage('app.hello', { name: name });
      }
    },

    handleMessageReceived: function(data) {
      if (data.awesome) {
        this.$('#chat_content').append('<br/>Received message from app: ' + data.message)
      }
    },

    sendChatMessage: function(event) {
      event.preventDefault();

      this.$form = this.$('form').eq(0);
      this.formData = this.$form.serializeArray();
      var message = this.formData[0].value;
      
      if (message) {
        this.$("#chat_content").append("<br/><br/>Sending message '" + message + "' to app...");
        this.postMessage('app.message', { message: message });        
      }
    }

  };
}());
