const ZenType = class ZenType {
	constructor() {
		this.location = this.getLocation();
		this.setType();
	}

  getLocation() {
    const queryString  = window.location.search;
    const searchParams = new URLSearchParams(queryString);
    const location     = searchParams.get('location');

    return location;
  }

  setType() {
    if (this.location === 'organization_sidebar') {
      this.type = 'organization';
      this.relationshipTypeKey = 'organization_to_alerts';
    } else if (this.location === 'ticket_sidebar') {
      this.type = 'ticket';
      this.relationshipTypeKey = 'ticket_to_alerts';
    } else if (this.location === 'user_sidebar') {
      this.type = 'user';
      this.relationshipTypeKey = 'user_to_alerts';
    } else {
      throw 'Invalid location';
    }
  }
}
