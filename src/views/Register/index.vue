<template>
  <div class="register-page">
    <div>
      <van-field v-model.trim="phone" type="tel" left-icon="shouji" placeholder="请输入手机号" />
      <van-field v-model.trim="sms" type="tel" left-icon="duanxin" placeholder="请输入验证码">
        <van-button class="sms-btn" slot="button" size="small" :disabled="!show" @click.stop="getSms(phone)">
          <span v-show="show">获取验证码</span>
          <span v-show="!show" class="count">{{count}} s</span>
        </van-button>
      </van-field>
    </div>
    <div class="text-tip">进入即默认您同意《酷行智动用户协议》</div>
    <div class="next-btn-wrap">
      <van-button size="large" type="primary" @click.native="register">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { Field, Button, Toast} from 'vant';
import { mapGetters } from 'vuex';

export default {
  name: 'register',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  data() {
    return {
      phone: '13714717742',
      sms: '123'
    };
  },
  computed: {
    ...mapGetters(['count', 'show'])
  },
  mounted() {},
  methods: {
    getSms(phone) {
      // if (this.checkPhone()) {
      //   // 获取验证码  把后面的代码放在这里
      // }

      // 发送获取验证码的接口
      this.$http
        .get('/getCoordinateQuantities', { phone: this.phone }, this)
        .then(res => {
          console.log(res, 'res');
          if (res) {
            Toast.success('发送成功');
          }
        });

      this.$store.dispatch('setEndTime');
    },

    checkSms: function() {
      if (!this.sms.length) {
        Toast({
          message: '请输入验证码',
          position: 'top'
        });
        return false;
      }
      return true;
    },

    checkPhone: function() {
      // 检查手机号，验证码是否输入或输入正确
      if (!this.phone.length) {
        Toast({
          message: '请输入手机号',
          position: 'top'
        });
        return false;
      }

      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        Toast({
          message: '请输入正确的手机号',
          position: 'top'
        });
        return false;
      }

      return true;
    },

    register: function() {
      if (this.checkPhone() && this.checkSms()) {
        // 提交注册
        this.$http
          .get('/getCoordinateQuantities', { phone: this.phone, sms: this.sms }, this)
          .then(res => {
            // 跳转到轮播页面
            if (res) {
              this.$router.push('/swiper');
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  margin-top: 0.22rem;
}

.sms-btn {
  font-size: 0.28rem;
}

.text-tip {
  margin: 0.34rem 0 0.5rem 0.44rem;
  font-size: 0.24rem;
  color: #858585;
}

.next-btn-wrap {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}

</style>
<style>
.register-page .van-cell__left-icon {
  margin-right: 0.18rem;
  font-size: 0.46rem;
  color: #47bafe;
}

.register-page .van-icon-duanxin {
  /* top: 0.14rem; */
  margin-right: 0.24rem;
  font-size: 0.4rem;
}

.register-page .van-cell {
  padding: 0.2rem 0.35rem;
  font-size: 0.3rem;
}

.register-page .van-cell::last-child::after {
  border: none;
}

.register-page .van-field__control {
  height: 0.6rem;
}

.van-toast--top {
  top: 3.2rem;
  font-size: 0.28rem;
}
</style>
