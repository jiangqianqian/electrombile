// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BaiduMap from 'vue-baidu-map';
import sha1 from 'sha1';
import axiosOriginal from 'axios';
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
  imei: '1',
  brandName: '小牛',
  isOnline: true,
  address: '广东省深圳市大冲商务中心',
  brandLogo: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537350871464&di=83aebb60e6be5913cc7971da41a33721&imgtype=0&src=http%3A%2F%2Fg-search1.alicdn.com%2Fimg%2Fbao%2Fuploaded%2Fi4%2F1d%2Fe3%2FTB1lpKUNpXXXXczaXXXSutbFXXX.jpg'
}, {
  lat: 22.545,
  lng: 114.025,
  imei: '2',
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
  customerId: 9,
  gender: 0,
  id: 7,
  nickname: '芊～:)',
  openId: '8432098437892',
  phone: null,
  statuss: 1
};

const Global = {
  userInfo: userInfo2, // 用户信息
  // activeVehicleIndex: 0, // 首页中被选中的电动车索引号
  vehicleList: vehicleList2, // 电动车列表
  hasGetVehicleList: false, // 当绑定了设备或获取到电动车列表后置为 true
  accessKeyId: '82A8C3B67DE5', // 传给后端的
  // accessKeySecret: 'NGNlNjNjYzkyOGRlNDZhODk5YjA4OTM0ZjU0MjViZmU='
  accessKeySecret: 'NGNlNjNjYzkyOGRlNDZhODk5YjA4OTM0',
  appsecret: 'bbfbdc8e70a3ee1e6ec35d017f22b455',
  appid: 'wx0ddfdcab9f6d8b1c'
};

Vue.prototype.Global = Global;

// 返回
Vue.prototype.back = () => {
  // route.animate = 2;
  history.go(-1);
};

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

function getAddress(lng, lat) {
  // 创建地址解析器实例
  const myGeo = new BMap.Geocoder();
  // 将地址解析结果显示在地图上，并调整地图视野

  const point = new BMap.Point(lng, lat);

  let addressGroup;
  myGeo.getLocation(point, rs => {
    const address = rs.addressComponents;
    addressGroup =
      address.province +
      address.city +
      address.district +
      address.street +
      address.streetNumber;
  });
  return addressGroup;
}

function bindVehicle(to) {
  if (!Global.hasGetVehicleList) {
    // 没有获取电动车列表，表示未确定该用户是否有绑定电动车
    const params = {
      openId: Global.userInfo.openId
    };

    axios.get(
      '/equipment/findBindImeiList.htm',
      params,
      this
    ).then((res) => {
      if (res) {
        Global.hasGetVehicleList = true;

        // 要求没有电动车列表时，返回 []
        Global.vehicleList = res.map((item) => {
          const newItem = wgs84tobd09(item.lon, item.lat);
          item.lng = newItem[0];
          item.lat = newItem[1];
          item.address = getAddress(item.lng, item.lat);
          item.receiveTime = commonJs.dateFormat(new Date(item.receiveTime), 'yyyy-MM-dd hh:mm');

          // TODO: 头像名字先写死
          item.brandLogo = 'https://img0.bdstatic.com/static/searchdetail/img/logo-2X_b99594a.png';
          item.brandName = '电动车';
          return item;
        });

        console.log(Global.vehicleList, '123123');
        if (Global.vehicleList.length) {
          if (to.fullPath === '/') {
            // 如果绑定了电动车且访问的是根目录，直接跳转上首页
            return '/home';
          }
          return false;
        }
        // 没有绑定电动车的情况
        return '/swiper';
      }
    });
  } else {
    if (to.path === '/swiper') {
      return false;
    }

    if (Global.vehicleList.length) {
      if (to.fullPath === '/') {
        // 如果绑定了电动车且访问的是根目录，直接跳转上首页
        return '/home';
      }
      return false;
    }

    // 没有绑定电动车的情况
    return '/swiper';
  }
  return false;
}

function getCode(search) {
  if (!search) {
    return false;
  }

  const array = search.split('&');
  for (const val of array) {
    if (val.includes('code')) {
      // 例: code=123
      return val.substring(5);
    }
    return false;
  }

  return false;
}

function toAuth() {
  // 进入授权页面
  // 这个 redirectUrl用当前页路径或者 tof.fullPath(将要进入的路径)
  let redirectUrl = window.location.href;
  // let redirectUrl = 'http://vehicle.leta.cn/leta/index.html:8282';
  redirectUrl = encodeURIComponent(redirectUrl);
  console.log(redirectUrl);
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Global.appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
}

router.beforeEach(async (to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 请求接口判断是否绑定了设备 不要的
  // if (to.fullPath === '/') {
  //   const isRegister = false;
  //   if (!isRegister) {
  //     if (to.path !== '/register') {
  //       return next({
  //         path: '/register'
  //       });
  //     }
  //   } else if (to.path === '/register') {
  //     return next({
  //       path: '/'
  //     });
  //   }
  // }
  // return next();

  // 判断是否有用户信息
  if (Global.userInfo) {
    // 已经授权
    const res = bindVehicle(to);
    if (res) {
      // 有值表示返回了特定路径
      return next(res);
    }
    return next();
  }

  // 未授权
  const code = getCode(window.location.search); // 截取url上的code ,可能没有,则返回 false;
  // const code = '071xshzx0ZDYFh134Wzx0qrjzx0xshz2'; // test
  if (code) {
    // 表示这个页面是用户点了授权后跳转到的页面,获取用户信息,后端可首先通过cookie,session等判断,没有信息则通过code获取
    const data = await axios.get(
      // 授权的接口
      // '/wechat/findUserInfo', {
      //   code,
      //   appid: Global.accessKeyId
      // },

      // 获取用户信息
      '/kxzdLogin', {
        // code,
        // appid: Global.appid,
        // secret: Global.accessKeySecret
      },
      this
    );

    if (data) {
      Global.userInfo = data;

      // 判断是否注册了
      if (!data.customerId || !data.customerId.toString().length) {
        return next('/register');
      }

      // 去绑定电动车
      const res = bindVehicle(to);
      if (res) {
        // 有值表示返回了特定路径
        return next(res);
      }
      return next();
    }

    // 去授权 要加上
    // toAuth();
  } else {
    // 对于已关注公众号的用户，如果用户从公众号的会话或者自定义菜单进入本公众号的网页授权页，即使是scope为snsapi_userinfo，也是静默授权，用户无感知
    toAuth();

    // test
    // const timestamp = new Date().getTime();
    // const tokenParams = {
    //   accessKeyId: Global.accessKeyId,
    //   timestamp,
    //   sign: sha1(`accessKeyId=${Global.accessKeyId}&accessKeySecret=${Global.accessKeySecret}&timestamp=${timestamp}`)
    // };
    // const data = await axios.get(
    //   // 授权的接口
    //   // '/wechat/accessToken',
    //   '/wechat/accessToken.htm',
    //   tokenParams,
    //   this
    // );
    // if (data) {
    //   Global.userInfo = {
    //     openId: '3334444'
    //   };
    //   axiosOriginal.defaults.headers.common.token = data.token;
    //   return next('/register');
    // }
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
