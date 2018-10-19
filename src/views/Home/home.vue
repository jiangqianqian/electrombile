<template>
  <div class="bm-view-wrap">
    <baidu-map ref="baiduMap"
               class="bm-view"
               :center="center"
               :zoom="17"
               @ready="mapReady">

      <MotoOverlay v-for="(item, index) in markerList"
                   :cur="index === activeIndex"
                   :key="index"
                   :item="item"
                   :index="index"
                   @change="change"></MotoOverlay>

      <!-- 中心点 -->
      <bm-overlay ref="mapCenter"
                  pane="markerPane"
                  class="map-center"
                  @draw="drawCenter">
        <van-icon class="icon-map-center"
                  name="weizhifangxiang" />
      </bm-overlay>

    </baidu-map>

    <div class="message"
         v-if="showMessage">
      {{message}}
      <van-icon class="message-icon-close"
                name="guangbi"
                @click.native="showMessage = false;" />
    </div>
    <div class="map-control">
      <div class="icon-control-wrap"
           @click="backUser">
        <van-icon class="icon-control"
                  name="dingweizhongxin" />
      </div>

      <div class="control-vehicle-wrap">
        <div :class="{'control-vehicle': true, 'icon-control-wrap': true, cur: index === activeIndex}"
             v-for="(item, index) in markerList"
             :key="index"
             @click="change(index)">
          <van-icon class="icon-control"
                    name="diandongche" />
        </div>
      </div>
    </div>

    <!-- TODO: 获取用户信息 -->
    <div :class="{card:true, reverse: reverse === true}">
      <div class="info front">
        <div>
          <img class="figure"
               :src="userInfo.avatar" />
        </div>
        <div class="info-main">
          <div class="name-box">
            <span class="name">{{userInfo.nickname}}</span>
          </div>
          <div class="address">
            <van-icon class="address-icon"
                      name="zuobiao" /> {{userInfo.address}}
          </div>
        </div>
      </div>

      <div class="info back">
        <div>
          <img class="figure"
               :src="markerList[activeVehicleIndex].brandLogo" />
        </div>
        <div class="info-main">
          <div class="name-box">
            <span class="name">{{markerList[activeVehicleIndex].brandName}}</span>
            <span class="state online"
                  v-if="markerList[activeVehicleIndex].isOnline">在线</span>
            <span class="state"
                  v-if="!markerList[activeVehicleIndex].isOnline">离线</span>
            <span class="time"
                  v-if="!markerList[activeVehicleIndex].isOnline && markerList[activeVehicleIndex].receiveTime">{{markerList[activeVehicleIndex].receiveTime}}</span>
          </div>
          <div class="address">
            <van-icon class="address-icon"
                      name="zuobiao" /> {{markerList[activeVehicleIndex].address}}
          </div>
        </div>
        <a href="javascript:;"
           class="info-btn"
           v-if="markerList[activeVehicleIndex].isOnline"
           @click="wakeBaidu">
          <van-icon class="info-btn-icon"
                    name="zuobiao1" /> 寻车
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Icon, Toast } from 'vant';
import midware from '@/assets/midware';
import commonJs from '@/utils/common';
import MotoOverlay from './motoOverlay';

export default {
  name: 'home',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    MotoOverlay
  },
  data() {
    return {
      center: {
        // 中心点
        lng: 0,
        lat: 0
      },
      reverse: false,
      showMessage: false, // 这期先不做消息推送
      message: '电话来了', // 实时信息
      activeVehicleIndex: 0, // 用于展示切换卡面时保留的电动车索引
      activeIndex: null, // 电动车和当前用户位置切换的 index

      // 通过接口拿到姓名及头像，通过地图逆址解析拿到地址
      userInfo: {
        nickname: this.Global.userInfo.nickname,
        avatar: this.Global.userInfo.avatar,
        address: ''
      },
      // markerList: [
      //   // {
      //   //   lat: 22.546, // 22.542621707139265
      //   //   lng: 114.025,  // 114.01351470704279
      //   //   title: '名字1',
      //   //   state: 'YES',
      //   //   address: '广东省深圳市大冲商务中心',
      //   //   src: '@/assets/images/2.jpg'
      //   // },
      //   {
      //     lat: 22.542621707139265,
      //     lng: 114.01351470704279,
      //     title: '名字1',
      //     state: 'YES',
      //     address: '广东省深圳市大冲商务中心',
      //     src: '@/assets/images/2.jpg'
      //   },
      //   {
      //     lat: 22.545,  // 22.54162186570159
      //     lng: 114.025,  // 114.01351525885238
      //     title: '名字2',
      //     state: 'NO',
      //     time: '2018-09-20 14：20：20',
      //     address: '广东省深圳市大冲商务中心2',
      //     src: '@/assets/images/3.jpg'
      //   }
      // ]
      markerList: this.Global.vehicleList
    };
  },
  created() {
    // 获取中心点完成前显示加载中
    Toast.loading({
      mask: true,
      duration: 0,
      message: '加载中...'
    });
  },
  activated() {
    midware.$emit('tabChange', 0);
  },

  methods: {
    mapReady({ BMap, map }) {
      this.setCenter();
      this.getVehicleAddress();
    },

    change(index) {
      // 切换卡片为用户或电动车信息
      const prevIndex = this.activeIndex;
      this.activeIndex = index;
      if (index < this.markerList.length) {
        // 表示是点击的电动车
        const curItem = this.markerList[index];
        this.activeVehicleIndex = index;
        // this.Global.activeVehicleIndex = index;
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
      const _this = this;
      const geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        async function (r) {
          // 画当前位置
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            Toast.clear();
            _this.center = {
              lng: r.point.lng,
              lat: r.point.lat
            };
            // _this.getAddress();
            try {
              _this.userInfo.address = await commonJs.getAddress(r.point.lng, r.point.lat);
            } catch (e) {
              _this.userInfo.address = '暂无地址信息';
            }
          } else {
            _this.userInfo.address = '暂无地址信息';
            Toast.fail('获取定位失败!');
          }
        },
        {
          enableHighAccuracy: true
        }
      );
      Toast.clear();
    },

    getVehicleAddress() {
      // 生成地图后获取电动车地址信息
      this.Global.vehicleList.map(async (item) => {
        // commonJs.getAddress(item.lng, item.lat).then((address) => {
        //   item.address = address;
        // }, () => {
        //   item.address = '暂无地址信息';
        // });
        if (!item.address) {
          try {
            item.address = await commonJs.getAddress(item.lng, item.lat);
          } catch (e) {
            item.address = '暂无地址信息';
          }
        }
        return item;
      });
    },

    // getAddress() {
    //   const _this = this;

    //   // 创建地址解析器实例
    //   const myGeo = new BMap.Geocoder();
    //   // 将地址解析结果显示在地图上，并调整地图视野

    //   const point = new BMap.Point(this.center.lng, this.center.lat);

    //   myGeo.getLocation(point, rs => {
    //     const address = rs.addressComponents;
    //     _this.userInfo.address =
    //       address.province +
    //       address.city +
    //       address.district +
    //       address.street +
    //       address.streetNumber;
    //   });
    // },

    drawCenter({ el, BMap, map, overlay }) {
      console.log(this.center.lng, this.center.lat, '34324');
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(this.center.lng, this.center.lat)
      );

      // TODO:
      el.style.left = `${pixel.x - 13}px`;
      el.style.top = `${pixel.y - 10}px`;
    },

    backUser() {
      // 返回中心点
      this.setCenter();

      this.$refs.baiduMap.map.panTo(
        new BMap.Point(this.center.lng, this.center.lat)
      );

      // 卡片信息为用户信息, 自定义用户的索引为 this.markerList.length + 1
      this.change(this.markerList.length + 1);
    },

    adjustOS() {
      // 判断是否属于 ios
      const ua = window.navigator.userAgent.toLowerCase();
      return ua.indexOf('os') > 0;
    },

    wakeBaidu() {
      const timeout = 600;
      const activeVehicle = this.markerList[this.activeVehicleIndex];
      let scheme = ''; // 唤起百度地图的配置信息

      if (this.adjustOS) {
        // 手机系统 ios
        scheme = `baidumap://map/marker?location=${activeVehicle.lat},${activeVehicle.lng}&title=${activeVehicle.title}&content=${activeVehicle.address}&output=html&src=webapp.baidu.openAPIdemo`;
      } else {
        // 手机系统 android
        scheme = `bdapp://map/marker?location=${activeVehicle.lat},${activeVehicle.lng}&title=${activeVehicle.title}&content=${activeVehicle.address}&output=html&src=webapp.baidu.openAPIdemo`;
      }

      // 如果手机没装百度地图，打开网页版地图
      const startTime = Date.now();
      window.location.href = scheme;
      const t = setTimeout(() => {
        const endTime = Date.now();
        if (!startTime || endTime - startTime < timeout + 200) {
          window.location.href = `http://api.map.baidu.com/marker?location=${activeVehicle.lat},${activeVehicle.lng}&title=${activeVehicle.title}&content=${activeVehicle.address}&output=html`;
        }
      }, timeout);

      window.onblur = () => {
        clearTimeout(t);
      };
    }
  }
};
</script>

<style scoped>
.bm-view-wrap {
  position: absolute;
  top: 0;
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
  font-size: 0.54rem;
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

.card {
  position: absolute;
  bottom: 0.2rem;
  width: 92%;
  left: 50%;
  margin-left: -45.5%;
  perspective: 500;
}

.info {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.74rem;
  perspective: 1000;
  transition: all 1s;
  display: flex;
  justify-content: space-around;
  padding: 0.34rem 0.2rem 0.4rem 0.2rem;
  width: 100%;
  border-radius: 0.1rem;
  box-shadow: 2px 2px 5px 1px rgba(51, 51, 51, 0.21);
  box-sizing: border-box;
  background-color: #fff;
  backface-visibility: hidden;
}

.back {
  position: relative;
  transform: rotateX(-180deg);
}

.card.reverse .front {
  transform: rotateX(-180deg);
}

.card.reverse .back {
  transform: rotateX(-360deg);
  -webkit-transform: rotateX(-360deg);
}

.figure {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 4px;
}

.info-main {
  margin-left: 0.12rem;
  flex: 1;
}

.name-box {
  display: flex;
  align-items: center;
}

.name {
  font-size: 0.32rem;
  font-weight: bold;
}

.state {
  margin-left: 4px;
  padding: 0.06rem;
  line-height: 1;
  border-radius: 3px;
  background-color: #888;
  color: #fff;
  font-size: 0.18rem;
  transform: scale(0.95);
  vertical-align: middle;
}

.state.online {
  background-color: #81c048;
}

.time {
  margin-left: 2px;
  color: #a3a3a3;
  font-size: 0.18rem;
}

.address {
  display: flex;
  align-items: flex-start;
  margin-top: 0.12rem;
  color: #858585;
  font-size: 0.22rem;
}

.address-icon {
  position: relative;
  top: -3px;
  font-size: 0.35rem;
  color: #b5b6b7;
  vertical-align: top;
}

.info-btn {
  width: 1.46rem;
  height: 0.72rem;
  line-height: 0.72rem;
  text-align: center;
  font-size: 0.26rem;
  color: #333;
  border: 1px solid #d8d8d8;
  border-radius: 0.36rem;
  box-shadow: 0 0 5px 0px rgba(51, 51, 51, 0.1);
}

.info-btn-icon {
  margin-right: 0.12rem;
  font-size: 0.26rem;
  color: #b5b6b7;
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
  font-size: 26px;
  color: #47bafe;
}
</style>
