// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BaiduMap from 'vue-baidu-map';
import App from './App';
import router from './router';
import axios from './utils/axios';
import commonJs from './utils/common';
import './utils/rem';
import wgs84tobd09 from './utils/coordtransform';
import './assets/font/iconfont.css';
import './assets/css/resetui.css';

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'VFEAKmKYgUpGON4YsDjdW8c3t7RwnQqK'
});


// test

const vehicleList2 = [{
  lat: 22.546,
  lng: 114.025,
  imei: '868500023772197',
  brandName: '小牛',
  isOnline: true,
  address: '广东省深圳市大冲商务中心',
  brandLogo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537350871464&di=83aebb60e6be5913cc7971da41a33721&imgtype=0&src=http%3A%2F%2Fg-search1.alicdn.com%2Fimg%2Fbao%2Fuploaded%2Fi4%2F1d%2Fe3%2FTB1lpKUNpXXXXczaXXXSutbFXXX.jpg'
}, {
  lat: 22.545,
  lng: 114.025,
  imei: '868500023772197',
  brandName: '新日',
  isOnline: false,
  receiveTime: '2018-09-27T12:47:02.7299303',
  address: '广东省深圳市大冲商务中心2',
  brandLogo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537350894987&di=38f7997d8c7c4a48d1a099c2534d57c6&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F69%2F69%2F81s58PICd8f.jpg'
}];

// test
// const userInfo2 = {
//   agencyCode: '1000',
//   agencyId: 3,
//   agencyName: '酷行智动',
//   appId: 'wx0ddfdcab9f6d8b1c',
//   appName: null,
//   avatar: 'http://thirdwx.qlogo.cn/mmopen/vi_32/PFK7lPu7VbhbuiaHXSs1iaBAPtsUdhdUO4PJlziatiaECkicsX4k9kcuWasqsRacohCAxXSjNRJ5MKlJooe4ibgiamLBA/132',
//   createBy: 1,
//   createName: '系统管理员',
//   createTime: '2018-10-11 15:33:03',
//   customerId: 9,
//   gender: 2,
//   id: 7,
//   nickname: '芊～:)',
//   openId: 'ofMDZ0rD9LISYEuH8jB1AY3AdoEs',
//   phone: null,
//   statuss: 1
// };

const userInfo2 = {
  agencyCode: 'AJFKLJDL',
  agencyId: 12211,
  agencyName: '测试编码',
  appId: 'ALJJEJFKLDJFLSJSF',
  appName: '公众号名称',
  avatar: 'string',
  createBy: 1,
  createName: '系统管理员',
  createTime: '2018-10-11 15:33:03',
  customerId: 11,
  gender: 0,
  id: 7,
  nickname: '芊～:)',
  // openId: '8432098437892',
  openId: '3334444',
  phone: null,
  statuss: 1
};

const Global = {
  // userInfo: userInfo2, // 用户信息
  userInfo: {}, // 用户信息
  // activeVehicleIndex: 0, // 首页中被选中的电动车索引号
  // vehicleList: vehicleList2, // 电动车列表
  vehicleList: [], // 电动车列表
  // hasGetVehicleList: false, // 当绑定了设备或获取到电动车列表后置为 true
  // hasGetVehicleList: true, // 当绑定了设备或获取到电动车列表后置为 true
  accessKeyId: '82A8C3B67DE5', // 传给后端的
  // accessKeySecret: 'NGNlNjNjYzkyOGRlNDZhODk5YjA4OTM0ZjU0MjViZmU='
  accessKeySecret: 'NGNlNjNjYzkyOGRlNDZhODk5YjA4OTM0',
  appsecret: 'bbfbdc8e70a3ee1e6ec35d017f22b455',
  appid: 'wx0ddfdcab9f6d8b1c',
  targetUrl: null
};

Vue.prototype.Global = Global;

// 返回
Vue.prototype.back = () => {
  // route.animate = 2;
  history.go(-1);
};

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

function bindVehicleAxios() {
  const params = {
    openId: Global.userInfo.openId
  };
  return axios.get(
    '/equipment/findBindImeiList.htm',
    params,
    this,
    true,
    false
  );
}

function getUserInfo(search) {
  const searchArray = decodeURIComponent(search).substring(1).split('&');
  const userInfo = {};
  searchArray.forEach((item) => {
    const itemArray = item.split('=');
    userInfo[itemArray[0]] = itemArray[1];
  });
  Global.userInfo = userInfo;
}


router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  console.log(Global.vehicleList, 'vehicleList');

  // 从其他系统跳入
  const posStr = 'targetUrl=';
  const locationSearch = location.search;
  if (locationSearch && (locationSearch.indexOf(posStr) !== -1)) {
    const targetUrlArray = locationSearch.substring(1).split('&');
    for (let i = 0, len = targetUrlArray.length; i < len; i = +1) {
      if (targetUrlArray[i].indexOf(posStr) !== -1) {
        Global.targetUrl = targetUrlArray[i].replace(posStr, '');
        break;
      }
    }
  }

  // 如果是从外面跳入，设备添加成功后返回原来路径
  if (Global.targetUrl && from.fullPath === '/success') {
    window.location.href = decodeURIComponent(Global.targetUrl);
  }

  // 后端判断是否跳到注册，绑定或首页
  if (!Object.keys(Global.userInfo).length) {
    if (to.fullPath === '/register' || to.fullPath === '/home' || to.fullPath === '/swiper') {
      // 拿到用户信息 (后端通过 url 参数带过来)
      getUserInfo(location.search);
    }
  }
  if (to.fullPath === '/home') {
    // 去获取电动车列表,并处理电动车
    if (!Global.vehicleList.length) {
      bindVehicleAxios().then((res) => {
        if (res) {
          Global.vehicleList = res.map((item) => {
            const newItem = wgs84tobd09(item.lon, item.lat);
            item.lng = newItem[0];
            item.lat = newItem[1];

            item.receiveTime = commonJs.dateFormat(new Date(item.receiveTime), 'yyyy-MM-dd hh:mm');

            // TODO: 头像名字先写死
            item.brandLogo = 'https://img0.bdstatic.com/static/searchdetail/img/logo-2X_b99594a.png';
            item.brandName = '电动车';
            return item;
          });
          return next();
        }

        return next('/swiper');
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
