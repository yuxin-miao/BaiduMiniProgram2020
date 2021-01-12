import Proxy from './Proxy';

class QuestionProxy extends Proxy {
  /**
   * The constructor for the ArtistProxy.
   *
   * @param {Object} parameters The query parameters.
   */
  constructor(parameters = {}) {
    super('feedback_manage', parameters);
  }

  reply(id, item) {
    return this.submit('post', `${this.endpoint}/${id}/official_reply/`, item);
  }
}

export default QuestionProxy;
