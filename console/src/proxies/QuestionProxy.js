import Proxy from './Proxy';

class QuestionProxy extends Proxy {
  /**
   * The constructor for the ArtistProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('question', parameters);
  }

  getList({ page, count }) {
    return this.submit('get', `${this.endpoint}/`);
  }

  getItem(id) {
    return this.submit('get', `${this.endpoint}/${id}/`);
  }

  delete(id) {
    return this.submit('delete', `${this.endpoint}/${id}/`, { id });
  }
}

export default QuestionProxy;
