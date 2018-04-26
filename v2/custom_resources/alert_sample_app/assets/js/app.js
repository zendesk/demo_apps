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

  // Setup HTML event bindings
  bindEvents() {
    this.elements.name.addEventListener('change', this.onChange.bind(this));
    this.elements.save.addEventListener('click', this.onSave.bind(this));
  }

  getTicketRequesterId() {
    const path = 'ticket.requester.id';
    return this.client.get(path)
                      .then((response) => {
                        const id = response[path];
                        return new Promise(resolve => {
                          return resolve(id);
                        });
                      });
  }

  init() {
    this.bindEvents();
    this.resize(this.config.height);

    const requesterIdPromise = this.getTicketRequesterId();
    const resourcesPromise   = this.customResources.getResources(this.config.productResourceTypeKey);

    // When the promises in the array have resolved, do something
    Promise.all([requesterIdPromise, resourcesPromise]).then(responses => {
      const requesterId = responses[0];
      const products    = responses[1].data;

      // Set the current requester
      this.elements.save.setAttribute('data-requester-id', requesterId);

      // Set the values in the dropdown
      this.populateProductDropdown(this.elements.name, products);

      // Get the current relationships, to work out what product the user has
      const relationshipsPromise = this.customResources.getRelationships(
        `${this.config.userResourceTypeKey}:${requesterId}`,
        this.config.relationshipTypeKey
      ).then(response => {
        // Set the current product
        if (response.data.length === 1 && products.length > 0) {
          const relationship    = response.data[0];
          const relatedProducts = products.filter(p => p.id === relationship.target);

          this.elements.save.setAttribute('data-relationship-id', relationship.id);

          if (relatedProducts.length === 1) {
            const product = relatedProducts[0];
            this.populateProductDetails(product, true);
          }
        }
      });
    });
  }

  onChange(event) {
    const select     = event.currentTarget;
    const option     = select.selectedOptions[0];
    const resourceId = option.value;

    if (resourceId !== "") {
      this.customResources.getResource(resourceId).then(response => {
        this.populateProductDetails(response.data);
      });
    } else {
      this.populateProductDetails();
    }
  }

  onSave(event) {
    const button         = event.currentTarget;
    const isDisabled     = button.classList.contains('is-disabled');
    const productId      = button.getAttribute('data-product-id');
    const relationshipId = button.getAttribute('data-relationship-id');
    const requesterId    = button.getAttribute('data-requester-id');

    if (isDisabled) { return; }

    // Delete the existing relationship
    if (relationshipId) {
      this.customResources.deleteRelationship(relationshipId);
    }
    // Create the new relationship
    this.customResources.createRelationship(
      this.config.relationshipTypeKey,
      `${this.config.userResourceTypeKey}:${requesterId}`,
      productId
    ).then(response => {
      this.notify('Saved');
      button.classList.add('is-disabled');
      button.setAttribute('data-relationship-id', response.data.id);
    }, error => {
      this.notify('Something went wrong!', 'error');
    });
  }

  notify(message, kind = 'notice') {
    this.client.invoke('notify', message, kind);
  }

  // Update the fields displaying the product details
  populateProductDetails(product, disableButton = false) {
    let id       = '';
    let annually = '';
    let monthly  = '';
    let during   = '';
    let minutes  = '';

    if (product) {
      const attributes = product.attributes;
      id               = product.id;
      annually         = `$${attributes.price.annually} annually`;
      monthly          = `$${attributes.price.monthly || 0} monthly`;
      during           = `${attributes.sla.during}`;
      minutes          = `${attributes.sla.minutes} minutes`;

      // Set the selected option
      for (let i = 0; i < this.elements.name.options.length; i++) {
        let option = this.elements.name.options[i];
        option.selected = option.value === id;
      }

      if (!disableButton) {
        this.elements.save.classList.remove('is-disabled');
      }
    } else {
      this.elements.save.classList.add('is-disabled');
    }

    this.elements.price.annually.innerText = annually;
    this.elements.price.monthly.innerText  = monthly;
    this.elements.sla.during.innerText     = during;
    this.elements.sla.minutes.innerText    = minutes;

    this.elements.save.setAttribute('data-product-id', id);
  }

  // Populate the dropdown with a list of available products
  populateProductDropdown(dropdown, products) {
    products.forEach(product => {
      const id         = product.id;
      const attributes = product.attributes;

      // Create dropdown elements, and set data
      let option       = document.createElement('option');
      option.innerText = attributes.name;
      option.setAttribute('value', id);

      // Append to dropdown
      dropdown.appendChild(option);
    }, this);
  }

  resize(height) {
    this.client.invoke('resize', {
      height: height
    });
  }
};
