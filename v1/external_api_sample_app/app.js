(function() {

  return {

    defaultState: 'start_page',

    resources: {
      USERNAME     : 'myuser@example.com',
      PASSWORD     : 'notasecret',
      DATE_PATTERN : /^\d{4}-\d{2}-\d{2}$/
    },

    requests: {
      // This is a simple object style.
      fetchHeartyQuotes: {
          url: 'http://www.iheartquotes.com/api/v1/random?max_characters=140&source=macintosh+math+south_park+codehappy+starwars&format=json',
          type: 'GET',
          dataType: 'json'
      },

      // This is a function style. It is necessary to use this style when you have to access this.resources or you want to pass parameters to this.ajax().
      fetchTeachMyAPIUsers: function() {
        return {
          url: helpers.fmt('%@/users', this.api_url),
          type: 'GET',
          dataType: 'json',
          username: this.username,
          password: this.password
        };
      },

      fetchTeachMyAPIUserById: function(userId) {
        return {
          url: helpers.fmt('%@/users/%@', this.api_url, userId),
          type: 'GET',
          dataType: 'json',
          username: this.username,
          password: this.password
        };
      },

      postTeachMyAPIUsers: function(data) {
        return {
          url: helpers.fmt('%@/users', this.api_url),
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data),
          username: this.username,
          password: this.password
        };
      },

      putTeachMyAPIUserById: function(data, userId) {
        return {
          url: helpers.fmt('%@/users/%@', this.api_url, userId),
          type: 'PUT',
          dataType: 'json',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify(data),
          username: this.username,
          password: this.password
        };
      }
    },

    events: {
      'app.activated'                : 'init',
      'click .get_no_auth'           : 'getNoAuth',
      'click .get_with_auth'         : 'getWithAuth',
      'click .post_with_auth'        : 'openEditUserForm',
      'click .put_with_auth'         : 'putWithAuth',
      'fetchHeartyQuotes.done'       : 'renderHeartyQuote',
      'fetchTeachMyAPIUsers.done'    : 'renderUserList',
      'postTeachMyAPIUsers.done'     : 'postCleanup',
      'fetchTeachMyAPIUserById.done' : 'openUpdateUserForm',
      'putTeachMyAPIUserById.done'   : 'putCleanup',
      'postTeachMyAPIUsers.fail'     : 'fail',
      'fetchTeachMyAPIUsers.fail'    : 'fail',
      'fetchTeachMyAPIUserById.fail' : 'fail',
      'putTeachMyAPIUserById.fail'   : 'fail',
      'click .back_to_start'         : 'renderStartPage',
      'click .update'                : 'getUserInfo',
      'click .modal_close'           : 'closeModal',
      'hidden .my_modal'             : 'renderStartPage',
      'click .btn_submit'            : 'createUser',
      'click .btn_update'            : 'updateUser'
    },

    init: function() {
      this.username = this.setting('username') || this.resources.USERNAME;
      this.password = this.setting('password') || this.resources.PASSWORD;
      this.api_url = this.setting('api_url');
    },

    /* UI interaction. */
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

    getUserInfo: function(event) {
      event.preventDefault();
      this.switchTo('loading_screen');
      this.updateUserId = this.$(event.currentTarget).children('.id').eq(0).text();
      this.ajax('fetchTeachMyAPIUserById', this.updateUserId);
    },

    createUser: function(event) {
      event.preventDefault();
      this.serializeFormData();
      // Check if form data is valid
      if (this.validateFormData()) {
        this.ajax('postTeachMyAPIUsers', this.dataObjectArray);
        this.closeModal();
        this.switchTo('loading_screen');
      }
    },

    updateUser: function(event) {
      event.preventDefault();
      this.serializeFormData();
      // Check if form data is valid
      if (this.validateFormData()) {
        this.ajax('putTeachMyAPIUserById', this.dataObjectArray, this.updateUserId);
        this.closeModal();
        this.switchTo('loading_screen');
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

    closeModal: function(event) {
      if (typeof(event) !== 'undefined')
        event.preventDefault();
      this.$('.my_modal').modal('hide');
    },

    /* These helpers are invoked once one of the ajax request .done / .fail event is fired. */
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
      var users = _.map(data, function(user){ user.friends = user.friends.join('; '); return { user: user };});
      var userPageObj = { users: users };
      this.switchTo('user_list', userPageObj);
      if (this.canUpdateUser) {
        this.$('.user').addClass('update');
        this.canUpdateUser = false;
      }
    },

    openUpdateUserForm: function(data) {
      console.log(data);
      this.switchTo('update_user_details_form', { user: data });
      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });
    },

    postCleanup: function(data) {
      this.renderStartPage();
      console.log(data);
      services.notify('User created!');
    },

    putCleanup: function(data) {
      this.renderStartPage();
      console.log(data);
      services.notify(helpers.fmt('User (name: %@; id: %@) is updated', data.name, data.id));
    },

    fail: function(data) {
      console.log(data);
      services.notify(JSON.stringify(data));
    },

    /* Additional helpers */
    serializeFormData: function() {
      this.dataObjectArray = {};
      this.$userForm = this.$('.form-horizontal').eq(0);
      this.userFormData = this.$userForm.serializeArray();
      _.each(this.userFormData, function(data) {
        if (data.name === 'friends') {
          data.value = _.map(data.value.split(';'), function(name) { return name.trim(); });
          data.value = _.filter(data.value, function(name) { return name !== ''; });
          if(data.value.length === 0) { data.value = undefined; }
        }
        if (data.name === 'married') { data.value = !!data.value; }
        if (data.value === '') { data.value = undefined; }
        this.dataObjectArray[data.name] = data.value;
      }.bind(this));
    },

    validateFormData: function() {
      if (typeof(this.dataObjectArray.friends) === 'undefined' || !Array.isArray(this.dataObjectArray.friends)) {
        services.notify('You cannot have no friends!');
      } else if (typeof(this.dataObjectArray.age) === 'undefined' || typeof(parseInt(this.dataObjectArray.age, 10)) !== 'number') {
        services.notify('Your age has to be a valid number!');
      } else if (typeof(this.dataObjectArray.name) === 'undefined' || this.dataObjectArray.name === '') {
        services.notify('Invalid name!');
      } else if (typeof(this.dataObjectArray.birthday) === 'undefined' || !this.resources.DATE_PATTERN.test(this.dataObjectArray.birthday)){
        services.notify('Invalid birthday!');
      } else {
        // Return valid
        return true;
      }
      // Return invalid
      return false;
    },

    renderStartPage: function() {
      this.switchTo('start_page');
    }
  };

}());
