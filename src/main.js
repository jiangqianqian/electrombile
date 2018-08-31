// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './utils/axios';
import store from './store';
import './utils/rem';
import './assets/font/iconfont.css';
import './assets/css/resetui.css';

// 返回
Vue.prototype.back = () => {
  // route.animate = 2;
  history.go(-1);
};

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 请求接口判断是否绑定了设备
  if (to.fullPath === '/') {
    const isRegister = false;
    if (!isRegister) {
      if (to.path !== '/register') {
        return next({
          path: '/register',
        });
      }
    } else if (to.path === '/register') {
      return next({
        path: '/',
      });
    }
  }
  return next();
});

Vue.config.productionTip = false;

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App,
  },
  template: '<App/>',
});
