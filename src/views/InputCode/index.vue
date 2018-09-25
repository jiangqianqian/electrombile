<template>
  <div class="bind-page">
    <navBar title="输入编码绑定"
            leftText="绑定电动车"
            @clickLeft="back()" />
    <div class="content">
      <img class="img" src="@/assets/images/vehicle.png" alt="">
      <van-field class="input-box"
                 v-model.trim="vehicleCode"
                 placeholder="请输入电动车编码" />
      <van-button size="large"
                  type="primary"
                  @click.native="bind">绑定</van-button>
    </div>
  </div>
</template>

<script>
import { Field, Button, Toast } from 'vant';
import navBar from '@/components/nav';

export default {
  name: 'bind',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
    navBar
  },
  data() {
    return {
      vehicleCode: '12s'
    };
  },
  computed: {},
  mounted() { },
  methods: {
    bind() {
      if (!this.vehicleCode.length) {
        Toast({
          message: '请输入电动车编码',
          position: 'top'
        });
        return false;
      }

      // 请求接口 TODO: post
      this.$http
        .get('/getCoordinateQuantities', { code: this.vehicleCode }, this)
        .then((res) => {
          console.log(res, 'res');
          if (res) {
            // 跳转到设备绑定成功页面
            this.$router.push('/success');
            return true;
          }
          return false;
        });

      return false;
    }
  }
};
</script>

<style scoped>
.content {
  padding: 0.44rem 0.3rem 0.36rem;
  background-color: #fff;
}

.img {
  width: 100%;
}

.input-box {
  margin-top: 0.36rem;
  margin-bottom: 0.56rem;
  padding-left: 0;
  padding-right: 0;
  font-size: 0.32rem;
}
</style>
<style>
.van-cell:not(:last-child)::after {
  left: 0;
}
</style>

