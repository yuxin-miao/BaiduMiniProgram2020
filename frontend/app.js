/**
 * @file app.js
 * @author swan
 */

/* globals swan */
import { API } from './utils/api';
import 'weapp-cookie';
import cookies from 'weapp-cookie';

App({
    globalData: {
        host: API
    },
    onLaunch(options) {
        // do something when launch
    },
    onShow(options) {
        // do something when show
    },
    onHide() {
        // do something when hide
    },

    // *****************************
    // ***** Setters & Getters *****
    // *****************************
    getUrl(path) {
        // 返回拼接后的API地址: 域名+路由
        return this.globalData.host + path
    },
    getLocalStorage(key) {
        // 获取本地持久化数据
        let data = '';
        try {
            data = swan.getStorageSync(key);
        } catch (e) {
            console.log(e);
            data = null;
        }
        return data;
    },
    setLocalStorage(key, value) {
        // 设置本地持久化数据
        try {
            swan.setStorageSync(key, value);
        } catch (e) {
            console.log(e);
        }
    },
    isAuthenticated() {
        // 返回用户是否登录
        const username = swan.getStorageSync('username');
        return !(username === null || username.length === 0);
    },

    // *****************************
    // ********** Actions **********
    // *****************************
    login(userInfo) {
        swan.showLoading({
            title: '登录中'
        });

        swan.login({
            success: res => {
                let code = res.code || '';

                swan.request({
                    url: this.getUrl('/account/login/'),
                    method: 'POST',
                    data: {
                        code,
                        ...userInfo
                    },
                    success: res => {
                        let openID = res.data && res.data.openid;
                        this.setLocalStorage('username', res.data.username);
                        this.setLocalStorage('avatar', res.data.avatar);
                        this.setLocalStorage('gender', res.data.gender);

                        if (!openID) {
                            swan.showModal({
                                title: '登录失败',
                                content: '请退出账号后重试',
                            });
                            swan.hideLoading();
                            return;
                        }
                        this.setLocalStorage('openID', openID);
                        swan.hideLoading();
                        swan.showToast({
                            title: '登录成功'
                        });
                    },
                    fail: err => {
                        swan.showModal({
                            title: '网络异常',
                            content: '请检查网络连接'
                        });
                        swan.hideLoading();
                    }
                });
            },
            fail: err => {
                swan.showModal({
                    title: '登录失败',
                    content: '百度授权失败'
                });
                swan.hideLoading();
            }
        });
    },
    logout() {
        swan.showLoading({
            title: '退出中'
        });
        cookies.clearCookies();
        swan.clearStorageSync('username');
        swan.clearStorageSync('avatar');
        swan.clearStorageSync('gender');
        swan.request({
            url: this.getUrl('/account/logout/'),
            method: 'POST',
            success: res => {
                swan.showToast({
                    title: '退出成功',
                    icon: 'none'
                });
            },
            fail: err => {
                console.log(err);
                swan.showToast({
                    title: '退出失败',
                    icon: 'none'
                })
            }
        });
        swan.hideLoading();
    }
});
