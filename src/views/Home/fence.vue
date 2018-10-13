<template>
  <div>
    <navBar>
      <template slot="titleBox">
        <div class="title-box"
             @click="selectFlag = true">
          {{currentSelectItem.brandName}}
          <van-icon class="title-arrow"
                    name="xiasanjiao" />
        </div>
        <ul class="title-list"
            v-if="selectFlag">
          <li :class="{'title-list-item': true, 'cur': item.imei === currentSelectItem.imei}"
              v-for="(item,index) in vehicleList"
              :key="index"
              @click="selectItem(item)">{{item.brandName}}</li>
        </ul>
      </template>
    </navBar>

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
          <span class="title">{{cardTitle}}</span>

          <div class="address">
            {{address}}
          </div>
        </div>
        <van-switch class="switch-btn"
                    v-model="switchChecked"
                    @change="setFenceSwitch" />
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Icon, Toast, Switch } from 'vant';
import navBar from '@/components/nav';
import midware from '@/assets/midware';

export default {
  name: 'fence',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Switch.name]: Switch,
    navBar
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
      address: '', // 当前被选中的电动车所在的位置
      cardTitle: '电子围栏(200米)',
      switchChecked: false, // 设置电子围栏的开关, 默认为 false, 设为 true 后需要提交接口保存
      polylineLastPoint: {}, // 圆右边界的坐标
      vehicleList: this.Global.vehicleList,
      selectFlag: false, // 为 true 显示电动车下拉框
      currentSelectItem: this.Global.vehicleList[0], // 电动车被选中的某个值
      circleOverlay: null, // 地图上的圆覆盖物
      polylineOverlay: null,
      labelOverlay: null
    };
  },
  created() {
    // 默认选中第 1 个
    // this.currentSelectItem = this.vehicleList[0];
  },
  activated() {
    midware.$emit('tabChange', 2);
  },
  methods: {
    mapReady({ BMap, map }) {
      // 请求接口确定是否已设置围栏
      this.init();
    },

    init() {
      this.switchChecked = false;
      this.$http
        .get(
          '/equipment/findFenceDate.htm',
          { imeis: this.currentSelectItem.imei },
          this,
          true
        )
        .then(res => {
          if (res && res.isSetting && !res.isSwitch) {
            // 以前设置过围栏的情况
            this.circlePath.center.lng = res.lon;
            this.circlePath.center.lat = res.lat;
            this.address = res.location;
            this.switchChecked = res.isSwitch;
          } else {
            this.circlePath.center.lng = this.currentSelectItem.lng;
            this.circlePath.center.lat = this.currentSelectItem.lat;

            // 通过逆址解析获取到地址
            this.getAddress();
          }

          // 地图准备好后设置并绘制中心点
          this.setAndDrawCenter();
        });
    },

    setAndDrawCenter() {
      // 电动车切换时先清除地图上的覆盖物
      const map = this.$refs.baiduMap.map;
      map.removeOverlay(this.circleOverlay);
      map.removeOverlay(this.polylineOverlay);
      map.removeOverlay(this.labelOverlay);
      this.$refs.mapCenter.reload();

      this.circlePath.center.lng = this.currentSelectItem.lng;
      this.circlePath.center.lat = this.currentSelectItem.lat;

      this.drawCircle();
      this.drawPolyline();
      this.drawLabel();
    },

    getAddress() {
      const _this = this;

      // 创建地址解析器实例
      const myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上，并调整地图视野

      const point = new BMap.Point(
        this.circlePath.center.lng,
        this.circlePath.center.lat
      );

      myGeo.getLocation(point, rs => {
        const address = rs.addressComponents;
        _this.address =
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

      el.style.left = `${pixel.x - 4}px`;
      el.style.top = `${pixel.y - 4}px`;
    },

    // drawCenter() {
    //   const circlePoint = new BMap.Circle(
    //     new BMap.Point(this.circlePath.center.lng, this.circlePath.center.lat),
    //     8,
    //     {
    //       strokeColor: 'transparent',
    //       strokeOpacity: 0,
    //       strokeWeight: 0,
    //       fillColor: '#47bafe',
    //     }
    //   );
    //   this.$refs.baiduMap.map.addOverlay(circlePoint);
    // },

    drawCircle() {
      this.circleOverlay = new BMap.Circle(
        new BMap.Point(this.circlePath.center.lng, this.circlePath.center.lat),
        this.circlePath.radius,
        {
          strokeColor: '#47bafe',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#47bafe',
          fillOpacity: 0.18
        }
      );
      this.$refs.baiduMap.map.addOverlay(this.circleOverlay);

      // 获取圆右边界的坐标
      this.polylineLastPoint = {
        lng: this.circleOverlay.getBounds().getNorthEast().lng,
        lat: this.circlePath.center.lat
      };
    },

    drawPolyline() {
      this.polylineOverlay = new BMap.Polyline(
        [
          new BMap.Point(
            this.circlePath.center.lng,
            this.circlePath.center.lat
          ),
          new BMap.Point(this.polylineLastPoint.lng, this.polylineLastPoint.lat)
        ],
        { strokeColor: '#47bafe', strokeWeight: 2, strokeStyle: 'dashed' }
      );
      this.$refs.baiduMap.map.addOverlay(this.polylineOverlay);
    },

    drawLabel() {
      const labelPoint = new BMap.Point(
        this.circlePath.center.lng +
          (this.polylineLastPoint.lng - this.circlePath.center.lng) / 2,
        this.circlePath.center.lat
      );
      const opts = {
        position: labelPoint,
        offset: new BMap.Size(-18, -20)
      };
      this.labelOverlay = new BMap.Label(`${this.circlePath.radius}米`, opts);
      this.labelOverlay.setStyle({
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
      this.$refs.baiduMap.map.addOverlay(this.labelOverlay);
    },

    setFenceSwitch() {
      // 保存围栏的设置
      const params = {
        lon: this.circlePath.center.lng,
        lat: this.circlePath.center.lat,
        location: this.address,
        imei: this.currentSelectItem.imei,
        isSwitch: this.switchChecked
      };

      this.$http
        .post('/equipment/insertFence.htm', params, this, true)
        .then(res => {
          if (res) {
            Toast.success('设置成功');
          }
        });
    },

    selectItem(item) {
      // 隐藏下拉框
      this.selectFlag = false;
      this.currentSelectItem = item;

      // 重新绘制围栏
      this.init();
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

.title-box {
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
</style>
