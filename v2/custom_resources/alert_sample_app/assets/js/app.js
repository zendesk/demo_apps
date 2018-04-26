const App = class App {
  constructor(client) {
    this.client = client;
    this.customResources = new CustomResources(client);
    this.config = {
      height: '320px',
      productResourceTypeKey: 'product',
      relationshipTypeKey: 'user_pays_for_product',
      userResourceTypeKey: 'zen:user'
    };
    this.elements = {
      name: this.$('.current.product .name select'),
      notification: this.$('.notification'),
      price: {
        annually: this.$('.current.product .price .annually'),
        monthly: this.$('.current.product .price .monthly')
      },
      save: this.$('.current.product button'),
      sla: {
        during: this.$('.current.product .sla .during'),
        minutes: this.$('.current.product .sla .minutes')
      }
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

      const ticketRelationshipsPromise = this.customResources.getRelationships('zen:ticket:' + ticketId, 'tickets_to_alerts');

      ticketRelationshipsPromise.then(relResponse => {
        const relationships = relResponse.data;
        if (relationships.length > 0) {
          for (i = 0; i < relationships.length; i++) {
            const alertId = relationships[i].target;

            // Fetching alert from Custom Resources
            const alertPromise = this.customResources.getResource(alertId);
            alertPromise.then(alertResponse => {
              if (alertResponse.data) {
                const alertMsg = alertResponse.data.attributes.message;
                this.displayAlert(alertMsg);
              }
            });
          }
        }
      });
    });
  }

  displayAlert(message) {
    return 'foo';
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
