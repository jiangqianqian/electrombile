<template>
  <div class="mine-box">
    <iframe src="http://letaservice.leta.cn/#/myInfo"
            ref="iframe"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="auto"
            @load="loaded"></iframe>
  </div>
</template>
<script>
import { Toast } from 'vant';

export default {
  name: 'mine',
  components: {
    [Toast.name]: Toast,
  },
  created() {
    // Toast.loading({
    //   mask: true,
    //   message: '加载中...',
    //   duration: 0
    // });
  },
  methods: {
    loaded() {
      // 微信浏览器不执行 loaded()
      // Toast.clear();
    }
  }
};
</script>
<style scoped>
.mine-box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 50px;
  left: 0;
}
</style>
