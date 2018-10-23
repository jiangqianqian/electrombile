<template>
  <div class="swiper-page">
    <swiper class="guide-swipe"
            :options="swiperOption"
            ref="mySwiper">
      <!-- slides -->
      <swiper-slide class="item item1">
        <img class="img"
             src="@/assets/images/swipe1.png">
        <div class="text">酷行智动，伴您一路畅行</div>
      </swiper-slide>
      <swiper-slide class="item item1">
        <img class="img"
             src="@/assets/images/swipe1.png">
        <div class="text">酷行智动，伴您一路畅行2</div>
      </swiper-slide>
      <swiper-slide class="item item3">
        <img class="img"
             src="@/assets/images/swipe3.png">
        <div class="text">开始绑定我的电动车</div>
        <div class="bind-btn-wrap">
          <van-button class="bind-btn"
                      type="primary"
                      size="large"
                      @click.native="scanCode">开始绑定</van-button>
          <router-link to='/inputCode'>
            <van-button class="bind-btn"
                        type="primary"
                        size="large">输入编码绑定</van-button>
          </router-link>
        </div>
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css';

import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { Swipe, SwipeItem, Button, Toast } from 'vant';

import wx from '@/../static/weixin-jssdk';

export default {
  name: 'carrousel',
  components: {
    swiper,
    swiperSlide,
    [Button.name]: Button
  },
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        pagination: {
          el: '.swiper-pagination'
        }
      }
    };
  },
  computed: {
    // swiper() {
    //   return this.$refs.mySwiper.swiper
    // }
  },
  created() {
    this.getConfigItems().then(res => {
      if (res) {
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.noncestr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名
          jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表
        });
      }
    });

    wx.error(res => {
      // Toast({message:JSON.stringify(res), duration: 0});
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log(res, '签名失败');
    });
  },

  mounted() {
    // 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
    // console.log('this is current swiper instance object', this.swiper);
    // this.swiper.slideTo(3, 1000, false)
  },

  methods: {
    getConfigItems() {
      // console.log(location.href.split('#')[0], '123');
      // 获取微信权限验证配置信息
      return this.$http.get(
        '/wechat/signature.htm',
        {
          accessKeyId: this.Global.userInfo.accessKeyId,
          url: location.href.split('#')[0]
        },
        this
      );
    },

    scanCode() {
      // checkJsApi接口是客户端6.0.2新引入的一个预留接口，第一期开放的接口均可不使用checkJsApi来检测, 看是否可去掉
      wx.checkJsApi({
        // 验证接口是否可用
        jsApiList: ['scanQRCode'],
        success: res => {
          if (res.checkResult.scanQRCode) {
            // 打开扫一扫
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              // scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
              success: data => {
                const result = data.resultStr.split(',')[1]; // 当needResult 为 1 时，扫码返回的结果
                // Toast({ message: result, duration: 0 });

                // 提交绑定电动车
                this.bindVehicle(result);
              }
            });
          } else {
            Toast.fail('版本太低了~');
          }
        },
        fail: res => {
          console.log(res.errMsg);
        }
      });
    },

    async bindVehicle(imei) {
      const params = {
        imei,
        openId: this.Global.userInfo.openId
      };

      const res = await this.$http.post(
        '/equipment/userBindImei.htm',
        params,
        this
      );

      if (res) {
        // 跳到绑定成功界面
        this.$router.push('/success');
      }
    }
  }

};
</script>
<style scoped>
/* .guide {
  padding-bottom: 50px;
}

.guide-swipe img {
  width: 7.5rem;
  height: 7.5rem;
  display: block;
} */

.swiper-page {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.guide-swipe {
  width: 100%;
  height: 100%;
}

.item {
  width: 100%;
  height: 100%;
}

.text {
  margin-top: 0.84rem;
  font-size: 0.38rem;
  text-align: center;
}

.img {
  display: block;
  margin: 1.2rem auto 0;
}

.item1 {
  background-color: #80cbd1;
}

.item3 {
  background-color: #d5eefc;
}

.item1 .img {
  width: 82.7%;
}

.item1 .text {
  color: #fff;
}

.item3 .img {
  width: 87.2%;
}

.bind-btn-wrap {
  margin: 1rem 1rem 0;
}

.bind-btn {
  margin-top: 0.28rem;
}

.swiper-page >>> .swiper-pagination-bullet {
  bottom: 0.46rem;
  height: 6px;
  background-color: #fff;
}

.swiper-page >>> .swiper-pagination-bullet-active {
  width: 18px;
  border-radius: 9px;
}
</style>
