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
        userInfo: 'user',
        host: API,
        user: {
            username: '',

        }
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
    getUrl(path) {
        // 返回拼接后的API地址: 域名+路由
        return this.globalData.host + path
    },
    getOpenID() {
        // get localStorage
        let openID = '';
        try {
            openID = swan.getStorageSync('openID');
        } catch (e) {
            console.log(e);
            openID = '';
        }
        return openID;
    },
    setOpenID(openID) {
        try {
            swan.setStorageSync('openID', openID);
        } catch (e) {
            console.log(e);
        }
    },
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

                        if (!openID) {
                            swan.showModal({
                                title: '登录失败',
                                content: '请退出账号后重试',
                            });
                            swan.hideLoading();
                            return;
                        }
                        getApp().setOpenID(openID);
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
        cookies.clearCookies();
        swan.request({
            url: this.getUrl('/account/logout/'),
            method: 'POST',
            success: res => {
                swan.showToast({
                    title: '退出成功',
                    icon: 'none'
                })
            },
            fail: err => {
                console.log(err);
                swan.showToast({
                    title: '退出失败',
                    icon: 'none'
                })
            }
        })
    }
});
