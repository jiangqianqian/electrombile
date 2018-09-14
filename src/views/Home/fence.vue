<template>
  <div class="bm-view-wrap">
    <baidu-map ref="baiduMap"
               class="bm-view"
               :center="circlePath.center"
               :zoom="17"
               @ready="mapReady">
      <!-- 覆盖物 -->
      <!--<MotoOverlay v-for="(item, index) in markerList"
                   :cur="index === activeIndex"
                   :key="index"
                   :item="item"
                   :index="index"
                   @change="change"></MotoOverlay>-->

      <!-- 中心点 -->
      <bm-overlay ref="mapCenter"
                  pane="markerPane"
                  class="map-center"
                  @draw="drawCenter">
        <div class="map-center-circle"></div>
      </bm-overlay>

      <bm-polyline :path="polylinePath"
                   stroke-color="#47bafe"
                   :stroke-opacity="1"
                   :stroke-weight="2"
                   stroke-style="dashed">
      </bm-polyline>

      <bm-circle ref="mapCircle"
                 :center="circlePath.center"
                 :radius="circlePath.radius"
                 stroke-color="#47bafe"
                 :stroke-weight="1"
                 fill-color="#47bafe"
                 :fill-opacity="0.18"
                 @lineupdate="updateCirclePath">
      </bm-circle>

    </baidu-map>

    <div class="card">
      <div class="info-main">
        <span class="title">{{userInfo.title}}</span>

        <div class="address">
          {{userInfo.address}}
        </div>
      </div>
      <van-switch class="switch-btn"
                  v-model="switchChecked" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Button, Icon, Toast, Switch } from 'vant';

export default {
  name: 'map12',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Switch.name]: Switch
  },
  data() {
    return {
      circlePath: {
        center: {
          // 中心点
          lng: 0,
          lat: 0
        },
        radius: 200
      },
      // TODO: 通过接口拿到姓名及头像，通过地图逆址解析拿到地址
      userInfo: {
        title: '电子围栏(200米)',
        address: ''
      },
      switchChecked: true,
      polylinePath: []
    };
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
      // this.drawDashLine();
    },
    drawDashLine() {
      this.polylinePath = [
        {
          lng: this.center.lng,
          lat: this.center.lat
        },
        {
          lng: this.circleBoundLng,
          lat: this.center.lat
        }
      ];
      // console.log(this.polylinePath, '123');
      // var labelPoint = new BMap.Point(newRightLng, point.latitude);
      // var opts = {
      //   position: labelPoint,
      //   offset: new BMap.Size(-50, -35)
      // };

      // var label = new BMap.Label(mileArrayInfo[i], opts);
      // label.setStyle({
      //   color: '#fff',
      //   fontSize: '12px',
      //   height: '20px',
      //   lineHeight: '20px',
      //   fontFamily: 'Arial',
      //   border: 0,
      //   borderRadius: '10px',
      //   backgroundColor: '#666',
      //   padding: '0 5px'
      // });
    },

    setCenter() {
      // 当前用户所在位置
      let _this = this;
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // 画当前位置
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log('success', r.point.lng);
            Toast.clear();
            _this.circlePath.center.lng = r.point.lng,
              _this.circlePath.center.lat = r.point.lat,
              _this.polylinePath = [
        {
          lng: _this.circlePath.center.lng,
          lat: _this.circlePath.center.lat
        },
        {
          lng: 114.02791876501952,
          lat: _this.circlePath.center.lat
        }
      ];
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

      let point = new BMap.Point(
        this.circlePath.center.lng,
        this.circlePath.center.lat
      );

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
        new BMap.Point(this.circlePath.center.lng, this.circlePath.center.lat)
      );

      // TODO:
      el.style.left = pixel.x - 10 + 'px';
      el.style.top = pixel.y - 10 + 'px';
    },

    updateCirclePath(e) {
      let circleBoundLng = e.target.getBounds().getNorthEast().lng;
      // this.circlePath.center = e.target.getCenter();
      // this.circlePath.radius = e.target.getRadius();

      console.log(this.polylinePath);
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

.card {
  position: absolute;
  bottom: 0.35rem;
  width: 92%;
  left: 50%;
  margin-left: -45.5%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 0.58rem;
  padding: 0.16rem 0.2rem;
  border-radius: 0.1rem;
  box-shadow: 2px 2px 5px 1px rgba(51, 51, 51, 0.21);
  box-sizing: border-box;
  background-color: #fff;
}

.info-main {
  flex: 1;
}

.title {
  font-size: 0.3rem;
  font-weight: bold;
}

.address {
  margin-top: 0.12rem;
  margin-right: 0.1rem;
  font-size: 0.24rem;
}

.bm-view {
  width: 100%;
  height: 100%;
}

.map-center {
  position: absolute;
}

.map-center-circle {
  width: 0.15rem;
  height: 0.15rem;
  border-radius: 0.15rem;
  background-color: #47bafe;
}
</style>
