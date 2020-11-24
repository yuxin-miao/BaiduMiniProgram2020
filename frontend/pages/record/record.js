import {createMoodRecord} from  '../../utils/api.js';
import {MoodNumber} from '../../utils/constants.js';

const app = getApp();

Page({
    data: {
        username: '',
        avatar: '',
        moodtype: [ "smile", "like",  "happy", "upset", "sad", "angry", "ok"
        ],
        selectedMood: "smile",
        moodDescription: ''
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        this.setData({
            username: app.getLocalStorage('username'),
            avatar: app.getLocalStorage('avatar')
         });
         console.log(app.isAuthenticated());
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    selectMood(e) {
        // console.log('Clicked', e.currentTarget.dataset.mood);
        this.setData({selectedMood: e.currentTarget.dataset.mood});
    },
    createMood() {
        // let type = this.data.selectedMood;
        // console.log(MoodNumber[type]);
        console.log(this.data.selectedMood);
        let moodType = MoodNumber[this.data.selectedMood];
        console.log(moodType);
        // if(!moodType) {
        //     swan.showModal({
        //         title: '提交失败',
        //         content: '请选择今日心情',
        //     });
        // }
        // else {
        createMoodRecord({
            type: moodType,
            description: this.data.moodDescription
        });
        swan.showToast({
            title: '记录成功',
            image: "../../images/avatar.png",
            duration: 1500
        })
        // }
    },
    MoodDescription: function(e) {
        this.setData({
            moodDescription: e.detail.value
        })
    }
});