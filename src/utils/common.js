const commonJs = {
  rem2px(val) {
    const width = window.screen.width;
    return (val * 100) / (750 / width);
  }
};

export default commonJs;
