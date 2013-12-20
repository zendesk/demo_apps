/* globals confirm, FormData */

(function() {
  'use strict';

  // complete app API reference can be found at
  // http://developer.zendesk.com/documentation/rest_api/apps.html

  var INSTALLATIONS_URI = '/api/v2/apps/installations.json',
      INSTALLATION_URI  = '/api/v2/apps/installations/%@',
      UPLOADS_URI       = '/api/v2/apps/uploads',
      INSTALL_URI       = '/apps/installations',
      STATUS_URI        = '/api/v2/apps/job_statuses/%@.json',
      APPS_URI          = '/api/v2/apps.json';

  return {

    requests: {
      requestInstallations: {
        url:  INSTALLATIONS_URI,
        type: 'GET'
      },

      requestApps: {
        url:  APPS_URI,
        type: 'GET'
      },

      jobStatus: function(jobId) {
        return {
          url:  helpers.fmt(STATUS_URI, jobId),
          type: 'GET'
        };
      },

      uploadApp: function(data) {
        return {
          url:         UPLOADS_URI,
          type:        'POST',
          data:        data,
          cache:       false,
          contentType: false,
          processData: false
        };
      },

      buildApp: function(data) {
        return {
          url:  APPS_URI,
          data: data,
          type: 'POST'
        };
      },

      installApp: function(data) {
        return {
          url:  INSTALL_URI,
          data: data,
          type: 'POST'
        };
      },

      activate: function(appId) {
        return {
          url:  helpers.fmt(INSTALLATION_URI, appId),
          data: { enabled: true, _method: 'PUT' },
          type: 'POST'
        };
      },

      deactivate: function(appId) {
        return {
          url:  helpers.fmt(INSTALLATION_URI, appId),
          data: { enabled: false, _method: 'PUT' },
          type: 'POST'
        };
      },

      deleteInstallation: function(appId) {
        return {
          url:  helpers.fmt(INSTALLATION_URI, appId),
          type: 'DELETE'
        };
      }
    },

    events: {
      'app.activated': 'initialize',

      // Installations
      'click .activate':                'activateApp',
      'click .deactivate':              'deactivateApp',
      'click .delete':                  'setDoomed',
      'click .agree-delete':            'deleteApp',
      'click .available-apps .install': 'startInstall',
      'click .install-button':          'setInstall',

      'requestInstallations.done': 'renderInstallations',
      'activate.done':             'initialize',
      'deactivate.done':           'initialize',
      'deleteInstallation.done':   'initialize',
      'installApp.done':           'initialize',

      // Create
      'click .create-app .btn': 'uploadApp',
      'uploadApp.done':         'buildApp',
      'jobStatus.done':         'checkProgress',

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
        this.getData(this.renderApps);
      },
      'click .nav-pills .create': function() {
        this.switchNavTo('create');
        this.switchTo('create');
      }
    },

    // RENDERS

    initialize: function() {
      this.showSpinner(true);
      this.ajax('requestInstallations');
      this.inline = this.currentLocation() === 'nav_bar';
    },

    renderInstallations: function(data) {
      data.inline = this.inline;
      this.switchNavTo('manage');
      this.switchTo('installations', data);
      this.showSpinner(false);
    },

    renderApps: function(data) {
      data.inline = this.inline;
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

    setDoomed: function(e) {
      this.doomed = this.$(e.target).data('id');
    },

    deleteApp: function() {
      this.ajax('deleteInstallation', this.doomed);
    },

    // INSTALL

    startInstall: function(e) {
      var appId = parseInt(this.$(e.target).data('id'), 10),
          apps  = this.getData().apps,
          self  = this;

      for(var i = 0; i < apps.length; ++i) {
        if (apps[i].id === appId) {
          console.log(apps[i]);
          self.switchTo('install', apps[i]);
          return;
        }
      }
    },

    setInstall: function(e) {
      var appId      = this.$(e.target).data('id'),
          formParams = this.$('.install-form').first().serializeArray(),
          objParams  = this.serializeToObj(formParams);

      objParams.app_id = appId;
      objParams.utf8 = "✓";

      this.showSpinner(true);
      this.ajax('installApp', objParams);
    },

    // UPLOAD & BUILD

    uploadApp: function() {
      var form     = this.$('.zip_upload')[0];
      var formData = new FormData(form);

      this.showSpinner(true);
      this.ajax('uploadApp', formData);
    },

    buildApp: function(data) {
      var uploadId = data.id,
          appName  = this.$('.name').first().val(),
          appDesc  = this.$('.short_description').first().val();

      var requestData = {
        'upload_id': uploadId,
        'name': appName,
        'short_description': appDesc
      };

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

    getData: function(f) {
      var self = this;

      if (this.hasOwnProperty('data')) {
        return f ? f.apply(self, [this.data]) : this.data;
      } else {
        this.ajax('requestApps')
          .then(function(data) {
            self.data = data;
            return f ? f.apply(self, [data]) : data;
          });
      }
    },

    showSpinner: function(show) {
      if (show) {
        this.$('.main').addClass('loading');
        this.$('.loading-spinner').css('display', 'block');
      } else {
        this.$('.main').removeClass('loading');
        this.$('.loading-spinner').css('display', 'none');
      }
    },

    serializeToObj: function(array) {
      var o = {};

      array.forEach(function(b) {
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

      this.$('.nav-pills li').removeClass('active');
      this.$('.nav-pills li' + itemClass).addClass('active');
    }
  };

}());
