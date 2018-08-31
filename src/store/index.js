import Vue from 'vue';
import Vuex from 'vuex';
import home from './modules/home';
import swiper from './modules/swiper';
import map from './modules/map';
import getters from './getters';
import register from './modules/register';


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    home,
    swiper,
    map,
    register,
  },
  getters,
});

export default store;
