<template>
  <div>
    <baidu-map class="bm-view " :center="{lng: 116.404, lat: 39.915}" :zoom="11" ak="VFEAKmKYgUpGON4YsDjdW8c3t7RwnQqK">
      <bm-driving start="天安门" end="百度大厦" @searchcomplete="handleSearchComplete" :panel="false" :autoViewport="true"></bm-driving>
      <bml-lushu
        @stop="reset"
        :path="path"
        :icon="icon"
        :play="play"
        :rotation="true">
      </bml-lushu>
    </baidu-map>
    <van-button type="default" @click="changeText">{{text}}</van-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Button } from 'vant';
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import { BmlLushu, BmDriving } from "vue-baidu-map";

export default {
  name: "map12",
  components: {
    BaiduMap,
    BmlLushu,
    BmDriving,

    [Button.name]: Button,
  },
  // data() {
  //   return {
  //     play: false,
  //     path: [],
  //     icon: {
  //       url: "http://api.map.baidu.com/library/LuShu/1.2/examples/car.png",
  //       size: { width: 52, height: 26 },
  //       opts: { anchor: { width: 27, height: 13 } }
  //     }
  //   };
  // },
  computed: {
    ...mapGetters(['play', 'path', 'icon', 'text'])
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
    }
  }
};
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 300px;
}
</style>
