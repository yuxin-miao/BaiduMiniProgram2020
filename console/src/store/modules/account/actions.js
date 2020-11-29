/* ============
 * Actions for the account module
 * ============
 *
 * The actions that are available on the
 * account module.
 */

import * as types from './mutation-types';
import store from '@/store';
import { Message } from 'element-ui';
import AccountProxy from '@/proxies/AccountProxy';

export const find = ({ commit }) => {
  new AccountProxy()
    .login(payload)
    .then((response) => {
      commit(types.LOGIN, response);
      store.dispatch('account/find');
      Vue.router.push({
        name: 'home.index',
      });
    })
    .catch(() => {
      console.log('Request failed...');
      Message.error('获取用户信息失败');
    });

  const account = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'jonh@doe.com',
  };

  commit(types.FIND, Transformer.fetch(account));
};

export default {
  find,
};
