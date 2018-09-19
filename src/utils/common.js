const commonJs = {
  rem2px(rem) {
    const width = window.screen.width;
    return (rem * 100) / (750 / width);
  }
};

export default commonJs;
