const getters = {
  loading: state => state.home,
  finished: state => state.home.finished,
  list: state => state.home.list,
  thumbs: state => state.swiper.thumbs,

  play: state => state.map.play,
  path: state => state.map.path,
  icon: state => state.map.icon,
  text: state => state.map.text,

  // register
  show: state => state.register.show,
  count: state => state.register.count,

  // swiper
  showIndicator: state => state.swiper.showIndicator,
};

export default getters;
