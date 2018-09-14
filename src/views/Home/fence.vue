<template>
  <div class="bm-view-wrap">
    <baidu-map ref="baiduMap"
               class="bm-view"
               :center="circlePath.center"
               :zoom="17"
               @ready="mapReady">

      <!-- 中心点 -->
      <bm-overlay ref="mapCenter"
                  pane="markerPane"
                  class="map-center"
                  @draw="drawCenter">
        <div class="map-center-circle"></div>
      </bm-overlay>
    </baidu-map>

    <div class="card">
      <div class="info-main">
        <span class="title">{{userInfo.title}}</span>

        <div class="address">
          {{userInfo.address}}
        </div>
      </div>
      <van-switch class="switch-btn"
                  v-model="switchChecked"
                  @change="setFenceSwitch" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Button, Icon, Toast, Switch } from 'vant';

export default {
  name: 'fence',
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
      circle: null,
      polylineLastPoint: {}
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
      // 地图准备好后设置并绘制中心点
      this.setAndDrawCenter();
    },

    setAndDrawCenter() {
      // 当前用户所在位置
      let _this = this;
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // 画当前位置
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            console.log('success', r.point.lng);
            Toast.clear();
            _this.circlePath.center.lng = r.point.lng;
            _this.circlePath.center.lat = r.point.lat;

            _this.getAddress();
            _this.drawCircle();
            _this.drawPolyline();
            _this.drawLabel();

          } else {
            Toast.clear();
            Toast.fail('获取定位失败!');
          }
        },
        {
          enableHighAccuracy: true
        }
      );
    },

    getAddress() {
      let _this = this;

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
      let pixel = map.pointToOverlayPixel(
        new BMap.Point(this.circlePath.center.lng, this.circlePath.center.lat)
      );

      el.style.left = pixel.x - 4 + 'px';
      el.style.top = pixel.y - 4 + 'px';
    },

    drawCircle() {
      let circle = new BMap.Circle(
        new BMap.Point(this.circlePath.center.lng, this.circlePath.center.lat),
        this.circlePath.radius,
        {
          strokeColor: '#47bafe',
          strokeWeight: 1,
          fillColor: '#47bafe',
          fillOpacity: 0.18
        }
      );
      this.$refs.baiduMap.map.addOverlay(circle);

      // 获取圆右边界的坐标
      this.polylineLastPoint = {
        lng: circle.getBounds().getNorthEast().lng,
        lat: this.circlePath.center.lat
      };
    },

    drawPolyline() {
      let polyline = new BMap.Polyline(
        [
          new BMap.Point(
            this.circlePath.center.lng,
            this.circlePath.center.lat
          ),
          new BMap.Point(this.polylineLastPoint.lng, this.polylineLastPoint.lat)
        ],
        { strokeColor: '#47bafe', strokeWeight: 2, strokeStyle: 'dashed' }
      );
      this.$refs.baiduMap.map.addOverlay(polyline);
    },

    drawLabel() {
      let labelPoint = new BMap.Point(
        this.circlePath.center.lng +
          (this.polylineLastPoint.lng - this.circlePath.center.lng) / 2,
        this.circlePath.center.lat
      );
      let opts = {
        position: labelPoint,
        offset: new BMap.Size(-18, -20)
      };
      let label = new BMap.Label(`${this.circlePath.radius}米`, opts);
      label.setStyle({
        // color: '#fff',
        fontSize: '12px',
        height: '20px',
        fontWeight: 'normal',
        // lineHeight: '20px',
        // fontFamily: 'Arial',
        backgroundColor: 'transparent',
        border: 0
        // padding: '0 5px'
      });
      this.$refs.baiduMap.map.addOverlay(label);
    },

    setFenceSwitch() {
      console.log(this.switchChecked,'switchChecked');
    },
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
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: #47bafe;
}
</style>
