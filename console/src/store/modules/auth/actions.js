/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import Vue from 'vue';
import store from '@/store';
import * as types from './mutation-types';
import AuthProxy from '@/proxies/AuthProxy';
import { Message, Notification } from 'element-ui';

export const check = ({ commit }) => {
  commit(types.CHECK);
};

export const register = ({ commit }) => {
  /*
   * Normally you would use a proxy to register the user:
   *
   * new Proxy()
   *  .register(payload)
   *  .then((response) => {
   *    commit(types.REGISTER, response);
   *  })
   *  .catch(() => {
   *    console.log('Request failed...');
   *  });
   */
  commit(types.LOGIN, 'RandomGeneratedToken');
  Vue.router.push({
    name: 'home.index',
  });
};

export const login = ({ commit }, payload) => {
  new AuthProxy()
    .login(payload)
    .then((response) => {
      commit(types.LOGIN, response);
      store.dispatch('auth/info').then(() => {
        Vue.router.push({
          name: 'home.index',
        });
      })
    })
    .catch(() => {
      Message.error('用户名或密码错误');
    });
};

export const info = ({ commit }) => {
  new AuthProxy()
    .getInfo()
    .then((response) => {
      commit(types.USERINFO, response.username);
      Notification.success({
        title: '成功',
        message: '登录成功'
      });
    })
    .catch(() => {
      Message.error('无法获取用户信息');
    });
};

export const logout = ({ commit }) => {
  new AuthProxy()
    .logout()
    .then((response) => {
      commit(types.LOGOUT);
      Vue.router.push({
        name: 'login.index',
      });
    })
    .catch(() => {
      Message.error('无法注销');
    });

};

export default {
  check,
  register,
  login,
  logout,
  info
};
