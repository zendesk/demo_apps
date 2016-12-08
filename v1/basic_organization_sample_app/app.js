(function(){

  return {
    defaultState: 'loading',

    requests: {},

    events: {
      'app.created': function(){
        var organization = this.organization();

        this.switchTo('basic_organization_info', {
          id: organization.id(),
          name: organization.name(),
          details: organization.details(),
          notes: organization.notes(),
          domains: organization.domains(),
          group: organization.group()
        });
      }
    }
};

}());
