/*globals confirm, FormData */

(function() {

  var INSTALLATIONS_URI = "/api/v2/apps/installations.json",
      INSTALLATION_URI  = "/api/v2/apps/installations/%@.json",
      UPLOADS_URI       = "/api/v2/apps/uploads",
      STATUS_URI        = "/api/v2/apps/job_statuses/%@.json",
      APPS_URI          = "/api/v2/apps.json";

  return {

    requests: {
      getInstallations: {
        url: INSTALLATIONS_URI,
        type: 'GET'
      },

      getApps: {
        url: APPS_URI,
        type: 'GET'
      },

      getApp: {
        url: APPS_URI,
        type: 'GET'
      },

      jobStatus: function(jobId) {
        return {
          url: helpers.fmt(STATUS_URI, jobId),
          type: 'GET'
        };
      },

      uploadApp: function(data) {
        return {
          url: UPLOADS_URI,
          type: 'POST',
          data: data,
          cache: false,
          contentType: false,
          processData: false
        };
      },

      buildApp: function(data) {
        return {
          url: APPS_URI,
          type: 'POST',
          data: data,
          contentType: 'application/json'
        };
      },

      installApp: function(data) {
        return {
          url: INSTALLATIONS_URI,
          data: data,
          contentType:  'application/json',
          type: 'POST'
        };
      },

      activate: function(appId) {
        return {
          url:          helpers.fmt(INSTALLATION_URI, appId),
          data:         '{"enabled": true}',
          contentType:  'application/json',
          type:         'PUT'
        };
      },

      deactivate: function(appId) {
        return {
          url:          helpers.fmt(INSTALLATION_URI, appId),
          data:         '{"enabled": false}',
          contentType:  'application/json',
          type:         'PUT'
        };
      },

      deleteInstallation: function(appId) {
        return {
          url:          helpers.fmt(INSTALLATION_URI, appId),
          type:         'DELETE'
        };
      }
    },

    events: {
      'app.activated':'initialize',

      // Installations
      'click .activate':          'activateApp',
      'click .deactivate':        'deactivateApp',
      'click .delete':            'deleteApp',
      'click #apps .install':     'startInstall',
      'click #install .install':  'setInstall',

      'getInstallations.done':    'renderInstallations',
      'getApps.done':             'renderApps',
      'activate.done':            'initialize',
      'deactivate.done':          'initialize',
      'deleteInstallation.done':  'initialize',
      'installApp.done':          'initialize',

      // Create
      'click #create_app':        'uploadApp',
      'uploadApp.done':           'buildApp',
      'jobStatus.done':           'checkProgress',

      'buildApp.done': function(data) {
        this.pollProgress(data.job_id);
      },
      'uploadApp.fail': function() {
        this.showSpinner(false);
      },

      // Navigation
      'click .nav-pills .manage': 'initialize',
      'click .nav-pills .install': function() {
        this.showSpinner(true);
        this.ajax('getApps');
      },
      'click .nav-pills .create': function() {
        this.switchTo('create');
        this.switchNavTo('create');
      }
    },

    // RENDERS

    initialize: function() {
      this.showSpinner(true);
      this.ajax('getInstallations');
    },

    renderInstallations: function(data) {
      this.switchNavTo('manage');
      this.switchTo('installations', data);
      this.showSpinner(false);
    },

    renderApps: function(data) {
      this.switchNavTo('install');
      this.switchTo('apps', data);
      this.showSpinner(false);
    },

    // INSTALLATION MANAGEMENT

    activateApp: function(e) {
      var appId = this.$(e.target).data('id');

      this.ajax('activate', appId);
    },

    deactivateApp: function(e) {
      var appId = this.$(e.target).data('id');

      this.ajax('deactivate', appId);
    },

    deleteApp: function(e) {
      var appId =     this.$(e.target).data('id'),
          challenge = confirm("No really, this will delete the installation. Are you sure?");

      if (challenge === true) {
        this.ajax('deleteInstallation', appId);
      } else {
        return;
      }
    },

    // INSTALL

    startInstall: function(e) {
      var appId = this.$(e.target).data('id'),
          self  = this;

      self.showSpinner(true);

      self.ajax('getApp')
        .done(function(data) {
          var apps = data.apps,
              match;

          apps.forEach(function(app) {
            if (app.id === appId) {
              self.showSpinner(false);
              self.switchTo('install', app);
            }
          });
        });
    },

    setInstall: function(e) {
      var appId      = this.$(e.target).data('id'),
          formParams = this.$("form#install").serializeArray(),
          objParams  = this.serializeToObj(formParams);

      var requestData = '{"app_id":' + appId + ', "settings":' + JSON.stringify(objParams) + '}';

      this.showSpinner(true);
      this.ajax('installApp', requestData);
    },

    // UPLOAD & BUILD

    uploadApp: function() {
      var form = this.$("#zip_upload")[0];
      var formData = new FormData(form);

      this.showSpinner(true);
      this.ajax('uploadApp', formData);
    },

    buildApp: function(data) {
      var uploadId = data.id,
          appName  = this.$("#name").val(),
          appDesc  = this.$("#short_description").val();

      // To update an existing app, replace 'name' with 'app_id',
      // where the value is the ID of the app to be updated
      var requestData = '{"upload_id": ' + uploadId + ', "name": "' + appName + '", "short_description": "' + appDesc + '"}';

      this.ajax('buildApp', requestData);
    },

    pollProgress: function(jobId) {
      var self = this;

      setTimeout(function(){
        self.ajax('jobStatus', jobId);
      }, 1500);
    },

    checkProgress: function(progressData) {
      var jobId     = progressData.id,
          jobStatus = progressData.status;

      if (jobStatus === 'completed') {
        this.initialize();
      } else if (jobStatus === 'queued' || jobStatus === 'working') {
        this.pollProgress(jobId);
      } else {
        this.showSpinner(false);
      }
    },

    // HELPERS

    showSpinner: function(show) {
      if (show) {
        this.$('.main').addClass('loading');
      } else {
        this.$('.main').removeClass('loading');
      }
    },

    serializeToObj: function(array) {
      var o = {},
          a = array;

      a.forEach(function(b) {
        if (o[b.name] !== undefined) {
            if (!o[b.name].push) {
                o[b.name] = [o[b.name]];
            }
            o[b.name].push(b.value || '');
        } else {
            o[b.name] = b.value || '';
        }
      });
      return o;
    },

    switchNavTo: function(itemClass) {
      itemClass = '.' + itemClass;

      this.$(".nav-pills li").removeClass('active');
      this.$(".nav-pills li" + itemClass).addClass('active');
    }
  };

}());
