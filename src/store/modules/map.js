import path from '@/../static/path.js';
import lushuIcon from '@/assets/images/lushu-icon.png';

const home = {
  state: {
    play: false,
    path,
    text: '开始',
    icon: {
      url: lushuIcon,
      size: {
        width: 30,
        height: 38,
      },
      opts: {
        anchor: {
          width: 15,
          height: 38,
        },
      },
    },
  },
  mutations: {
    resetPlay(state) {
      state.play = false;
      state.text = '开始';
    },
    handleSearchComplete(state, res) {
      // state.path = res
      //   .getPlan(0)
      //   .getRoute(0)
      //   .getPath();
      // console.log(state.path);
    },
    changeText(state) {
      state.play = !state.play;
      state.text = state.play ? '暂停' : '开始';
    },
  },
};

export default home;
