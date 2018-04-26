const App = class App {
  constructor(client) {
    this.client = client;
    this.customResources = new CustomResources(client);
    this.config = {
      height: '320px',
      relationshipTypeKey: 'ticket_to_alert'
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

  getTicketId() {
    const path = 'ticket.id';
    return this.client.get(path)
                      .then((response) => {
                        const id = response[path];
                        return new Promise(resolve => {
                          return resolve(id);
                        });
                      });
  }

  init() {
    this.resize(this.config.height);

    const ticketIdPromise = this.getTicketId();

    // When the promises in the array have resolved, do something
    ticketIdPromise.then(response => {
      const ticketId = response;

      const ticketRelationshipsPromise = this.customResources.getRelationships('zen:ticket:' + ticketId, this.config.relationshipTypeKey);

      ticketRelationshipsPromise.then(relResponse => {
        const relationships = relResponse.data;
        if (relationships.length > 0) {
          for (i = 0; i < relationships.length; i++) {
            const alertId = relationships[i].target;

            // Fetching alert from Custom Resources
            const alertPromise = this.customResources.getResource(alertId);
            alertPromise.then(alertResponse => {
              if (alertResponse.data) {
                const alertMsg = alertResponse.data.attributes.contents;
                this.displayAlert(alertMsg);
              }
            });
          }
        }
      });
    });
  }

  displayAlert(message) {
    let p = document.createElement('p');
    p.innerText = message;
    this.$('body').appendChild(p);
  }

  notify(message, kind = 'notice') {
    this.client.invoke('notify', message, kind);
  }

  resize(height) {
    this.client.invoke('resize', {
      height: height
    });
  }
};
