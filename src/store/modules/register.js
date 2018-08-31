const TIME_COUNT = 60;
const register = {
  state: {
    show: true,
    count: '',
    timer: null,
  },
  mutations: {
    changeLoading(state) {
      state.loading = false;
    },
    changeFinish(state) {
      state.finished = true;
    },
    addList(state) {
      for (let i = 0; i < 10; i += 1) {
        state.list.push(state.list.length + 1);
      }
    },
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
