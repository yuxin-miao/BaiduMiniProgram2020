
Page({
    data: {
        anmi: 1,
        hiddenarrow: 'true',
        hidden1: 'false',
        hidden2: 'true',
        play2: 'false',
        hiddenarrow2: 'true',
        autoplay2: 'false',
        autoplay3: 'false',
        play3: 'false',
        hidden3: 'true'
    },
    playArrow(e) {
        console.log("playArrow");
        this.setData({
            hiddenarrow: 'false',
            anmi: 2,
        })
    },
    goNext1(e) {
        console.log("goNext1");
        this.setData({
            hidden1: 'true',
            hidden2: 'false',
            hiddenarrow: 'true',
            play2: 'play',
            autoplay2: 'true',
            anmi: 2
        })
    },    
    playArrow2(e) {
        console.log("play2");
        this.setData({
            hiddenarrow2: 'false',
            anmi: 3
        })
    },
    goNext2(e) {
        console.log("go2")
        this.setData({
            hidden2: 'true',
            hiddenarrow2: 'true',
            play3: 'play',
            autoplay3: 'true',
            hidden3: 'false',
            anmi: 3
        })
    },
    playArrow3(e) {
        console.log("play3")

        swan.redirectTo({
            url: '/pages/main/main'
        })
    },
});