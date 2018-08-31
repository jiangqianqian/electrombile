import Vue from 'vue';
import Router from 'vue-router';

const viewImport = file => () =>
  import(`@/views/${file}.vue`);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'register',
      component: viewImport('Register/index'),
      meta: {
        title: '注册手机号',
      },
    },
    {
      path: '/',
      name: 'home',
      component: viewImport('Home/index'),
      meta: {
        title: '酷行智动',
      },
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: viewImport('Swiper/index'),
      meta: {
        title: '酷行智动',
      },
    },
    {
      path: '/inputCode',
      name: 'inputCode',
      component: viewImport('InputCode/index'),
      meta: {
        title: '输入编码绑定',
      },
    },
    {
      path: '/success',
      name: 'success',
      component: viewImport('Success/index'),
      meta: {
        title: '酷行智动',
      },
    },
    {
      path: '/map',
      name: 'map',
      component: viewImport('Map/index'),
    },
  ],
});
