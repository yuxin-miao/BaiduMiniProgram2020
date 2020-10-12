/**
 * @file index.js
 * @author swan
 */
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo')
    },
    getUserInfo(e) {
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    },
    data: {
        defaultTabBarStyle: {
            color: '#7A7E83',
            selectedColor: '#3cc51f',
            backgroundColor: '#ffffff'
        },
        defaultItemName: '接口'
    },
    customStyle() {
        if (this.data.hasCustomedStyle) {
            this.removeCustomStyle()
            return
        }
        this.setData({hasCustomedStyle: true})
        swan.setTabBarStyle({
            color: '#FFF',
            selectedColor: '#1AAD19',
            backgroundColor: '#000000'
        })
    },
    removeCustomStyle() {
        this.setData({hasCustomedStyle: false})
        swan.setTabBarStyle(this.data.defaultTabBarStyle)
    }
})
