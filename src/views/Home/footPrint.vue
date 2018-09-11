<template>
  <div>
    <navBar leftText="返回"
            @clickLeft="back()">
      <template slot="titleBox">
        <div class="titleBox">
          小牛
          <van-icon class="title-arrow"
                    name="xiasanjiao" />
        </div>
        <ul class="title-list">
          <li class="title-list-item cur">小牛</li>
          <li class="title-list-item">新日</li>
          <li class="title-list-item">小米</li>
        </ul>
      </template>
    </navBar>
    <div class="bm-view-wrap">
      <baidu-map ref="baiduMap"
                 class="bm-view"
                 :center="center"
                 :zoom="17"
                 @ready="mapReady">
        <!-- 覆盖物 -->

        <!-- <bm-overlay pane="markerPane" v-for="(item, index) in markerList" :key="index" :class="{'marker-moto': true, active: index === activeIndex}" @draw="draw" @touchend.native.stop="active(index)">
        <div class="circle">
          <div class="drop"></div>
          <div class="circle-inner">
            <van-icon class="marker-icon-motuo" name="motuo" />
          </div>
        </div>
      </bm-overlay> -->

        <!-- 中心点 -->
        <bm-overlay ref="mapCenter"
                    pane="markerPane"
                    class="map-center"
                    @draw="drawCenter">
          <van-icon class="icon-map-center"
                    name="zuobiao1" />
        </bm-overlay>

      </baidu-map>
      <div class="message"
           v-if="showMessage">
        {{message}}
        <van-icon class="message-icon-close"
                  name="guangbi"
                  @click="showMessage = false;" />
      </div>
      <div class="map-expand">
        <div class="icon-control-wrap">
          <van-icon class="icon-control"
                    name="fangda" />
        </div>
      </div>

      <div class="play-box">
        <van-icon class="play-box-icon"
                  name="bofang" /> 播放
      </div>

      <div class="info">
        <div class="time-box">
          <div class="time-item">
            <span class="time-item-tile">开始时间</span>
            <div class="time-item-value">2018-09-10 10:20
              <van-icon class="right-arrow"
                        name="arrow" />
            </div>
          </div>
          <div class="time-item">
            <span class="time-item-tile">结束时间</span>
            <div class="time-item-value">2018-09-11 10:20
              <van-icon class="right-arrow"
                        name="arrow" />
            </div>
          </div>
        </div>
        <div class="time-btn-box">
          <van-button size="large"
                      type="primary"
                      @click.native="register">搜索</van-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Button, Icon, Toast } from 'vant';
import MotoOverlay from './motoOverlay.vue';
import navBar from '@/components/nav';

export default {
  name: 'map12',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    MotoOverlay,
    navBar
  },
  data() {
    return {
      center: {
        // 中心点
        lng: 0,
        lat: 0
      },
      reverse: false,
      showMessage: true,
      message: '电话来了', // 实时信息
      activeVehicleIndex: 0, // 用于展示切换卡面时保留的电动车索引
      activeIndex: null, // 电动车和当前用户位置切换的 index
      // TODO: 通过接口拿到姓名及头像，通过地图逆址解析拿到地址
      userInfo: {
        title: '用户名',
        src: 'https://www.baidu.com/img/baidu_jgylogo3.gif',
        address: ''
      },
      markerList: [
        {
          lat: 22.546,
          lng: 114.025,
          title: '名字1',
          state: 'YES',
          address: '广东省深圳市大冲商务中心',
          src: '@/assets/images/2.jpg'
        },
        {
          lat: 22.545,
          lng: 114.025,
          title: '名字2',
          state: 'NO',
          time: '2018-09-20 14：20：20',
          address: '广东省深圳市大冲商务中心2',
          src: '@/assets/images/3.jpg'
        }
      ]
    };
  },
  watch: {
    // center: {
    //   handler() {
    //     this.$refs.mapCenter.reload();
    //   },
    //   deep: true
    // }
  },
  computed: {
    // ...mapGetters(['play', 'path', 'icon', 'text'])
  },
  created() {
    // 获取中心点完成前显示加载中
    Toast.loading({
      mask: true,
      duration: 0,
      message: '加载中...'
    });
  },

  methods: {
    mapReady({ BMap, map }) {
      this.setCenter();
    },

    change(index) {
      // 切换卡版为用户或电动车信息
      let prevIndex = this.activeIndex;
      this.activeIndex = index;
      if (index < this.markerList.length) {
        // 表示是点击的电动车
        const curItem = this.markerList[index];
        this.activeVehicleIndex = index;
        this.$refs.baiduMap.map.panTo(new BMap.Point(curItem.lng, curItem.lat));
        if (!prevIndex || prevIndex >= this.markerList.length) {
          this.reverse = true;
        }
      } else {
        // 表示点击的是中心点
        this.$refs.baiduMap.map.panTo(
          new BMap.Point(this.center.lng, this.center.lat)
        );
        if (prevIndex < this.markerList.length) {
          this.reverse = false;
        }
      }
    },

    setCenter() {
      // 当前用户所在位置
      let _this = this;
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // 画当前位置
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            Toast.clear();
            _this.center = {
              lng: r.point.lng,
              lat: r.point.lat
            };
            _this.getAddress();
          } else {
            Toast.fail('获取定位失败!');
          }
        },
        {
          enableHighAccuracy: true
        }
      );
      Toast.clear();
    },

    getAddress() {
      var _this = this;

      // 创建地址解析器实例
      let myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上，并调整地图视野

      let point = new BMap.Point(this.center.lng, this.center.lat);

      myGeo.getLocation(point, function(rs) {
        let address = rs.addressComponents;
        _this.userInfo.address =
          address.province +
          address.city +
          address.district +
          address.street +
          address.streetNumber;
      });
    },

    drawCenter({ el, BMap, map, overlay }) {
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(this.center.lng, this.center.lat)
      );

      // TODO:
      el.style.left = pixel.x - 10 + 'px';
      el.style.top = pixel.y - 10 + 'px';
    },

    backUser() {
      // 返回中心点
      this.setCenter();

      this.$refs.baiduMap.map.panTo(
        new BMap.Point(this.center.lng, this.center.lat)
      );

      // 卡片信息为用户信息
      this.change(this.markerList.length + 1);
    },

    adjustOS() {
      // 判断是否属于 ios
      var ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('os') > 0;
    },

    wakeBaidu() {
      let timeout = 600;
      var activeVehicle = this.markerList[this.activeIndex];
      let scheme = ''; // 唤起百度地图的配置信息

      if (this.adjustOS) {
        // 手机系统 ios
        scheme = `baidumap://map/marker?location=${activeVehicle.lat},${
          activeVehicle.lng
        }&title=${activeVehicle.title}&content=${
          activeVehicle.address
        }&output=html&src=webapp.baidu.openAPIdemo`;
      } else {
        // 手机系统 android
        scheme = `bdapp://map/marker?location=${activeVehicle.lat},${
          activeVehicle.lng
        }&title=${activeVehicle.title}&content=${
          activeVehicle.address
        }&output=html&src=webapp.baidu.openAPIdemo`;
      }

      // 如果手机没装百度地图，打开网页版地图
      let startTime = Date.now();
      window.location.href = scheme;
      let t = setTimeout(function() {
        let endTime = Date.now();
        if (!startTime || endTime - startTime < timeout + 200) {
          window.location.href = `http://api.map.baidu.com/marker?location=${
            activeVehicle.lat
          },${activeVehicle.lng}&title=${activeVehicle.title}&content=${
            activeVehicle.address
          }&output=html`;
        }
      }, timeout);

      window.onblur = function() {
        clearTimeout(t);
      };
    }
  }
};
</script>

<style scoped>
.bm-view-wrap {
  position: absolute;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: hidden;
}

.map-control {
  position: absolute;
  bottom: 2.14rem;
  left: 50%;
  margin-left: -45.5%;
  width: 92%;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
}

.icon-control-wrap {
  width: 0.74rem;
  height: 0.74rem;
  text-align: center;
  border-radius: 0.08rem;
  box-shadow: 1px 1px 5px 1px rgba(51, 51, 51, 0.15);
  background-color: #fff;
}

.icon-control {
  line-height: 0.6rem;
  font-size: 0.5rem;
  color: #000;
}

.control-vehicle-wrap {
  flex: 1;
  text-align: right;
  font-size: 0;
}

.control-vehicle {
  display: inline-block;
  margin-left: 2px;
}

.control-vehicle .icon-control {
  color: #47bafe;
}

.control-vehicle.cur .icon-control {
  color: #81c048;
}

.info {
  position: absolute;
  bottom: 0.2rem;
  width: 92%;
  left: 50%;
  margin-left: -45.5%;
  border-radius: 0.1rem;
  box-shadow: 2px 2px 5px 1px rgba(51, 51, 51, 0.21);
  box-sizing: border-box;
  background-color: #fff;
}

.time-box {
  display: flex;
  justify-content: space-around;
  height: 1rem;
}

.time-item {
  flex: 1;
  padding: 0.2rem 0.3rem;
  font-size: 0.24rem;
  border-right: 1px solid #e5e5e5;
}

.time-item:last-child {
  border-right: none;
}

.time-item-title {
  color: #858585;
}

.time-item .right-arrow {
  position: relative;
  top: 1px;
  color: #c7c7c7;
}

.time-btn-box {
  display: flex;
  align-items: center;
  height: 1.3rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  border-top: 1px solid #e5e5e5;
}

.play-box {
  position: absolute;
  bottom: 2.8rem;
  left: 50%;
  margin-left: -0.72rem;
  width: 1.44rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  font-size: 0.26rem;
  color: #fff;
  border-radius: 0.35rem;
  background-color:#47bafe;
  box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.1);
}

.play-box-icon {
  /* padding-right: 0.1rem; */
}







.message {
  position: absolute;
  left: 50%;
  margin-left: -45.5%;
  top: 0.3rem;
  width: 92%;
  height: 0.6rem;
  line-height: 0.6rem;
  padding-left: 0.28rem;
  padding-right: 0.14rem;
  box-sizing: border-box;
  border-radius: 0.3rem;
  background-color: rgba(51, 51, 51, 0.7);
  color: #fff;
  font-size: 0.24rem;
}

.message-icon-close {
  float: right;
  line-height: 0.5rem;
  font-size: 0.4rem;
  color: #d8d8d8;
}

.bm-view {
  width: 100%;
  height: 100%;
}

.map-center {
  position: absolute;
}

.icon-map-center {
  font-size: 0.5rem;
  color: #47bafe;
}

.titleBox {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.3rem;
}
.title-arrow {
  position: relative;
  top: -2px;
  left: 3px;
  color: #858585;
}
.title-list {
  position: absolute;
  top: 52px;
  left: 50%;
  margin-left: -28%;
  width: 56%;
  border-radius: 0.08rem;
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.21);
  background-color: #fff;
}
.title-list-item {
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  font-size: 0.3rem;
  border-bottom: 1px solid #e5e5e5;
}
.title-list-item:last-child {
  border-bottom: none;
}
.title-list-item.cur {
  font-weight: bold;
}
.map-expand {
  position: absolute;
  top: 0.48rem;
  right: 0.28rem;
}
</style>
