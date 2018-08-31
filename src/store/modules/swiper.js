// import swipe1 from '@/assets/images/swipe1.png';
// import swipe2 from '@/assets/images/2.jpg';
// import swipe3 from '@/assets/images/swipe3.png';

const swiper = {
  state: {
    // thumbs: [
    //   swipe1,
    //   swipe2,
    //   swipe3,
    // ],
    showIndicator: true,
  },
  mutations: {
    setIndicator(state, $swiper) {
      const len = $swiper.$children.length;
      const active = $swiper.active;
      if (active === len - 1) {
        state.showIndicator = false;
      } else {
        state.showIndicator = true;
      }
    },
  },
};

export default swiper;
