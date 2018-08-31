const home = {
  state: {
    loading: false,
    finished: false,
    list: [],
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
    getList({
      commit,
      state,
    }) {
      setTimeout(() => {
        // for (let i = 0; i < 10; i++) {
        //   this.list.push(this.list.length + 1);
        // }
        // this.loading = false;

        // if (this.list.length >= 40) {
        //   this.finished = true;
        // }
        commit('addList');
        commit('changeLoading');
        if (state.list.length >= 40) {
          commit('changeFinish');
        }
      }, 500);
    },
  },
};

export default home;
