var moods = require('../../utils/constants.js');
const wxml2canvas = require('../../utils/wxml2canvas.js');
import {MoodName, MoodType} from '../../utils/constants.js';

import 'weapp-cookie';
import cookies from 'weapp-cookie';

export const API = "https://xiaou.tech/api";

Page({
    data: {
        constMonth: '',
        constDay: '',
        thisYear: '',
        thisMonth: '',
        thisDay: '',
        selectDay: '',
        thisMonthDays: [], // attention for difference in index and date
        emptyGridsBefore: [],
        emptyGridsAfter: [],
        weekText: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

        // GET data
        // moodTypeList: {}, // item {day: , type: } in array
        gratitudeRecord: [], // item {day: , description: } in array
        thisDescription: '', // string of description for thisDay

        returnMoodRecord: [],

        // used for poster share
        whetherShare: 0,
        generateFinish: 0,
        totHeight: 0,
        topHeight: 0,
        bottomHeight: 0,
        // safeArea: 0,
        cardInfo: {
            avater: "https://cdn.xiaou.tech/share1.svg",
            //需要https图片路径
            qrCode: "https://cdn.xiaou.tech/logo16_9.png",
            //需要https图片路径
            TagText: "Ucho",
            //标签
            Name: 'Ucho',
            //姓名
            Position: "程序员鼓励师",
            //职位
            Mobile: "13888888888",
            //手机
            Company: "才华无限有限公司" //公司

        }


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
                    mood: 0,
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

    onShow: function () {
        swan.setPageInfo({

            title: '我的心情日历',
            keywords: '心情，日历，心情记录，表情，分享，分享心情',
            description: '我的心情日历',
            articleTitle: '我的心情日历',
            releaseDate: '2020',
            image: [
            ],
            video: [{
            }],
            visit: {
                pv: '1000',
                uv: '100',
                sessionDuration: '130'
            },
            success: res => {
                // console.log('setPageInfo success', res);
            },
            fail: err => {
                // console.log('setPageInfo fail', err);
            }
        })

        // 监听页面加载的生命周期函数

        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
        //获取年份  
        let Y =date.getFullYear();
        //获取月份  
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        let D = date.getDate();

        // call function to create grids
        let mday = this.methods.gridThisMonth(Y, M);
        let emptys = this.methods.emptyGrid(Y, M);

        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
            thisDay: D,
            constMonth: M,
            constDay: D,
            thisMonth: M,
            thisYear: Y,
            selectDay: D,
        }, () => {
            this.moodTypeGratitude({
                year: Y,
                month: M
            });
            this.dayMoodDescrip({
                year: Y,
                month: M,
                day: D,
            });
        });
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数

    },
    onLoad: function() {
        // 监听页面显示的生命周期函数
        this.getSystemInfo()
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

    // navigation bar used
    returnNav(e) {
        swan.navigateBack();
    },


    toSelectDay(e) {
        // used when select a new day in this month
        // jump to the day if
        // console.log('Clicked', e.currentTarget.dataset.day);

        if (e.currentTarget.dataset.day > this.data.constDay & this.data.thisMonth == this.data.constMonth) {
            // cant jump to futrue
            swan.showToast({
                title: '无法为未来添加心情',
                icon: 'none',
                duration: 1800
            })
            return;
        }

        this.setData({selectDay: e.currentTarget.dataset.day});


        if (this.data.thisMonthDays[e.currentTarget.dataset.day - 1].mood == 0) {
            swan.navigateTo({
                url: '/pages/record/record'
            })
            return;
        }

        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: e.currentTarget.dataset.day
        });


    },
    // when change month
    changePrevMonth(e) {
        this.setData({
            selectDay: this.data.thisDay,
            thisMonth: this.data.thisMonth == 1 ? 12 : this.data.thisMonth - 1,
            thisYear: this.data.thisMonth == 1 ? this.data.thisYear - 1 : this.data.thisYear
        })
        // call function to create grids
        let mday = this.methods.gridThisMonth(this.data.thisYear, this.data.thisMonth);
        let emptys = this.methods.emptyGrid(this.data.thisYear, this.data.thisMonth);
        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
        }, () => {
            this.moodTypeGratitude({
                year: this.data.thisYear,
                month: this.data.thisMonth
            });
            this.dayMoodDescrip({
                year: this.data.thisYear,
                month: this.data.thisMonth,
                day: this.data.thisDay,
            });
        });
    },
    changeNextMonth(e) {
        if(this.data.thisMonth == this.data.constMonth) return;
        this.setData({
            selectDay: this.data.thisDay,
            thisMonth: this.data.thisMonth == 12 ? 1 : this.data.thisMonth + 1,
            thisYear: this.data.thisMonth == 12 ? this.data.thisYear + 1 : this.data.thisYear
        })
        // call function to create grids
        let mday = this.methods.gridThisMonth(this.data.thisYear, this.data.thisMonth);
        let emptys = this.methods.emptyGrid(this.data.thisYear, this.data.thisMonth);
        // set the default selectDay as today
        this.setData({
            thisMonthDays: mday,
            emptyGridsBefore: emptys.before,
            emptyGridsAfter: emptys.after,
        });
        this.moodTypeGratitude({
            year: this.data.thisYear,
            month: this.data.thisMonth
        });
        this.dayMoodDescrip({
            year: this.data.thisYear,
            month: this.data.thisMonth,
            day: this.data.thisDay,
        });
    },

    /* util functions for getting data */
    moodTypeGratitude: function (selectMonth) {
        // send data: selectMonth(year & month)
        // return the moodType & gratitudeRecord
        // used when first enter / change month
        swan.request({
            url: `${API}/mood/month/`,
            method: 'GET',
            data: selectMonth,
            success: res => {
                let returnMood = []; //used to return
                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'moodTypeGratitude Fail 1'
                    });
                    return;
                }
                let tempMonthList = this.data.thisMonthDays;
                let tempGradList = [];
                let gratitudeRecord = res.data.gratitudeList;

                res.data.moodList.forEach(mood => {
                    let tempDate = (new Date(mood.created_at)).getDate();
                    tempMonthList[tempDate - 1].mood = MoodName[mood.type];
                });
                res.data.gratitudeList.forEach(graRecord => {
                    let tempDate = (new Date(graRecord.created_at)).getDate();
                    tempGradList.push({
                        day: tempDate,
                        description: graRecord.description,
                    })
                });

                this.setData({
                    thisMonthDays: tempMonthList,
                    gratitudeRecord: tempGradList,
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

    dayMoodDescrip: function (selectDay) {
        // send data: selectDay(year&month&day)
        // return this day's mood description
        // used when first enter / change day
        swan.request({
            url: `${API}/mood/day/`,
            method: 'GET',
            data: selectDay,
            success: res => {

                if (res.statusCode != 200) {
                    swan.showModal({
                        title: '请求失败',
                        content: 'dayMoodDescrip Fail'
                    });
                    return;
                }
                if(res.data.description == '') res.data.description = "快来点击相应日期添加心情吧";
                this.setData({
                    thisDescription: res.data.description
                })


            },
            fail: err => {
                swan.showModal({
                    title: '网络异常',
                    content: '请检查网络连接'
                });
            }

        })
    },
    updateMood(a, b) {
        this.setData({
            "thisMonthDays[selectDay-1].mood": a,
            thisDescription: b
        })
    },
        // function for poster share
    shareThis(e) {
        this.setData({
            whetherShare: 1,
        }, () => this.getAvaterInfo())

    },
    hidePoster(e) {
        this.setData({
            whetherShare: 0,
            generateFinish: 0,
        })
    },

    /**
     * 先下载图片
     */
    getAvaterInfo: function () {
        swan.showLoading({
        title: '生成中...',
        mask: true
        });
        var that = this;
        swan.downloadFile({
        url: that.data.cardInfo.avater,
        //头像图片路径
        success: function (res) {
            swan.hideLoading();

            if (res.statusCode === 200) {
            var avaterSrc = res.tempFilePath; //下载成功返回结果

            that.getQrCode(avaterSrc); //继续下载二维码图片
            } else {
            swan.showToast({
                title: '头像下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                var avaterSrc = "";
                that.getQrCode(avaterSrc);
                }
            });
            }
        }
        });
    },

    /**
     * 下载二维码图片
     */
    getQrCode: function (avaterSrc) {
        swan.showLoading({
        title: '生成中...',
        mask: true
        });
        var that = this;
        swan.downloadFile({
        url: that.data.cardInfo.qrCode,
        //二维码路径
        success: function (res) {
            swan.hideLoading();

            if (res.statusCode === 200) {
            var codeSrc = res.tempFilePath;
            that.sharePosteCanvas(avaterSrc, codeSrc);
            } else {
            swan.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                var codeSrc = "";
                that.sharePosteCanvas(avaterSrc, codeSrc);
                }
            });
            }
        }
        });
    },

    /**
     * 开始用canvas绘制分享海报
     * @param avaterSrc 下载的头像图片路径
     * @param codeSrc   下载的二维码图片路径
     */
    sharePosteCanvas: function (avaterSrc, codeSrc) {
        swan.showLoading({
        title: '生成中...',
        mask: true
        });
        var that = this;
        var cardInfo = that.data.cardInfo; //需要绘制的数据集合

        const ctx = swan.createCanvasContext('myCanvas'); //创建画布

        var width = "";
        swan.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
            console.log("height:", rect.height);
            var height = rect.height;
            var right = rect.right;
            let topProp = 0.5;
            width = rect.width * 0.8;
            var left = rect.left + 5;
            let topPart = rect.height * topProp;
            let bottomPart = rect.height * (1 - topProp);
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, rect.width, height); 

            if (avaterSrc) {
                ctx.drawImage(avaterSrc, 0, 0, rect.width, rect.height);
                ctx.setFontSize(14);
                ctx.setFillStyle('#fff');
                ctx.setTextAlign('left');
        } //标签


        // if (cardInfo.TagText) {
        //   ctx.fillText(cardInfo.TagText, left + 20, width - 4);
        //   const metrics = ctx.measureText(cardInfo.TagText); //测量文本信息

        //   ctx.stroke();
        //   ctx.rect(left + 10, width - 20, metrics.width + 20, 25);
        //   ctx.setFillStyle('rgba(255,255,255,0.4)');
        //   ctx.fill();
        // } //姓名


        // if (cardInfo.Name) {
        //   ctx.setFontSize(14);
        //   ctx.setFillStyle('#000');
        //   ctx.setTextAlign('left');
        //   ctx.fillText(cardInfo.Name, left, width + 60);
        // } //职位


        // if (cardInfo.Position) {
        //   ctx.setFontSize(12);
        //   ctx.setFillStyle('#666');
        //   ctx.setTextAlign('left');
        //   ctx.fillText(cardInfo.Position, left, width + 85);
        // } //电话


        // if (cardInfo.Mobile) {
        //   ctx.setFontSize(12);
        //   ctx.setFillStyle('#666');
        //   ctx.setTextAlign('left');
        //   ctx.fillText(cardInfo.Mobile, left, width + 105);
        // } // 公司名称


        // if (cardInfo.Company) {
        //   const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度

        //   let [contentLeng, contentArray, contentRows] = that.textByteLength(cardInfo.Company, CONTENT_ROW_LENGTH);
        //   ctx.setTextAlign('left');
        //   ctx.setFillStyle('#000');
        //   ctx.setFontSize(10);
        //   let contentHh = 22 * 1;

        //   for (let m = 0; m < contentArray.length; m++) {
        //     ctx.fillText(contentArray[m], left, width + 150 + contentHh * m);
        //   }
        // } //  绘制二维码


        // if (codeSrc) {
        //   ctx.drawImage(codeSrc, left + 160, width + 40, width / 3, width / 3);
        //   ctx.setFontSize(10);
        //   ctx.setFillStyle('#000');
        //   ctx.fillText("微信扫码或长按识别", left + 160, width + 150);
        // }
        }).exec();
        setTimeout(function () {
            ctx.draw();
            swan.hideLoading();
            that.setData({
                generateFinish: 1,
            })
        }, 1000);
    },  

    /**
     * 多行文字处理，每行显示数量
     * @param text 为传入的文本
     * @param num  为单行显示的字节长度
     */
    textByteLength(text, num) {
        let strLength = 0; // text byte length

        let rows = 1;
        let str = 0;
        let arr = [];

        for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
            strLength += 2;

            if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
            }
        } else {
            strLength++;

            if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
            }
        }
        }

        arr.push(text.slice(str, text.length));
        return [strLength, arr, rows]; //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveImg(e) {
        var that = this;
        swan.showLoading({
            title: '正在保存',
            mask: true
        });
        setTimeout(function () {
            swan.canvasToTempFilePath({
                canvasId: 'myCanvas',
                    success: function (res) {
                    swan.hideLoading();
                    var tempFilePath = res.tempFilePath;
                    swan.saveImageToPhotosAlbum({

                        filePath: tempFilePath,

                        success(res) {
                        // utils.aiCardActionRecord(19);
                            swan.showModal({
                                title: '图片已保存到相册',
                                content: '快去分享给朋友吧～',
                                showCancel: true,
                                confirmText: '马上分享',
                                confirmColor: '#55C595',
                                cancelText: '下次再说',
                                cancelColor: '#c2c2c2',
                                success: function (res) {
                                    if (res.confirm) {
                                        swan.shareFile({
                                            filePath: tempFilePath,
                                            success: res => {
                                                swan.showToast({
                                                    title: '分享成功',
                                                    icon: 'none',
                                                    
                                                }, () => {
                                                    that.setData({
                                                        whetherShare: 0,
                                                        generateFinish: 0,
                                                    })
                                                })
                                            },
                                            fail: err => {
                                                swan.showToast({
                                                    title: '分享失败',
                                                    icon: 'none',
                                                    
                                                }, () => {

                                                    console.log("share fail");
                                                    that.setData({
                                                        whetherShare: 0,
                                                        generateFinish: 0,
                                                    })
                                                })
                                                that.setData({
                                                    whetherShare: 0,
                                                    generateFinish: 0,
                                                })
                                            }
                                        })
                                    }
                                    else if (res.cancel) {
                                        that.setData({
                                            whetherShare: 0,
                                            generateFinish: 0
                                        })
                                    }
                                },
                                fail: function (res) {}
                            });
                        },

                        fail: function (res) {
                            swan.showToast({
                                title: res.errMsg,
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    });
                }
            });
        }, 1000);
    },
    getSystemInfo() {
        swan.getSystemInfo({
            success: res => {
            let posterProp = 0.75;
            let topProp = 0.5;
            let windowRpx = res.windowHeight * (750 / res.windowWidth); // convert px to rpx 
            let temp1 = windowRpx * posterProp + 'rpx';
            let tempTop = windowRpx * posterProp * topProp;
            let tempBottom = windowRpx * posterProp * (1-topProp);

            // let temp3 = res.safeArea + 'px';
            this.setData({
                totHeight: temp1,
                topHeight: tempTop,
                bottomHeight: tempBottom,
                // safeArea: temp3,
            });
            // console.log(temp1);
            // console.log(tempTop)

                
            },
            fail: err => {
                swan.showToast({
                    title: '获取失败',
                    icon: 'none'
                });
            }
        })
    },
//     drawCanvas: function () {
//         console.log("drawCanvas");
//         const wrapperId = '#wrapper';
//         const drawClassName = '.draw';
//         const canvasId = 'canvas-map';
//         wxml2canvas(wrapperId, drawClassName, canvasId).then(() => {// canvas has been drawn
//         // can save the image with wx.canvasToTempFilePath and wx.saveImageToPhotosAlbum 
//     });
//   }
});