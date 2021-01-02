var util = require('../../utils/util.js');
import {letUserLogin} from  '../../utils/api.js';

let scrollOne = false;
let newMonth = true;

let startX = 0;
let thisMonth = 0;
let thisYear = 0;
var constYear = 0;
var constMonth = 0;

Page({
    data: {
        screenWidth: 0,
        scrollOneCard: 0,
        scrollWholeCard: 0,
        leftCardNum: 0,
        leftdis: 0,
        scrollLeft: 0, // need to set AFTER scroll-view load finished 
        scrollToday: 0,
        toView: 0,

        allMonths: [], // [{month: ,id: }, {month: ,id: }] id is the first date in this card 
        gNum: 3,
        // gMages: [],
        imgLoaded: 1,
        getSelectMonth: {},
        today: 0, 
        todayID: 0,
        days: [],
        weekGratitude: [], // item [{day: , description: }]  [{day: , description: }] in array for each week
        eachDayGratiture: [], //[  [ {day: ,description: []}, {day: }, ], []  ]
        eDays: [{day: 0, description: []}],
        openCard: 0,
        openIdx: 0,
        monthName: ['JAN', 'FEB', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'],
        monthSmallName: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
         // for card scroll 
        
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        let that = this;
        swan.getSystemInfo({
            success: res => {
                that.setData({
                    windowWidth: res.windowWidth,
                    scrollOneCard: res.windowWidth * 0.5205,
                    scrollWholeCard: res.windowWidth * 0.655,
                })
            },
            fail: err => {
                that.setData({
                    windowWidth: 400,
                    scrollOneCard: 400 * 0.695,
                })
                swan.showToast({
                    title: '信息获取失败',
                    icon: 'none',
                })
            }
        })
        // set card number according to date 
        let dictD = util.dictDate(new Date());
        let numberDays = this.getThisMonthDays(dictD.year, dictD.month);
        thisMonth = dictD.month;
        constMonth = dictD.month;
        thisYear = dictD.year;
        constYear = dictD.year;
        this.loadOneMonth(dictD.year, dictD.month, dictD.day, numberDays, false);


    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数

    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        // newMonth = false;
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
    getThisMonthDays: function(year, month) {
        return new Date(year, month, 0).getDate();
    },
    setTodayIntoView: function(){
        
    },
    loadOneMonth: function(year, month, toWhichDay, numberDays, isPrev) {
        // console.log('begin', this.data.weekGratitude, year, month, toWhichDay, numberDays);
        let tempDG = this.data.weekGratitude;
        let tempEachDays = this.data.eachDayGratiture;
        let tempD = this.data.days;
        let tempM = this.data.allMonths;
        let tempId = 0;
        let holdLength = this.data.allMonths.length;
        let tempRightNum = this.data.allMonths.length;
        let tempAllNum = this.data.allMonths.length;
        let tempMName = this.data.monthName[month - 1];
        let hasSetToWhich = false;
        let isPrevIndex = this.data.allMonths.length;
        // console.log('0', this.data.allMonths.length, tempM.length)

        for (let i = 1; i <= numberDays - 6; i+=7){
            tempAllNum = tempAllNum + 1;
            if (toWhichDay <= i + 6 && !hasSetToWhich) {
                hasSetToWhich = true
                // console.log('towhi', tempAllNum, toWhichDay)
                tempRightNum = tempAllNum - 1;
                tempId = i;
            }
            if (isPrev === false) {
                tempM.unshift({
                    month: tempMName,
                    id: i,
                })
                tempD.unshift(i + 6, i);
            }
            else {
                console.log('rightIn1', tempM, tempD, isPrevIndex)

                tempM.splice(
                    isPrevIndex, 0, {
                        month: tempMName,
                        id: i,
                    }
                )
                tempD.splice(
                    isPrevIndex, 0, i + 6, i
                )
                isPrevIndex += 1;
                console.log('rightIn', tempM, tempD, isPrevIndex)
            }
        }
        if (tempD[0] != numberDays) {
            if (tempD.length % 2) {
                if (isPrev === false) {
                    tempD.unshift(numberDays);
                }
            }
            else {
                tempAllNum = tempAllNum + 1;
                let first = tempD[0] + 1;
                if (tempId == 0) tempId = first;
                if (isPrev === false) {
                    tempM.unshift({
                        month: tempMName,
                        id: first,
                    })
                    tempD.unshift(numberDays, first);
                }

                
            }
        }
        // console.log('1', this.data.allMonths.length, tempM.length)
        for (let i = 0; i < tempM.length - holdLength; i++) {
            if (isPrev === false) {
                tempDG.unshift([]);
                tempEachDays.unshift([{}]);
            }
            else {
                // tempDG.push([]);
                // tempEachDays.push([{}]);
            }

        }
        // tempM.forEach(ele => {

        // })
        if (year != constYear || month != constMonth) {
            tempRightNum = holdLength;
        }
        let tempLeftWhole = (tempAllNum - tempRightNum ) == 0 ? 1 : (tempAllNum - tempRightNum);
        tempLeftWhole = (tempRightNum == 0) ? tempAllNum - 1 : tempLeftWhole;
        // console.log('tempLeftWhole', tempLeftWhole)
        this.setData({
            getSelectMonth: {year: year, month: month},
            today: toWhichDay,
            days: tempD,
            allMonths: tempM,
            weekGratitude: tempDG,
            eachDayGratiture: tempEachDays,
            toView: tempId,
            leftCardNum: tempLeftWhole,
        }, ()=>{
            this.setScrollLeft();
            // console.log('loadOne', tempDG)
            this.moodTypeGratitude({year: year, month: month});
        })
        
    },
    returnNav(e) {
        swan.navigateBack();
    },
    downLoadGMage: function() {

        var that = this;
        let tempSrc = this.data.gMages;

        this.data.gUrls.forEach(eachUrl => {

            swan.downloadFile({
                url: eachUrl,
                success: function (res) {

                    if (res.statusCode === 200) {
                        let eachSrc = res.tempFilePath; //下载成功返回结果
                        tempSrc.push(eachSrc);
                        that.setData({
                            gMages: tempSrc
                        })
                    }
                    else {
                        swan.showToast({
                        title: '加载失败！',
                        icon: 'none',
                        duration: 2000});
                    }
                }
            });
        });
    },
        /* util functions for getting data */
    moodTypeGratitude: function (selectMonth) {
            // send data: selectMonth(year & month)
            // return the moodType & gratitudeRecord
            // used when first enter / change month
        swan.request({
            url: getApp().getUrl('/mood/month/'),
            method: 'GET',
            data: selectMonth,
            success: res => {
                if (res.statusCode != 200) {
                    // this.clearAndReenter(this.moodTypeGratitude(selectMonth));
                    swan.showToast({
                        title: '你还没有登录哦',
                        icon: 'none',
                    })

                    return;
                }
                let tempDG = this.data.weekGratitude;
                let lastIdx = 0;
                let tempEDays = this.data.eachDayGratiture;
                let tD = this.data.eDays;
                res.data.gratitudeList.forEach(graRecord => {
                    let tempDate = (new Date(graRecord.created_at)).getDate();
                    for (let i = 0; i < this.data.days.length - 1; i++) {
                        if (tempDate <= this.data.days[i] && tempDate >= this.data.days[i+1]) {
                            tempDG[Math.floor(i /2)].push ({
                                day: tempDate,
                                description: '      '+ graRecord.description,
                            })

                            break;
                        }
                    }
                    if (tempDate < this.data.days[lastIdx*2+1]) {
                        lastIdx = lastIdx + 1;
                    }
                    let lED = tD.pop();
                    if (lED != undefined && lED.day !=0 ) {
                        if (lED.day == tempDate) {
                            lED.description.push(graRecord.description);
                            tD.push(lED);
                        }
                        else {
                            tD.push(lED);
                            let newDays = {day: tempDate, description: [graRecord.description]};
                            tD.push(newDays);
                        }
                    }
                    else {
                        lED = {day: tempDate, description: [graRecord.description]};
                        tD.push(lED);
                    }
                });
                this.setData({
                    weekGratitude: tempDG,
                    eachDayGratiture: tempEDays,
                    eDays: tD,
                }, ()=> {
                });
    

            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }
        });
    },
    setScrollLeft: function() {
        this.setData({
            scrollLeft: this.data.scrollWholeCard *( this.data.leftCardNum - 1) + this.data.scrollOneCard,
        }, ()=>{
            if (newMonth === false) {
                scrollOne = false;
            }
            else {
                // newMonth = false;
            }
            // console.log('set', scrollOne);
        })
    },
    openThisOne(e) {
        if (!getApp().isAuthenticated()) {
            letUserLogin();
        }
        this.setData({
            openIdx: e.currentTarget.dataset.cardIdx,
            openCard: 1,
        });
    },
    closeThisOne(e) {
        this.setData({
            openCard: 0,
        })
    },
    touchStart(e) {
        startX = e.changedTouches[0].pageX;

    },
    
    touchEnd(e) {

        let endX = e.changedTouches[0].pageX;
        this.changeOneCard(startX - endX)
    },
    touchMove(e) {
        // console.log('move')
    },

    changeOneCard: function(changeX) {
        if (!getApp().isAuthenticated()) {
            letUserLogin(true);
            return;
        }
        // console.log('change', changeX)
        scrollOne = true;

        if (changeX < 0) { //显示左边
            // console.log('left', changeX);
            if (this.data.leftCardNum === 0) {
                let tempThis = thisMonth;
                thisMonth = thisMonth == 12 ? 1 : thisMonth + 1;
                thisYear = tempThis == 12 ? thisYear + 1 : thisYear;
                let numberDays = this.getThisMonthDays(thisYear, thisMonth);

                this.loadOneMonth(thisYear, thisMonth, 1, numberDays, false)
            }
            this.setData({
                leftCardNum: this.data.leftCardNum - 1,
            }, ()=>{
                this.setScrollLeft();
            })

        }
        else if (changeX > 0) { //  显示右边
            // console.log('right', changeX);
            // if (this.data.leftCardNum === this.data.allMonths.length) {
            //     let tempThis = thisMonth;
            //     thisMonth = thisMonth == 1 ? 12 : thisMonth - 1;
            //     thisYear = tempThis == 1 ? thisYear - 1 : thisYear;
            //     let numberDays = this.getThisMonthDays(thisYear, thisMonth);

            //     // console.log('prevM', thisMonth, thisYear)
            //     this.loadOneMonth(thisYear, thisMonth, numberDays, numberDays, true)
            // }
            // this.setData({
            //     leftCardNum: this.data.leftCardNum + 1,
            // }, ()=>{
            //     this.setScrollLeft();
            // })
        }

    },
    scrollChange(e) {

        let tempChX = e.detail.deltaX;
        // console.log(scrollOne, newMonth, tempChX);
        if (scrollOne===false && newMonth===true && Math.abs(tempChX) < this.data.windowWidth) {
            newMonth = false;
        }
        if (scrollOne===false && newMonth===false) {
            scrollOne = true;
            // console.log('in', e.detail.deltaX);
            // this.changeOneCard( tempChX );

        }
    },
    
    // changeCard(e) {
    //     console.log(e.detail);
    // },
});