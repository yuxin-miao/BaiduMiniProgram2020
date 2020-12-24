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

export function letUserLogin(){
    swan.showModal({
        title: '是否登录',
        content: '登录后即可使用全部功能',
        showCancel: true,
        confirmText: '是',
        confirmColor: '#55C595',
        cancelText: '否',
        cancelColor: '#c2c2c2',
        success: function (res) {
            if (res.confirm) {
                getApp().login();
            }
            else if (res.cancel) {

            }
        },
        fail: function (res) {}
    })
    
}

