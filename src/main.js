// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BaiduMap from 'vue-baidu-map';
import App from './App';
import router from './router';
import axios from './utils/axios';
import './utils/rem';
import wgs84tobd09 from './utils/coordtransform';
import './assets/font/iconfont.css';
import './assets/css/resetui.css';

// 返回
Vue.prototype.back = () => {
  // route.animate = 2;
  history.go(-1);
};

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'VFEAKmKYgUpGON4YsDjdW8c3t7RwnQqK'
});

const Global = {
  openId: '', // 用户 openId
  activeVehicleIndex: 0, // 首页中被选中的电动车索引号
  vehicleList: [], // 电动车列表
  hasGetvehicleList: false // 当绑定了设备或获取到电动车列表后置为 true
};

Vue.prototype.Global = Global;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 请求接口判断是否绑定了设备
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
  if (!Global.hasGetvehicleList) {
    // 没有获取电动车列表，表示未确定该用户是否有绑定电动车
    const params = {
      openId: Global.openId
    };

    axios.get(
      '/vehicleList',
      params,
      this
    ).then((res) => {
      Global.hasGetvehicleList = true;
      Global.vehicleList = res.map((item) => {
        const newItem = wgs84tobd09(item.lng, item.lat);
        item.lng = newItem[0];
        item.lat = newItem[1];
        return item;
      });

      console.log(Global.vehicleList, '123123');
      if (Global.vehicleList.length) {
        if (to.fullPath === '/') {
          // 如果绑定了电动车且访问的是根目录，直接跳转上首页
          return next({
            path: '/home'
          });
        }
        return next();
      }
      // 没有绑定电动车的情况
      return next({
        path: '/register'
      });
    });
  } else {
    if (to.path === '/register') {
      return next();
    }

    if (Global.vehicleList.length) {
      if (to.fullPath === '/') {
        // 如果绑定了电动车且访问的是根目录，直接跳转上首页
        return next({
          path: '/home'
        });
      }
      return next();
    }

    // 没有绑定电动车的情况
    return next({
      path: '/register'
    });
  }
});

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});
