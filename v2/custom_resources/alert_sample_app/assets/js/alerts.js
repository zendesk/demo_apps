const CustomResources = class CustomResources {
  constructor(client) {
    this.request = new Request(client, '/api/custom_resources');
  }

  getRelationships(resourceId, relationshipTypeKey) {
    return this.request.get(`/resources/${resourceId}/relationships/${relationshipTypeKey}`);
  }

  getRelationshipTypes() {
    return this.request.get(`/relationship_types`);
  }

  getResource(resourceId) {
    return this.request.get(`/resources/${resourceId}`);
  }

  getResources(resourceTypeKey) {
    return this.request.get(`/resources?type=${resourceTypeKey}`);
  }

  getResourceType(resourceTypeKey) {
    return this.request.get(`/resource_types/${resourceTypeKey}`);
  }
}
