/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */

import Vue from 'vue';
import Axios from 'axios';
import store from '@/store';
import Cookies from 'js-cookie';

// Axios.defaults.baseURL = 'https://xiaou.tech/api/';
Axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
Axios.defaults.headers.common.Accept = 'application/json';
Axios.defaults.withCredentials = true;
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('auth/logout');
    }

    return Promise.reject(error);
  },
);

// Bind Axios to Vue.
Vue.$http = Axios;
Object.defineProperty(Vue.prototype, '$http', {
  get() {
    Axios.defaults.headers['X-CSRFToken'] = Cookies.get('csrftoken');
    return Axios;
  },
});
