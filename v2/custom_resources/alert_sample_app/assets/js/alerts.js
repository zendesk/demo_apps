const CustomResources = class CustomResources {
  constructor(client) {
    this.request = new Request(client, '/api/custom_resources');
  }

  createProduct(attributes) {
    const data = {
      type: this.config.productResourceType,
      attributes: attributes
    };

    this.request.post('/resources', data);
  }

  createRelationship(relationshipTypeKey, source, target) {
    const data = {
      data: {
        relationship_type: relationshipTypeKey,
        source: source,
        target: target
      }
    };

    return this.request.post('/relationships', data);
  }

  deleteRelationship(relationshipId) {
    return this.request.delete(`/relationships/${relationshipId}`);
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
