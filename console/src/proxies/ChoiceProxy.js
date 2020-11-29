import Proxy from './Proxy';

class ChoiceProxy extends Proxy {
  /**
   * The constructor for the ArtistProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('choice', parameters);
  }

  getList({ page, count }) {
    return this.submit('get', `${this.endpoint}/`);
  }

  getItem(id) {
    return this.submit('get', `${this.endpoint}/${id}/`);
  }

  updateItem(data) {
    return this.submit('patch', `${this.endpoint}/${data.id}/`, data);
  }

  delete(id) {
    return this.submit('delete', `${this.endpoint}/${id}/`, { id });
  }
}

export default ChoiceProxy;
