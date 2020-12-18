var util = require('../../utils/util.js');


Page({
    data: {
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
        monthSmallName: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

        
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        // set card number according to date 
        let dictD = util.dictDate(new Date());
        let numberDays = this.getThisMonthDays(dictD.year, dictD.month);
        // let tempM = Array(Math.ceil(numberDays/7)).fill({month: this.data.monthName[dictD.month - 1], id: 0});
        let tempDG = [];
        let tempEachDays =[];
        let tempD = [];
        let tempM = [];
        let tempId = 0;
        
        let tempMName = this.data.monthName[dictD.month - 1];
        for (let i = 1; i <= numberDays - 6; i+=7){
            if (dictD.day <= i + 6) tempId = i;
            tempM.unshift({
                month: tempMName,
                id: i,
            })
            tempD.unshift(i + 6, i);
            console.log(tempD)
        }
        if (tempD[0] != numberDays) {
            if (tempD.length % 2) {
                tempD.unshift(numberDays);
            }
            else {
                let first = tempD[0] + 1;
                if (tempId == 0) tempId = first;
                tempM.unshift({
                    month: tempMName,
                    id: first,
                })
                tempD.unshift(numberDays, first);
                
            }
        }
        tempM.forEach(ele => {
            tempDG.push([]);
            tempEachDays.push([{}]);
        })
        this.setData({
            getSelectMonth: {year: dictD.year, month: dictD.month},
            today: dictD.day,
            days: tempD,
            allMonths: tempM,
            weekGratitude: tempDG,
            eachDayGratiture: tempEachDays,
            toView: tempId,
        }, ()=>{
            // console.log('1!',tempEachDays)
            this.moodTypeGratitude({year: dictD.year, month: dictD.month});
        })

    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数

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
    getThisMonthDays: function(year, month) {
        return new Date(year, month, 0).getDate();
    },
    setTodayIntoView: function(){
        
    },
    returnNav(e) {
        console.log(1);
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

    // imageError(e) {
    //     console.log('image 发生 error 事件，携带值为', e.detail.errMsg);
    //   },
    //   onTap(e) {
    //     console.log('image 发生 tap 事件', e);
    //   },
    //   imageLoad(e) {
    //       console.log('image 加载成功', e.type);
    //   },
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
                let returnMood = []; //used to return
                if (res.statusCode != 200) {
                    // this.clearAndReenter(this.moodTypeGratitude(selectMonth));
                    swan.showToast({
                        title: '你还没有登录哦',
                        icon: 'none',
                    })

                    return;
                }
                console.log(res)
                let tempDG = this.data.weekGratitude;
                let lastDay = this.data.today;
                let lastIdx = 0;
                let tempEDays = [[], [], []];
                let tD = this.data.eDays;
                // console.log('here', tempEDays);

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
                    // console.log('start', tempEDays);
                    let lED = tD.pop();
                    if (lED != undefined && lED.day !=0 ) {
                        if (lED.day == tempDate) {
                            // console.log("1", laDays);
                            lED.description.push(graRecord.description);
                            tD.push(lED);
                        }
                        else {
                            // console.log("2", laDays);

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
    openThisOne(e) {
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
});