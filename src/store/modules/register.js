const TIME_COUNT = 60;
const register = {
  state: {
    show: true,
    count: '',
    timer: null,
  },
  mutations: {
  },
  actions: {
    setEndTime({
      state,
    }) {
      if (!state.timer) {
        state.count = TIME_COUNT;
        state.show = false;
        state.timer = setInterval(() => {
          if (state.count > 0 && state.count <= TIME_COUNT) {
            state.count -= 1;
          } else {
            state.show = true;
            clearInterval(state.timer);
            state.timer = null;
          }
        }, 1000);
      }
    },
  },
};

export default register;
