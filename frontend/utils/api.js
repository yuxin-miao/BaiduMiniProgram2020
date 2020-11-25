import 'weapp-cookie';
import cookies from 'weapp-cookie';

export const API = "https://xiaou.tech/api";

// async function asyncForEach(array, callback) {
//     for (let index = 0; index < array.length; index++) {
//       await callback(array[index], index, array)
//     }
//   }

export function createMoodRecord(moodData) {
// used to create a mood record in 'record'
    swan.request({
        url: `${API}/mood/`,
        method: 'POST',
        data: moodData,
        header: {
            // POST 携带
            'X-CSRFToken': cookies.get('csrftoken')
        },
        success: res => {
            swan.navigateBack();
        },
        fail: err => {
            swan.showModal({
                title: '网络异常',
                content: '请检查网络连接'
            });
        }
    });
}

function moodRecordID(id) {
    // used to return each mood record in returnMoodRecord
    swan.request({
        url: `${API}/mood/${id}/`,
        method: 'GET',
        success: res => {
            // console.log(res);
            if (res.statusCode != 200) {
                swan.showModal({
                    title: '请求失败',
                    content: 'MoodRecordID failed'
                });
                throw "WRONG ID!";                    
            }
            console.log(res.data.type);
            console.log(res.data.description);
            return {
                type: res.data.type,
                description: res.data.description
            };
        },
        fail: err => {
            swan.showModal({
                title: '网络异常',
                content: '请检查网络连接'
            });
        }
    });
}

export function returnMoodRecord(selectDay) {
    // used to return the mood record in 'calender'
    swan.request({
        url: `${API}/mood/`,
        method: 'GET',
        data: selectDay,
        success: res => {
            console.log(res);
            let returnMood = []; //used to return 
            if (res.statusCode != 200) {
                swan.showModal({
                    title: '请求失败',
                    content: 'MoodRecord Fail'
                });
                return;                    
            }
            // asyncForEach(res.data, async ele => {
            //     var temp = await moodRecordID(ele.id);
            //     returnMood.push(moodRecordID(ele.id));
            // })
            res.data.forEach(element => {
                let id = element.id;
                try {
                swan.request({
                    url: `${API}/mood/${id}/`,
                    method: 'GET',
                    success: res => {
                        // console.log(res);
                        if (res.statusCode != 200) {
                            swan.showModal({
                                title: '请求失败',
                                content: 'MoodRecordID failed'
                            });
                        }
                        // console.log(res.data.type);
                        // console.log(res.data.description);
                        returnMood.push({
                            type: res.data.type,
                            description: res.data.description
                        });
                    },
                    fail: err => {
                        swan.showModal({
                            title: '网络异常',
                            content: 'moodid请检查网络连接'
                        });
                    }
                });
                }
                catch (e) {
                    console.log(e);
                }
            });
            // for (let index = 0; index < res.data.length; index++) {
            //     let temp = moodRecordID(res.data[index].id);
            //     console.log(temp);
        
            // }
            console.log(returnMood);
            return returnMood;
            // this.setLocalStorage('returnMoodList', returnMood);
        },
        fail: err => {
            swan.showModal({
                title: '网络异常',
                content: '请检查网络连接'
            });
        }
    });
}
    
