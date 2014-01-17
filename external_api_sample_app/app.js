(function() {

  return {

    defaultState: 'start_page',

    resources: {
      USERNAME: 'myuser@example.com',
      PASSWORD: 'notasecret',
      END_POINT: 'https://www.teachmyapi.com/api/d8ed54064bd8c00918d62316c3ede108',
      DATE_PATTERN: /^\d{4}-\d{2}-\d{2}$/
    },

    requests: {
      fetchHeartyQuotes: { // This is a simple object style.
          url: 'http://www.iheartquotes.com/api/v1/random?max_characters=140&source=macintosh+math+south_park+codehappy+starwars&format=json',
          type: 'GET',
          dataType: 'json'
      },

      fetchTeachMyAPIUsers: function() { // This is a function style. It is necessary to use this style when you have to access this.resources or you want to pass parameters to this.ajax().
        return {
          url: helpers.fmt('%@/users', this.resources.END_POINT),
          type: 'GET',
          dataType: 'json',
          username: this.resources.USERNAME,
          password: this.resources.PASSWORD
        };
      },

      fetchTeachMyAPIUser: function(userId) {
        return {
          url: helpers.fmt('%@/users/%@', this.resources.END_POINT, userId),
          type: 'GET',
          dataType: 'json',
          username: this.resources.USERNAME,
          password: this.resources.PASSWORD
        };
      },

      postTeachMyAPIUsers: function(data) {
        return {
          url: helpers.fmt('%@/users', this.resources.END_POINT),
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data),
          username: this.resources.USERNAME,
          password: this.resources.PASSWORD
        };
      },

      putTeachMyAPIUser: function(data, userId) {
        return {
          url: helpers.fmt('%@/users/%@', this.resources.END_POINT, userId),
          type: 'PUT',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data),
          username: this.resources.USERNAME,
          password: this.resources.PASSWORD
        };
      }
    },

    events: {
      'click .get_no_auth': 'getNoAuth',
      'click .get_with_auth': 'getWithAuth',
      'click .post_with_auth': 'openEditUserForm',
      'click .put_with_auth': 'putWithAuth',
      'fetchHeartyQuotes.done': 'renderHeartyQuote',
      'fetchTeachMyAPIUsers.done': 'renderUserList',
      'postTeachMyAPIUsers.done': 'postCleanup',
      'fetchTeachMyAPIUser.done': 'openUpdateUserForm',
      'putTeachMyAPIUsers.done': 'putCleanup',
      'postTeachMyAPIUsers.fail': 'fail',
      'click .back_to_start': 'renderStartPage',
      'click .update': 'updateUser',
      'click .modal_close': 'closeModal',
      'hidden .my_modal': 'renderStartPage',
      'click .btn_submit': 'createUser'
    },

    renderStartPage: function() {
      this.switchTo('start_page');
    },

    getNoAuth: function(event) {
      // Prevent what would normally happen when a user clicks
      event.preventDefault();
      this.ajax('fetchHeartyQuotes');
      this.switchTo('loading_screen');
    },

    getWithAuth: function(event) {
      event.preventDefault();
      this.ajax('fetchTeachMyAPIUsers');
      this.switchTo('loading_screen');
    },

    putWithAuth: function(event) {
      this.canUpdateUser = true;
      this.getWithAuth(event);
    },

    updateUser: function(event) {
      event.preventDefault();
      this.updateUserId = this.$(event.currentTarget).children('.id').eq(0).text();


    },

    openUpdateUserForm: function(data) {
      this.switchTo('update_user_details_form', {user: data});
    },

    createUser: function(event) {
      this.dataObjectArray = {};
      event.preventDefault();
      this.$userForm = this.$('.form-horizontal').eq(0);
      this.userFormData = this.$userForm.serializeArray();
      _.each(this.userFormData, function(data) {
        if (data.name === "friends") {
          data.value = _.map(data.value.split(';'), function(name) {
            return name.trim();
          });
          data.value = _.filter(data.value, function(name) {
            return name !== "";
          });
          if(data.value.length === 0) {
            data.value = undefined;
          }
        }
        if (data.name === "married") {
          data.value = !!data.value;
        }

        if (data.value === "") {
          data.value = undefined;
        }
        this.dataObjectArray[data.name] = data.value;
      }.bind(this));

      console.log(this.dataObjectArray);

      // Check if form data is valid
      if (typeof(this.dataObjectArray.friends) === 'undefined' || !Array.isArray(this.dataObjectArray.friends)) {
        services.notify('You cannot have no friends!');
      } else if (typeof(this.dataObjectArray.age) === 'undefined' || typeof(parseInt(this.dataObjectArray.age, 10)) !== 'number') {
        services.notify('Your age has to be a valid number!');
      } else if (typeof(this.dataObjectArray.name) === 'undefined' || this.dataObjectArray.name === "") {
        services.notify('Invalid name!');
      } else if (typeof(this.dataObjectArray.birthday) === 'undefined' || !this.resources.DATE_PATTERN.test(this.dataObjectArray.birthday)){
        services.notify('Invalid birthday!');
      } else {
        console.log(JSON.stringify(this.dataObjectArray));
        this.ajax('postTeachMyAPIUsers', this.dataObjectArray);
      }
    },

    openEditUserForm: function(event) {
      event.preventDefault();
      this.switchTo('edit_user_details_form');
      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });
    },


    renderHeartyQuote: function(data) {
      // Map tags array to tags object {tag: 'tag_content'}
      var tags = _.map(data.tags, function(tag){ return { tag: tag }; });
      console.log('do tags');
      console.log(tags);
      this.switchTo('quote_page', {
        tags: tags,
        quote: data.quote
      });
    },

    renderUserList: function(data) {
      var users = _.map(data, function(user){ user.friends = user.friends.join(' '); return { user: user };});
      var userPageObj = { users: users };
      this.switchTo('user_list', userPageObj);
      if (this.canUpdateUser) {
        this.$('.user').addClass('update');
        this.canUpdateUser = false;
      }
    },

    closeModal: function(event) {
      if (typeof(event)!== 'undefined')
        event.preventDefault();

      this.$('.my_modal').modal('hide');
    },

    postCleanup: function(data) {
      this.closeModal();
      this.renderStartPage();
      console.log(data);
      services.notify('User created!');
    },

    fail: function(data) {
      console.log(data);
    }
  };

}());
