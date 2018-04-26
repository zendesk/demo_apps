const App = class App {
  constructor(client) {
    this.client = client;
    this.customResources = new CustomResources(client);
    this.config = {
      height: '320px',
      relationshipTypeKey: 'ticket_to_alert'
    };
    this.location = {
      organization: 'organization_sidebar',
      ticket: 'ticket_sidebar',
      user: 'user_sidebar'
    };
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
      `zen:${this.getZenType()}:${id}`,
      this.config.relationshipTypeKey
    );
  }

  getZenIdPromise() {
    const path = `${this.getZenType()}.id`;
    return this.client.get(path)
                      .then((response) => {
                        const id = response[path];
                        return new Promise(resolve => {
                          return resolve(id);
                        });
                      });
  }

  getZenType() {
    if (this.isOrganizationSidebar()) {
      return 'organization';
    } else if (this.isTicketSidebar()) {
      return 'ticket';
    } else if (this.isUserSidebar()) {
      return 'user'
    } else {
      throw 'Invalid location';
    }
  }

  init() {
    this.resize(this.config.height);

    const zenIdPromise = this.getZenIdPromise();

    // When the promises in the array have resolved, do something
    zenIdPromise.then(id => {
      const relationshipsPromise = this.getRelationshipsPromise(id);

      relationshipsPromise.then(this.relationshipsHandler);
    });
  }

  isOrganizationSidebar() {
    return this.getLocation() === this.location.organization;
  }

  isTicketSidebar() {
    return this.getLocation() === this.location.ticket;
  }

  isUserSidebar() {
    return this.getLocation() === this.location.user;
  }

  notify(message, kind = 'notice') {
    this.client.invoke('notify', message, kind);
  }

  relationshipsHandler(response) {
    const relationships = response.data;
    if (relationships.length > 0) {
      for (let i = 0; i < relationships.length; i++) {
        const alertId = relationships[i].target;
        const alertPromise = this.getResourcePromise(alertId);

        alertPromise.then(this.resourceHandler);
      }
    }
  }

  resize(height) {
    this.client.invoke('resize', {
      height: height
    });
  }

  resourceHandler(response) {
    if (response.data) {
      const alertMsg = alertResponse.data.attributes.contents;
      this.displayAlert(alertMsg);
    }
  }
};
