Page({
    data: {
        backTopUrl: '',
        backBottomUrl: '',
        cardUrl: '',
        whetherShare: 0,
        totWidth: 0,
        totHeight: 0,
        totLeft: 0,
        totTop: 0,
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        var that = this;
        swan.showLoading();
        swan.downloadFile({
            url: 'https://cdn.xiaou.tech/intropage-bottom.png',
            success: res => {
                if (res.statusCode === 200) {
                    this.setData({
                        backBottomUrl: res.tempFilePath,
                    })
                } 
                else {
                    swan.showToast({
                        title: '页面加载失败',
                        icon: 'none',
                        duration: 2000,
                    });
                }
            },
            fail: err => {
                swan.showModal ({
                    title: '页面加载失败',
                    content: '请检查网络连接'
                });
            }
        });
        swan.downloadFile({
            url: 'https://cdn.xiaou.tech/intropage-top.png',
            success: res => {
                swan.hideLoading();
                if (res.statusCode === 200) {
                    this.setData({
                        backTopUrl: res.tempFilePath,
                    })
                } 
                else {
                    swan.showToast({
                        title: '页面加载失败',
                        icon: 'none',
                        duration: 2000,
                    });
                }
            },
            fail: err => {
                swan.showModal ({
                    title: '页面加载失败',
                    content: '请检查网络连接'
                });
            }
        });

        
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        this.getSystemInfo();
        swan.downloadFile({
            url: 'https://cdn.xiaou.tech/intro-card.png',
            success: res => {
                swan.hideLoading();
                if (res.statusCode === 200) {
                    this.setData({
                        cardUrl: res.tempFilePath,
                    })
                    console.log("finish", res.tempFilePath)
                } 
                else {
                    swan.showToast({
                        title: '页面加载失败',
                        icon: 'none',
                        duration: 2000,
                    });
                }
            },
            fail: err => {
                swan.showModal ({
                    title: '页面加载失败',
                    content: '请检查网络连接'
                });
            }
        });
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
    returnNav(e) {
        swan.navigateBack();
    },
    openCard(e) {
        this.setData({
            whetherShare: 1
        }, ()=> {
            this.sharePosteCanvas(this.data.cardUrl);
        })
        
    },

    getSystemInfo() {
        swan.getSystemInfo({
            success: res => {

                let windowRpx = res.screenHeight * (750 / res.windowWidth); // convert px to rpx 
                // console.log(windowRpx);
                let tempW = 750 * 0.9;

                let tempH = tempW * 146 / 269;
                let tempL = (750 - tempW) / 2;
                let tempT = (windowRpx - tempH) / 2;
                tempH = tempH + 'rpx';
                tempW = tempW + 'rpx';
                tempL = tempL + 'rpx';
                tempT = tempT + 'rpx';
                console.log(tempH , tempW, tempL);

                this.setData({
                    totHeight: tempH,
                    totWidth: tempW,
                    totLeft: tempL,
                    totTop: tempT,
                });
                
            },
            fail: err => {
                swan.showToast({
                    title: '获取失败',
                    icon: 'none'
                });
            }
        })
    },



    /**
     * 开始用canvas绘制分享海报
     * @param cardSrc 下载的名片路径
     */
    sharePosteCanvas: function (cardSrc) {
        swan.showLoading({
            title: '生成中...',
            mask: true
        });
        var that = this;
        console.log(cardSrc);
        const ctx = swan.createCanvasContext('myCanvas'); //创建画布
        swan.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
            var height = rect.height;
            ctx.setFillStyle('#fff');
            ctx.fillRect(0, 0, rect.width, height); 

            ctx.drawImage(cardSrc, 0, 0, rect.width, rect.height);
            ctx.setFontSize(14);
            ctx.setFillStyle('#fff');
            ctx.setTextAlign('left');
        }).exec();
        setTimeout(function () {
            ctx.draw();
            swan.hideLoading();
        }, 1000);
    },  
    hidePoster(e) {
        this.setData({
            whetherShare: 0,
        })
    },
    //点击保存到相册
    showSave(e) {
        var that = this;
        swan.showModal({
            title: '确认保存至本地相册',
            content: '',
            showCancel: true,
            confirmText: '是',
            confirmColor: '#55C595',
            cancelText: '否',
            cancelColor: '#c2c2c2',

            success: function (res) {
                if (res.confirm) {
                    that.saveImg();
                }
                else if (res.cancel) {
                    that.setData({
                        whetherShare: 0,
                        generateFinish: 0
                    })
                }
            },
            fail: function (res) {}
        })
    },
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
                                title: '图片已保存',
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
});