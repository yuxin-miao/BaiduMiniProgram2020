/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import {
  CHECK,
  REGISTER,
  LOGIN,
  LOGOUT,
} from './mutation-types';

/* eslint-disable no-param-reassign */
export default {
  [CHECK](state) {
    // state.authenticated = !!localStorage.getItem('id_token');
    // if (state.authenticated) {
    //   Vue.$http.defaults.headers.common.CSRF = `Bearer ${localStorage.getItem('id_token')}`;
    // }
  },

  [REGISTER]() {
    //
  },

  [LOGIN](state) {
    state.authenticated = true;
  },

  [LOGOUT](state) {
    state.authenticated = false;
  },
};
