
/* globals swan */
import { API } from './utils/api';
import 'weapp-cookie';
import cookies from 'weapp-cookie';

App({
    globalData: {
        host: API,
    },
    onLaunch(options) {

        // this.firstOrNot();
    },
    onShow(options) {
        // do something when show
        // this.firstOrNot();
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
        return !(username === undefined || username === null || username.length === 0);
    },
    setNavigationData() {
        let menuHeight = '';
        swan.getMenuButtonBoundingClientRect({
            success: res => {
                console.log('menuHeight', res);
                if(res.top) {
                    menuHeight = res.top;
                }
                else {
                    console.log("胶囊高度获取失败");
                    menuHeight = 32;
                }

            }
        })

        swan.getSystemInfo({
            success: res => {
                console.log('getSystemInfo', res);
                let isIOS = res.model.indexOf('iOS') > -1;
                let tempHeight = 44;
                if (!isIOS) {
                    tempHeight = 48;
                }
                this.setData({
                    navHeight: tempHeight,
                    statusHeight: res.statusBarHeight,
                });

                if (res.model && (res.model.indexOf('iPhone X') > -1) || (res.model === 'iPhone Simulator <x86-64>' && res.screenWidth === 375)) {
                    this.setData({
                        isIPhoneX: true
                    })
                }
                else {
                    this.setData({
                        isIPhoneX: false
                    })
                }
            },
            fail: res => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        })
    },

    // *****************************
    // ********** Actions **********
    // *****************************
    login(toSuc, toFail) {
        cookies.clearCookies();
        swan.login({
            success: res => {
                swan.showLoading({
                    title: '登录中'
                });

                let code = res.code || '';

                swan.request({
                    url: this.getUrl('/account/login/'),
                    method: 'POST',
                    data: {
                        code
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
                        if (toSuc) toSuc();
                    },
                    fail: err => {
                        swan.showModal({
                            title: '网络异常',
                            content: '请检查网络连接'
                        });
                        swan.hideLoading();
                        if (toFail) toFail();
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
    },
    
    firstOrNot: function() {
        // swan.navigateTo({
        //     url: '/pages/record/record'
        // })
        // let data = this.getLocalStorage('username');
        if (this.isAuthenticated()) {
            swan.redirectTo({
                url: '/pages/main/main'
            });
        }
        else {
            swan.redirectTo({
                url: '/index/index'
            });
        }
    },

    whetherWeb(e) {
        swan.getSystemInfo({
            success: res => {
                if (res.platform == 'web') {
                    console.log('res', res.platform); // web
                    swan.showModal({
                        title: "提示",
                        content: '请下载百度app体验'
                    })
                    swan.redirectTo({
                        url: '/pages/main/main'
                    })
                }
            },
            fail: err => {
    
            }
        });
    }
});
