<template>
  <bm-overlay pane="markerPane"
    ref="motoOverlay"
    :class="{'marker-moto': true, cur}"
    @draw="draw"
    @touchend.native.stop="active(index)">
    <div class="circle">
      <div class="drop"></div>
      <div class="circle-inner">
        <van-icon class="marker-icon-motuo"
          name="diandongche" />
      </div>
    </div>
  </bm-overlay>
</template>

<script>
import { Button, Icon } from 'vant';
export default {
  name: 'motoOverlay',
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon
  },
  props: ['item', 'cur', 'index'],
  data() {
    return {
    };
  },
  // watch: {
  //   position: {
  //     handler() {
  //       this.$refs.customOverlay.reload();
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    active(index) {
      this.$emit('change', index);
    },
    draw({ el, BMap, map, overlay }) {
      const pixel = map.pointToOverlayPixel(
        new BMap.Point(this.item.lng, this.item.lat)
      );
      el.style.left = pixel.x - 60 + 'px';
      el.style.top = pixel.y - 20 + 'px';
    }
  }
};
</script>

<style>
.marker-moto {
  position: absolute;
}

.circle {
  position: relative;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.6rem;
  height: 0.6rem;
  background-color: #47bafe;
  border-radius: 100%;
}

.drop {
  position: absolute;
  top: 0.35rem;
  transform: rotate(45deg);
  width: 0.3rem;
  height: 0.3rem;
  background-color: #47bafe;
  left: 50%;
  margin-left: -0.15rem;
}

.circle-inner {
  position: relative;
  z-index: 999;
  width: 0.45rem;
  height: 0.45rem;
  background-color: #fff;
  border-radius: 100%;
}

.marker-icon-motuo {
  position: relative;
  top: -1px;
  font-size: 0.44rem;
  color: #47bafe;
}

.marker-moto.cur .circle,
.marker-moto.cur .drop {
  background-color: #81c048;
}

.marker-moto.cur .marker-icon-motuo {
  color: #81c048;
}
</style>
