<template>
  <div class="success-page">
    <img class="img"
         src="@/assets/images/ok-green.png" />
    <p class="text">设备绑定成功</p>
    <div class="btn-wrap">
      <router-link to='/equipment/home'>
        <van-button size="large"
                    type="primary">开始使用</van-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';

export default {
  name: 'success',
  components: {
    [Button.name]: Button
  }
};
</script>

<style scoped>
.img {
  display: block;
  width: 1.4rem;
  height: 1.4rem;
  margin: 2.56rem auto 0.2rem;
}

.text {
  margin-bottom: 1.36rem;
  font-size: 0.34rem;
  text-align: center;
}

.btn-wrap {
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}
</style>

