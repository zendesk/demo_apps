const Request = class Request {
  constructor(client, basePath) {
    this.basePath       = basePath;
    this.client         = client;
    this.defaultOptions = {
      dataType: 'json'
    };
  }

  delete(path, options = {}) {
    return this.send(path, 'DELETE', options)
  }

  get(path, options = {}) {
    return this.send(path, 'GET', options);
  }

  patch(path, data = {}, options = {}) {
    const requestOptions = Object.assign({
      data: JSON.stringify(data)
    }, options);

    return this.send(path, 'PATCH', requestOptions)
  }

  post(path, data = {}, options = {}) {
    const requestOptions = Object.assign({
      data: JSON.stringify(data)
    }, options);

    return this.send(path, 'POST', requestOptions)
  }

  send(path, method, options = {}) {
    const requestOptions = Object.assign({
      type: method,
      url: `${this.basePath}${path}`
    }, options, this.defaultOptions);

    console.info('Sending %s %s %o', method, path, requestOptions);
    return this.client.request(requestOptions);
  }
}
