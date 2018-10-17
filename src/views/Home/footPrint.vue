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
    <div class="bm-view-wrap"
         @touchend="selectFlag = false">
      <baidu-map ref="baiduMap"
                 class="bm-view"
                 :center="center"
                 :zoom="zoom"
                 @ready="mapReady">

        <!-- 中心点 -->
        <!-- <bm-overlay ref="mapCenter"
                    pane="markerPane"
                    class="map-center"
                    @draw="drawCenter">
          <van-icon class="icon-map-center"
                    name="zuobiao1" />
        </bm-overlay> -->

        <bml-lushu ref="lushu"
                   @stop="resetPlay"
                   :path="path"
                   :icon="icon"
                   :play="play"
                   :speed="500"
                   :autoView=true
                   v-if="isHasRoute">
        </bml-lushu>

        <!-- 起点 -->
        <bm-overlay pane="markerPane"
                    class="map-lushu"
                    v-if="isHasRoute"
                    @draw="drawStartPoint">
          <div class="route-circle startPoint">
            <div class="drop"></div>
            <div class="route-circle-inner">起</div>
          </div>
        </bm-overlay>

        <!-- 终点 -->
        <bm-overlay pane="markerPane"
                    class="map-lushu"
                    v-if="isHasRoute"
                    @draw="drawEndPoint">
          <div class="route-circle endPoint">
            <div class="drop"></div>
            <div class="route-circle-inner">终</div>
          </div>
        </bm-overlay>
        <!-- 折线 -->
        <!-- <bm-polyline :path="path"
                     stroke-color="#47bafe"
                     :stroke-opacity="1"
                     :stroke-weight="6"
                     v-if="isHasRoute">
        </bm-polyline> -->
      </baidu-map>
      <div class="message"
           v-if="showMessage">
        {{message}}
        <van-icon class="message-icon-close"
                  name="guangbi"
                  @click.native="showMessage = false;" />
      </div>
      <div class="map-expand"
           @click="isShrink = !isShrink">
        <div class="icon-control-wrap">
          <van-icon class="icon-control"
                    :name="isShrink ? 'fangda' : 'suoxiao'" />
        </div>
      </div>

      <div :class="{'play-box': true, 'expand': !isShrink}"
           @click="changeText"
           v-show="isHasRoute">
        <van-icon class="play-box-icon"
                  :name="play ? 'tingzhi': 'bofang'" /> {{text}}
      </div>

      <div class="info"
           v-show="isShrink">
        <div class="time-box">
          <div class="time-item"
               @click="showDatePicker({ flag: 'start'})">
            <span class="time-item-tile">开始时间</span>
            <div class="time-item-value">{{startDate}}
              <van-icon class="right-arrow"
                        name="arrow" />
            </div>
          </div>
          <div class="time-item"
               @click="showDatePicker({ flag: 'end'})">
            <span class="time-item-tile">结束时间</span>
            <div class="time-item-value">{{endDate}}
              <van-icon class="right-arrow"
                        name="arrow" />
            </div>
          </div>
        </div>
        <div class="time-btn-box">
          <van-button size="large"
                      type="primary"
                      @click.native="search">搜索</van-button>
        </div>
      </div>
      <van-datetime-picker v-model="currentDate.date"
                           class="route-datetime-picker"
                           type="datetime"
                           :title="pickerTitle"
                           @cancel="datePickerCancel"
                           @confirm="datePickerConfirm"
                           v-show="isShowDate" />
    </div>
  </div>
</template>

<script>
import { Button, Icon, Toast, DatetimePicker } from 'vant';
import { BmlLushu } from 'vue-baidu-map';
import commonJs from '@/utils/common';
import wgs84tobd09 from '@/utils/coordtransform';
import navBar from '@/components/nav';
import midware from '@/assets/midware';
// import path from '@/../static/path';
import lushuIcon from '@/assets/images/lushu-icon.png';

export default {
  name: 'footPrint',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [DatetimePicker.name]: DatetimePicker,
    BmlLushu,
    navBar
  },
  data() {
    return {
      selectFlag: false, // 为 true 显示电动车下拉框
      isShrink: true, // 为 true 为地图未展开状态
      currentSelectItem: this.Global.vehicleList[0], // 电动车下拉框在首页选中的某个值，后改为默认第一个
      vehicleList: this.Global.vehicleList,
      center: {
        // 中心点
        lng: 0,
        lat: 0
      },
      zoom: 15,
      showMessage: false, // 为 true 显示暂无消息
      message: '这段时间您没有行车记录哦', // 实时消息
      isShowDate: false, // 显示日期选择器
      pickerTitle: '', // 日期选择器 title
      currentDate: { date: null, flag: '' }, // 当前打开的日期选择器属于开始时间还是结束时间
      startDate: '2018-09-10 10:20',
      endDate: '2018-09-11 10:20',
      isHasRoute: false, // 是否点击搜索并查到了路线
      play: false,
      path: null, // 路书轨迹
      text: '开始',
      icon: {
        // 路书移动物 icon
        url: lushuIcon,
        size: {
          width: 30,
          height: 38
        },
        opts: {
          anchor: {
            width: 15,
            height: 38
          }
        }
      }
    };
  },
  created() {
    // 设置选中的电动车
    // const curIndex = this.Global.activeVehicleIndex || 0;
    // this.currentSelectItem = this.vehicleList[curIndex];
    midware.$emit('tabChange', 1);
  },
  mounted() {
    // 设置结束时间为当前，开始时间为结束时间的前一天
    // this.endDate = commonJs.dateFormat(new Date(), 'yyyy-MM-dd hh:mm');
    // this.startDate = commonJs.dateFormat(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd hh:mm');
    this.startDate = '2018-10-12 00:00';
    this.endDate = '2018-10-12 03:00';
  },
  methods: {
    mapReady({ BMap, map }) {
      this.setCenter();
    },

    setCenter() {
      // 设置当前选中的电动车坐标为中心点
      this.center = {
        lng: this.currentSelectItem.lng,
        lat: this.currentSelectItem.lat
      };
    },

    resetPlay() {
      // 当路书停止时重置状态为开始
      this.play = false;
      this.text = '开始';
    },

    changeText() {
      // 切换开始停止
      this.play = !this.play;
      this.text = this.play ? '暂停' : '开始';
    },

    drawStartPoint({ el, BMap, map, overlay }) {
      // 绘制起点
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(this.path[0].lng, this.path[0].lat)
      );

      el.style.left = `${pixel.x - 13}px`;
      el.style.top = `${pixel.y - 26}px`;
    },

    drawEndPoint({ el, BMap, map, overlay }) {
      // 绘制终点
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(
          this.path[this.path.length - 1].lng,
          this.path[this.path.length - 1].lat
        )
      );

      el.style.left = `${pixel.x - 13}px`;
      el.style.top = `${pixel.y - 26}px`;
    },

    resetState() {
      // 切换了电动车后重置状态
      // 清除覆盖物
      this.polyline && this.$refs.baiduMap.map.removeOverlay(this.polyline);

      this.resetPlay();

      this.isHasRoute = false;

      this.zoom = 15;
    },

    selectItem(item) {
      this.resetState();

      // 隐藏下拉框
      this.selectFlag = false;
      this.currentSelectItem = item;
      this.setCenter();
    },

    showDatePicker(state) {
      // 显示日期选择器
      this.isShowDate = true;
      if (state.flag === 'start') {
        this.currentDate = {
          date: new Date(this.startDate),
          flag: 'start'
        };
        this.pickerTitle = '开始时间';
      } else {
        this.currentDate = {
          date: new Date(this.endDate),
          flag: 'end'
        };
        this.pickerTitle = '结束时间';
      }
    },

    datePickerCancel() {
      // 日期选择器点击取消
      this.isShowDate = false;
    },

    datePickerConfirm() {
      // 日期选择器点击确定
      this.isShowDate = false;
      if (this.currentDate.flag === 'start') {
        this.startDate = commonJs.dateFormat(
          this.currentDate.date,
          'yyyy-MM-dd hh:mm'
        );
      } else {
        this.endDate = commonJs.dateFormat(
          this.currentDate.date,
          'yyyy-MM-dd hh:mm'
        );
      }
    },

    // clearOverlays() {
    //   this.$refs.baiduMap.map.clearOverlays();
    // },

    search() {
      // 重置播放状态为起始
      this.resetPlay();

      this.isHasRoute = false;

      this.polyline && this.$refs.baiduMap.map.removeOverlay(this.polyline);

      // 点击搜索
      // 判断开始结束时间是否有效
      const startTime = parseInt(new Date(this.startDate).getTime(), 10);
      const endTime = parseInt(new Date(this.endDate).getTime(), 10);
      if (startTime > endTime) {
        Toast('开始时间须小于结束时间');
        return;
      }

      // 获取 path, 设置起终点，画线， 根据获取到的点设置最佳视野
      // Toast.loading({
      //   mask: true,
      //   message: '加载中...'
      // });

      // 获取轨迹
      const params = {
        imei: this.currentSelectItem.imei,
        begintTime: this.startDate,
        endTime: this.endDate
      };
      this.$http.get(
        '/equipment/carTrajectory.htm',
        params,
        this,
        true
      ).then((res) => {
        if (res && res.length) {
          this.path = res.map((item) => {
            const newItem = wgs84tobd09(item.lon, item.lat);
            item.lng = newItem[0];
            item.lat = newItem[1];
            return item;
          });

          this.drawPolyline();

          this.isHasRoute = true;
        } else {
          // 如果没有数据，实时消息打开并显示暂无数据
          this.showMessage = true;
        }
      });
    },

    drawPolyline() {
      const polylinePoints = this.path.map((item) => {
        return new BMap.Point(item.lng, item.lat);
      });

      this.polyline = new BMap.Polyline(polylinePoints, {
        strokeColor: '#47bafe',
        strokeOpacity: 1,
        strokeWeight: 6
      });
      this.$refs.baiduMap.map.addOverlay(this.polyline);

      // 获取最佳视野
      const viewPort = this.$refs.baiduMap.map.getViewport(polylinePoints);
      this.zoom = viewPort.zoom;
      this.$refs.baiduMap.map.centerAndZoom(viewPort.center, this.zoom);
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
  background-color: #47bafe;
  box-shadow: 0 2px 8px 2px rgba(0, 0, 0, 0.1);
}

.play-box.expand {
  bottom: 0.32rem;
}

.message {
  position: absolute;
  left: 50%;
  margin-left: -45.5%;
  top: 0.3rem;
  z-index: 999;
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

.map-expand {
  position: absolute;
  top: 0.48rem;
  right: 0.28rem;
}

.map-lushu {
  position: absolute;
}

.route-circle {
  position: relative;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 23px;
  border-radius: 100%;
  border: 1px solid #fff;
  box-sizing: border-box;
}

.drop {
  position: absolute;
  top: 8px;
  transform: rotate(45deg);
  width: 15px;
  height: 15px;
  left: 50%;
  margin-left: -8px;
  border: 1px solid #fff;
  border-width: 0 1px 1px 0;
  box-sizing: border-box;
}

.route-circle-inner {
  position: relative;
  z-index: 999;
  font-size: 0.22rem;
  color: #fff;
}

.route-circle.startPoint,
.route-circle.startPoint .drop,
.route-circle.startPoint .route-circle-inner {
  background-color: #81c048;
}

.route-circle.endPoint,
.route-circle.endPoint .drop,
.route-circle.endPoint .route-circle-inner {
  background-color: #e5805c;
}

.route-datetime-picker {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
