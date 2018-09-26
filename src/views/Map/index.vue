<template>
  <div>
    <baidu-map class="bm-view "
               :center="{lng: 113.956453, lat: 22.54717}"
               :zoom="11"
               ak="VFEAKmKYgUpGON4YsDjdW8c3t7RwnQqK">
      <!-- <bm-driving start="大冲"
                  end="南头"
                  @searchcomplete="handleSearchComplete"
                  :panel="false"
                  :autoViewport="true"></bm-driving> -->
      <bml-lushu @stop="reset"
                 :path="path"
                 :icon="icon"
                 :play="play"
                 :rotation="true">
      </bml-lushu>
      <!-- 起点 -->
      <bm-overlay pane="markerPane"
                  class="map-lushu"
                  @draw="drawStartPoint">
        <van-icon class="icon-map-center"
                  name="zuobiao1" />
      </bm-overlay>
      <!-- 终点 -->
      <bm-overlay pane="markerPane"
                  class="map-lushu"
                  @draw="drawEndPoint">
        <van-icon class="icon-map-center"
                  name="zuobiao1" />
      </bm-overlay>
      <!-- 折线 -->
      <bm-polyline :path="path"
                   stroke-color="blue"
                   :stroke-opacity="0.5"
                   :stroke-weight="2"></bm-polyline>
      <!-- <bm-polyline :path="polylinePath" stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline> -->
    </baidu-map>
    <van-button type="default"
                @click.native="changeText">{{text}}</van-button>
  </div>
</template>

<script>
import { Button, Icon } from 'vant';
import BaiduMap from 'vue-baidu-map/components/map/Map';
import { BmlLushu, BmDriving } from 'vue-baidu-map';

export default {
  name: 'map12',
  components: {
    BaiduMap,
    BmlLushu,
    BmDriving,

    [Button.name]: Button,
    [Icon.name]: Icon
  },
  data() {
    return {
      // play: false,
      // path: [],
      // icon: {
      //   url: "http://api.map.baidu.com/library/LuShu/1.2/examples/car.png",
      //   size: { width: 52, height: 26 },
      //   opts: { anchor: { width: 27, height: 13 } }
      // }
      polylinePath: [
        { lng: 116.404, lat: 39.915 },
        { lng: 116.405, lat: 39.92 },
        { lng: 116.423493, lat: 39.907445 }
      ]
    };
  },
  methods: {
    reset() {
      this.$store.commit('reset');
    },
    handleSearchComplete(res) {
      this.$store.commit('handleSearchComplete', res);
    },
    changeText() {
      this.$store.commit('changeText');
    },
    drawStartPoint({ el, BMap, map, overlay }) {
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(this.path[0].lng, this.path[0].lat)
      );

      // TODO:
      el.style.left = `${pixel.x - 10}px`;
      el.style.top = `${pixel.y - 10}px`;
    },
    drawEndPoint({ el, BMap, map, overlay }) {
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(
          this.path[this.path.length - 1].lng,
          this.path[this.path.length - 1].lat
        )
      );

      // TODO:
      el.style.left = `${pixel.x - 10}px`;
      el.style.top = `${pixel.y - 10}px`;
    }
  }
};
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 300px;
}

.map-lushu {
  position: absolute;
}
</style>
