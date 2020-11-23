// var moods = require('../../utils/constants.js');
import {MoodName, MoodType} from '../../utils/constants.js';

Page({
    data: {
        //value: '2018-11-11',
        //week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        //lastMonth: 'lastMonth',
        //nextMonth: 'nextMonth',
        selectDay: '',
        thisMonth: '11',
        testString: "WOW~",
        thisMonthDays: [],
        emptyGridsBefore: [],
        emptyGridsAfter: [],
        // dayRecordMood = [
        //     {'mood': 0, 'comment': "wow~"},
        //     {'mood': 1, 'comment': "qwqqq"}
        // ],
        weekText: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        //显示日期
        title: '',
        //格式化日期
        format: '',

        year: 0,
        month: 0,
        date: 0,
        toggleType: 'large',
        scrollLeft: 0,
        //常量 用于匹配是否为当天
        YEAR: 0,
        MONTH: 0,
        DATE: 0

    },
    methods : {
        // number of days in this month
        getThisMonthDays: function(year, month) {
            return new Date(year, month, 0).getDate();
        },
        // grid for this month
        gridThisMonth: function(year, month) {
            let thisMonthDays = [],
                numberDays = this.getThisMonthDays(year, month); // call number
            for (let i = 1; i <= numberDays; i++) {
                thisMonthDays.push({
                    date: i,
                    mood: MoodName[MoodType.LIKE]
                });
            }
            return thisMonthDays;
        },
        // empty grids for this month
        emptyGrid: function(year, month) {
            let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
                emptyGridsBefore = [],
                emptyGridsAfter = [],
                emptyDays = (week == 0 ? 7 : week);
            let thisMonthDays = this.getThisMonthDays(year, month); // call this month day number
            let preMonthDays = month - 1 < 0
                ? this.getThisMonthDays(year - 1, 12) : this.getThisMonthDays(year, month - 1);

            //空出日期
            for (let i = 1; i <= emptyDays; i++) {
                emptyGridsBefore.push(preMonthDays - (emptyDays - i));
            }

            let after = (42 - thisMonthDays - emptyDays) - 7 >= 0
                        ? (42 - thisMonthDays - emptyDays) - 7
                        : (42 - thisMonthDays - emptyDays);
            for (let i = 1; i <= after; i++) {
                emptyGridsAfter.push(i);
            }
            if (emptyGridsBefore.length == 7) {
                emptyGridsBefore = [];
            }
            return { before: emptyGridsBefore, after: emptyGridsAfter};
        },
        //补全0
        zero: function (i) {
            return i >= 10 ? i : '0' + i;
        }
    },

    onLoad: function () {
        // swan.setNavigationBarTitle({
        //     title: thisMonth
        // });
        // 监听页面加载的生命周期函数

        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
        //获取年份  
        let Y =date.getFullYear();
        //获取月份  
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        let mday = this.methods.gridThisMonth(Y, M);
        let emptys = this.methods.emptyGrid(Y, M);
        // console.log(emptys.after);
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after
        })
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
        // this.today();

    },
    onShow: function() {
        // 监听页面显示的生命周期函数
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
    //选择天数
    selectDay(e) {
        // console.log('Clicked', e.currentTarget.dataset.day);
        this.setData({selectDay: e.currentTarget.dataset.day});
    }

});