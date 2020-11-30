const app = getApp();

Page({
    data: {
        username: '',
        avatar: ''
    },
    bindKeyfocus(e){
    },
    bindKeyblur(e) {
        swan.showToast({
            title: '普通input失焦事件',
            icon: 'none'
        });
    },
    bindKeycomfirm(e) {
        swan.showToast({
            title: '点击确定',
            icon: 'none'
        });
    },
    onLoad: function () {

    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        this.setData({
            username: app.getLocalStorage('username'),
            avatar: app.getLocalStorage('avatar')
         });
         console.log(app.isAuthenticated());
    },

    login(e) {
        let userInfo = e.detail;
        getApp().login();
    },
    logout() {
        getApp().logout();
    },
    getUser() {
        swan.request({
            url: getApp().getUrl('/account/user/'),
            success: res => {
                console.log(res);
            },
            fail: err => {
                console.log(err);
            }
        })
    }
});