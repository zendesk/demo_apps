const App = class App {
  constructor(client) {
    this.client = client;
    this.customResources = new CustomResources(client);
    this.config = {
      height: '320px',
    };
    this.zenType = new ZenType();
    this.alertResourceType = 'alert';
  }

  // Helper to find HTML elements
  $(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 1) {
      return elements[0];
    }

    return elements;
  }

  displayAlert(message) {
    let p = document.createElement('p');
    p.innerText = message;
    this.$('body').appendChild(p);
  }

  getLocation() {
    const queryString  = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    const location     = searchParams.get('location');

    return location;
  }

  getResourcePromise(id) {
    return this.customResources.getResource(id);
  }

  getRelationshipsPromise(id) {
    return this.customResources.getRelationships(
      `zen:${this.zenType.type}:${id}`,
      this.zenType.relationshipTypeKey
    );
  }

  getZenIdPromise() {
    const path = `${this.zenType.type}.id`;
    return this.client.get(path)
                      .then(response => response[path]);
  }

  init() {
    const self = this
    
    this.resize(this.config.height);

    this.$('.new-alert').onsubmit = function(e) {
      e.preventDefault();

      self.alertsParent.innerHTML = '<p>Loading...<p>';

      const contents = this.querySelector('textarea').value;
      const level = this.querySelector('select').value;

      if (contents === '') {
        return;
      }

      const resourcesPath = `${self.customResources.request.basePath}/resources`;
      const relationshipsPath = `${self.customResources.request.basePath}/relationships`;

      self.customResources.request.post(resourcesPath, {
        data: {
          type: self.alertResourceType,
          attributes: {
            contents: contents,
            level: level
          }
        }
      }).then((newAlert) => {
        self.customResources.request.post(relationshipsPath, {
          data: {
            relationship_type: self.zenType.relationshipTypeKey,
            source: `zen:${self.zenType.type}:${self.zenId}`,
            target: newAlert.data.id
          }
        }).then(() => {
          self.populateAlerts()
        });
      })
    };

    const zenIdPromise = this.getZenIdPromise();

    // When the promises in the array have resolved, do something
    zenIdPromise.then(id => {
      this.zenId = id;

      this.populateAlerts();

      // Enable once we have `this.zenId`.
      const button = this.$('.new-alert button')
      button.disabled = false;
      button.classList.remove('is-disabled')
    });
  }

  notify(message, kind = 'notice') {
    this.client.invoke('notify', message, kind);
  }

  populateAlerts() {
    const self = this;

    this.alertsParent = self.$('.existing-alerts');

    this.getRelationshipsPromise(this.zenId)
      .then(function(relationshipsResponse) {
        const relationships = relationshipsResponse.data;

        const getAlertsPromises = relationships.map(rela => {
          return self.getResourcePromise(rela.target);
        });

        Promise.all(getAlertsPromises).then(alerts => {
          if (alerts.length) {
            const existingAlertsMarkup = alerts.map(alert => {
              const contents = alert.data.attributes.contents
              const level = alert.data.attributes.level

              const cCalloutLevelClass = {
                low: 'c-callout--success',
                medium: 'c-callout--warning',
                high: 'c-callout--error'
              }[level] || ''

              return `<div class="existing-alert c-callout ${cCalloutLevelClass}">${contents}</div>`
            }).join('');

            self.alertsParent.innerHTML = existingAlertsMarkup;
          } else {
            self.alertsParent.innerHTML = '<p>No alerts.</p>';
          }
        });
      });
  }

  resize(height) {
    this.client.invoke('resize', {
      height: height
    });
  }
};
