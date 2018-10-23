<template>
  <div class="register-page">
    <div>
      <van-field v-model.trim="phone"
                 type="tel"
                 left-icon="shouji"
                 placeholder="请输入手机号" />
      <van-field v-model.trim="sms"
                 type="tel"
                 left-icon="xiaoxi-moren"
                 placeholder="请输入验证码">
        <van-button class="sms-btn"
                    slot="button"
                    size="small"
                    :disabled="!show"
                    @click.native="getSms">
          <span v-show="show">获取验证码</span>
          <span v-show="!show"
                class="count">重新获取({{count}}s)</span>
        </van-button>
      </van-field>
    </div>
    <div class="text-tip">进入即默认您同意《酷行智动用户协议》</div>
    <div class="next-btn-wrap">
      <van-button size="large"
                  type="primary"
                  @click.native="register">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { Field, Button, Toast } from 'vant';

const TIME_COUNT = 60;

export default {
  name: 'register',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data() {
    return {
      phone: '',
      sms: '',
      show: true, // 为 true 显示获取验证码按键，否则显示 60s 倒计时内容
      count: '', // 60s 计数
      timer: null
    };
  },
  methods: {
    getSms() {
      if (this.checkPhone()) {
        // 发送获取验证码的接口
        this.$http
          .get('/equipment/verifyCode.htm', { phone: this.phone }, this)
          .then(res => {
            if (res) {
              Toast('验证码发送成功，请注意查收');
            } else {
              this.show = true;
              if (this.timer) {
                clearInterval(this.timer);
              }
              this.timer = null;
            }
          });

        this.setEndTime();
      }
    },

    checkSms() {
      if (!this.sms.length) {
        Toast({
          message: '请输入验证码',
          position: 'top'
        });
        return false;
      }
      return true;
    },

    checkPhone() {
      // 检查手机号，验证码是否输入或输入正确
      if (!this.phone.length) {
        Toast({
          message: '请输入手机号',
          position: 'top'
        });
        return false;
      }

      const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        Toast({
          message: '请输入正确的手机号',
          position: 'top'
        });
        return false;
      }

      return true;
    },

    register() {
      if (this.checkPhone() && this.checkSms()) {
        const params = {
          accessKeyId: this.Global.userInfo.accessKeyId,
          phone: this.phone,
          verifyCode: this.sms,
          openId: this.Global.userInfo.openId,
        };
        // 提交注册
        this.$http
          .post('/equipment/customRegister.htm', params, this)
          .then(res => {
            // 跳转到轮播页面
            if (res) {
              this.Global.getTotalUserInfoFlag = true;
              this.Global.userInfo = res;
              this.$router.push('/swiper');
            }
          });
      }
    },

    setEndTime() {
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 1 && this.count <= TIME_COUNT) {
            this.count -= 1;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
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
  margin-right: 0.12rem;
  font-size: 0.48rem;
  color: #47bafe;
}

.register-page .van-icon-xiaoxi-moren {
  position: relative;
  left: 2px;
  /* top: 0.14rem; */
  margin-right: 0.24rem;
  font-size: 0.36rem;
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
