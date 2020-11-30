
Page({
    data: {
        anmi: 1,
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
            url: '/pages/main/main'
        })
    },
    nextAni(e) {
        if(this.data.anmi === 3) {
            swan.redirectTo({
                url: '/pages/main/main'
            })
        }
        else {
            let tempAnmi = this.data.anmi + 1;
            this.setData({
                anmi: tempAnmi
            })
        }
    }
});