
const home = {
  state: {
    play: false,
    path: [],
    text: '开始',
    icon: {
      url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
      size: {
        width: 52,
        height: 26,
      },
      opts: {
        anchor: {
          width: 27,
          height: 13,
        },
      },
    },
  },
  mutations: {
    reset(state) {
      state.play = false;
      state.text = '开始';
    },
    handleSearchComplete(state, res) {
      state.path = res
        .getPlan(0)
        .getRoute(0)
        .getPath();
    },
    changeText(state) {
      state.play = !state.play;
      state.text = state.play ? '暂停' : '开始';
    },
  },
};

export default home;
