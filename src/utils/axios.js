import axios from 'axios';
import {
  Toast
} from 'vant';

// vue 实例
let vue = null;

// 是否允许显示toast
let showToast = true;

let loading = false;

// 基础接口 TODO:
// const BASE_URL = 'http://open.leta.cn/api/lbs-agent-service';
const BASE_URL = '/leta_service';

axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

// 请求开始时，开启加载中动画，出错了提示并关闭动画
axios.interceptors.request.use((config) => {
  if (vue && loading) {
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
  }
  return config;
}, (error) => {
  if (vue && showToast) {
    Toast.fail('请求超时');
  }
  return Promise.reject(error);
});

// 请求完成时，关闭加载中动画，返回数据或错误信息
axios.interceptors.response.use((response) => {
  Toast.clear();

  // 一切正常，返回数据或空对象
  if (response.data.code === 0) {
    return response.data.data || {};
    // TODO:
  } else if (response.data.code === 401 || response.data.code === 403 || response.data.code === 404) {
    // 返回了其他状态码
    if (vue) {
      vue.$router.replace('/register');
    }
  } else if (response.data.message != null && response.data.message.length > 0) {
    // 没有数据，只有提示信息，则弹出提示信息
    if (vue && showToast) {
      Toast.fail(response.data.message);
    }
  }
  return false;
}, (error) => {
  Toast.clear();
  if (error.response) {
    if (error.response.data.code === 401 || error.response.data.code === 403 || error.response.data.code === 404) {
      // 未登录
      if (vue) {
        vue.$router.replace('/register');
      }
    }
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内，有错误信息则弹出错误信息
    console.log('response-error-data', error.response.data);
    if (error.response.data.message != null && error.response.data.message.length > 0) {
      if (vue && showToast) {
        Toast.fail(error.response.data.message);
      }
    }
  } else {
    // 什么数据都没有，直接出错了
    console.log('Error', error.message);
    if (vue && showToast) {
      Toast.fail('网络出错了，未请求到数据');
    }
  }
});

export default class api {
  static get = (url, params, vueContext, showLoading, isShow) => {
    /*
      *@param {String} url 路径
      *@param {Obj} params 传参
      *@param {Obj} vueContext 一般传 this
      *@param {Boolean} showLoading 默认是 false,表示请求时不给加载中提示
      *@param {Boolean} isShow 默认为 true,表示请求异常给出提示
    */
    showToast = true;
    if (vueContext != null) {
      vue = vueContext;
    }

    if (isShow === false) {
      showToast = isShow;
    }

    // loading 默认为 false
    if (showLoading) {
      loading = showLoading;
    }

    return axios({
      method: 'get',
      url: `${BASE_URL}${url}`,
      params,
      withCredentials: true // 表示跨域请求时是否需要使用凭证
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      // },
    });
  }

  static post = (url, params, vueContext, showLoading, isShow) => {
    showToast = true;
    if (vueContext != null) {
      vue = vueContext;
    }

    if (isShow === false) {
      showToast = isShow;
    }

    if (showLoading) {
      loading = showLoading;
    }

    return axios({
      method: 'post',
      // url: `${BASE_URL}${url}`,
      url: `${BASE_URL}${url}`,
      data: params,
      withCredentials: true // 表示跨域请求时是否需要使用凭证
      // 发送请求前处理request的数据
      // transformRequest: [
      //   function (data) {
      //     let ret = ''
      //     for (let it in data) {
      //       ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      //     }
      //     return ret
      //   }
      // ],
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
    });
  }
}


// 使用
// this.$http.get('/index/trend', this).then((data) => {
//   if (data && data.indices) {
//     this.indices = data.indices;
//   }
// });
