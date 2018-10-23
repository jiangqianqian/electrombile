import Vue from 'vue';
import Router from 'vue-router';

const viewImport = (file) => {
  return () => {
    return import(`@/views/${file}.vue`);
  };
};


const Home = Vue.extend(require('@/views/Home/home.vue').default);
const FootPrint = Vue.extend(require('@/views/Home/footPrint.vue').default);
const Fence = Vue.extend(require('@/views/Home/fence.vue').default);
const Message = Vue.extend(require('@/views/Home/message.vue').default);
const Mine = Vue.extend(require('@/views/Home/mine.vue').default);

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/register',
    name: 'register',
    component: viewImport('Register/index'),
    meta: {
      title: '注册手机号'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: viewImport('Home/index'),
    meta: {
      title: '酷行智动'
    },
    children: [{
      path: '',
      component: Home,
      meta: {
        title: '酷行智动',
        active: 0,
        keepAlive: true
      }
    },
    {
      path: 'footPrint',
      component: FootPrint,
      meta: {
        title: '酷行智动',
        active: 1,
        keepAlive: false
      }
    },
    {
      path: 'fence',
      component: Fence,
      meta: {
        title: '酷行智动',
        active: 2,
        keepAlive: true
      }
    },
    {
      path: 'message',
      component: Message,
      meta: {
        title: '酷行智动',
        active: 3,
        keepAlive: true
      }
    },
    {
      path: 'mine',
      component: Mine,
      meta: {
        title: '酷行智动',
        active: 4,
        keepAlive: true
      }
    }
    ]
  },
  {
    path: '/messageSet',
    name: 'messageSet',
    component: viewImport('MessageSet/index'),
    meta: {
      title: '酷行智动'
    }
  },
  {
    path: '/swiper',
    name: 'swiper',
    component: viewImport('Swiper/index'),
    meta: {
      title: '酷行智动'
    }
  },
  {
    path: '/einputCode',
    name: 'inputCode',
    component: viewImport('InputCode/index'),
    meta: {
      title: '输入编码绑定'
    }
  },
  {
    path: '/success',
    name: 'success',
    component: viewImport('Success/index'),
    meta: {
      title: '酷行智动'
    }
  }
  ]
});
