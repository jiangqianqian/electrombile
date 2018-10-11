const commonJs = {
  rem2px(rem) {
    const width = window.screen.width;
    return (rem * 100) / (750 / width);
  },

  dateFormat(timestamp, fmt, humanized) {
    // 格式化日期
    if (timestamp instanceof Date) {
      timestamp = timestamp.getTime();
    } else if (typeof timestamp === 'string') {
      timestamp = new Date(timestamp);
    }

    if (timestamp != null) {
      const localTime = new Date(
        timestamp +
        (new Date(timestamp).getTimezoneOffset() - -480) * 60 * 1000
      );

      const today = new Date();
      if (humanized) {
        if (
          new Date(
            localTime.getFullYear() +
            '/' +
            (localTime.getMonth() + 1) +
            '/' +
            localTime.getDate()
          ).getTime() ==
          new Date(
            today.getFullYear() +
            '/' +
            (today.getMonth() + 1) +
            '/' +
            today.getDate()
          ).getTime()
        ) {
          fmt = fmt.replace(/(y+-)?M+-d+/, '今天');
        } else if (
          new Date(
            localTime.getFullYear() +
            '/' +
            (localTime.getMonth() + 1) +
            '/' +
            localTime.getDate()
          ).getTime() ==
          new Date(
            today.getFullYear() +
            '/' +
            (today.getMonth() + 1) +
            '/' +
            today.getDate() -
            1
          ).getTime()
        ) {
          fmt = fmt.replace(/(y+-)?M+-d+/, '昨天');
        }
      }

      const o = {
        'M+': localTime.getMonth() + 1,
        'd+': localTime.getDate(),
        'h+': localTime.getHours(),
        'm+': localTime.getMinutes(),
        's+': localTime.getSeconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (localTime.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
      }

      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          );
        }
      }

      return fmt;
    }
    return '';
  }
};

export default commonJs;
