<template>
  <div class="swiper-page">
    <van-swipe class="guide-swipe" ref="swiper" :loop="false" :show-indicators="showIndicator" @touchend.native="setIndicator">
      <!-- <van-swipe-item v-for="(thumb, index) in thumbs" :key="thumb">
        <img :src="thumb" >
        <router-link v-if="index === thumbs.length - 1" to="/map">显示地图</router-link>
      </van-swipe-item> -->
      <van-swipe-item class="item item1">
        <!-- <img class="img" src="@/assets/images/swipe1.png"> -->
        <div class="text">酷行智动，伴您一路畅行</div>
      </van-swipe-item>
      <van-swipe-item class="item item1">
        <!-- <img class="img" src="@/assets/images/2.jpg"> -->
        <div class="text">这里是文字2</div>
      </van-swipe-item>
      <van-swipe-item class="item item3">
        <!-- <img class="img" src="@/assets/images/swipe3.png"> -->
        <div class="text">开始绑定我的电动车</div>
        <div class="bind-btn-wrap">
          <van-button class="bind-btn" type="primary" size="large" @click="scanCode">开始绑定</van-button>
          <router-link to='/inputCode'>
            <van-button class="bind-btn" type="primary" size="large">输入编码绑定</van-button>
          </router-link>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Button, Toast } from 'vant';
import { mapGetters } from 'vuex';
import wx from '@/../static/weixin-jssdk.js';

export default {
  name: 'swiper',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Button.name]: Button
  },
  computed: {
    ...mapGetters(['showIndicator'])
  },
  created() {
    this.getConfigItems().then(function(result) {
      if (result.code === 'C0000') {
        wx.config({
          // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: result.data.appId, // 必填，公众号的唯一标识
          timestamp: result.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
          signature: result.data.signature, // 必填，签名
          jsApiList: ['checkJsApi', 'scanQRCode'] // 必填，需要使用的JS接口列表
        });
      }
    });

    wx.error(function(res) {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      console.log(res, '签名失败');
    });
  },
  mounted() {
    // if (this.$route.params.swipeToEnd) {
    //   const $swiper = this.$refs.swiper;
    //   $swiper.swipeTo($swiper.$children.length - 1);
    // }
  },
  methods: {
    setIndicator() {
      this.$store.commit('setIndicator', this.$refs.swiper);
    },

    getConfigItems() {
      // 获取微信权限验证配置信息
      return this.$http.get(
        '/qfang-agent-api/sdk/getConfig',
        { url: location.href.split('#')[0] },
        this
      );
    },

    scanCode() {
      wx.checkJsApi({
        // 验证接口是否可用
        jsApiList: ['scanQRCode'],
        success: function(res) {
          if (res.checkResult.scanQRCode) {
            // 打开扫一扫
            wx.scanQRCode({
              needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
              scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
              success: function(res) {
                let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                console.log('扫描结果：' + result);
                // 提交绑定电动车
                this.bindVihicle(result);
              }
            });
          } else {
            Toast.fail('版本太低了~');
          }
        },
        fail: function(res) {
          console.loog(res.errMsg);
        }
      });
    },

    async bindVihicle(param) {
      let params = {
        id: param
      };

      // TODO: POST
      let res = await this.$http.get(
        '/getCoordinateQuantities',
        params,
        this
      );

      if (res) {
        // 跳到绑定成功界面
        this.$router.push();
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
  margin: 1.4rem auto 0;
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
</style>
<style>
.van-swipe__indicator {
  bottom: 0.46rem;
  background-color: #fff;
}
.van-swipe__indicator--active {
  width: 18px;
  border-radius: 9px;
}
</style>
