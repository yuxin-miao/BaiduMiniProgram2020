
Page({
    data: {
        anmi: 1,
        path1: '',
        path2: '',
        path3: '',
    },
    onShow() {
        swan.downloadFile({
            url: 'https://cdn.xiaou.tech/3.json',
            // header: {
            //     'content-type': 'application/json'
            // },
            success: res => {
                console.log("download success")
                const filePath = res.tempFilePath;
                this.setData({
                    path1: filePath
                });
                console.log(res.tempFilePath)
            },
            fail: err => {
                swan.showModal({
                    title: '请求失败',
                    content: '初始动画下载失败！'
                })
            }
        });
    },
    playArrow(e) {
        console.log("playArrow");
        let tempAnmi = this.data.anmi ==  1 ? 2 : this.data.anmi;
        this.setData({
            hiddenarrow: 'false',
            anmi: tempAnmi,
        })
    },
    playArrow2(e) {
        console.log("play2");
        let tempAnmi = this.data.anmi ==  2 ? 3 : this.data.anmi;
        this.setData({
            hiddenarrow2: 'false',
            anmi: 3
        })
    },
    playArrow3(e) {
        console.log("play3")

        swan.redirectTo({
            url: '/pages/intro/intro'
        })
    },
    nextAni(e) {
        if(this.data.anmi === 3) {
            swan.redirectTo({
                url: '/pages/intro/intro'
            })
        }
        else {
            let tempAnmi = this.data.anmi + 1;
            this.setData({
                anmi: tempAnmi
            })
        }
    },
    returnMain(e) {
        console.log('returnM');
        swan.redirectTo({
            url: '/pages/intro/intro'
        })
    }
});