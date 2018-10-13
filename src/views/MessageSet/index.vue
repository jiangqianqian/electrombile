<template>
  <div>
    <navBar title="消息设置"
            leftText="返回"
            rightText="保存"
            @clickLeft="back()"
            @clickRight="save" />
    <ul class="msg-list">
      <li class="msg-item">
        <div class="title">振动警报</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="msgParam.shockAlarm" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">振动等级</div>
        <div class="set-bar"
             @click="clickLevelPicker">
          <span class="level-text">{{renewalLevel}}</span>
          <van-icon class="right-arrow"
                    name="arrow" />
        </div>
      </li>
      <li class="msg-item level-info">
        <div class="level-info-item">
          初级：两次间隔不超过5秒只推送一次警报信息
        </div>
        <div class="level-info-item">
          中级：两次间隔不超过1秒只推送一次警报信息
        </div>
        <div class="level-info-item">
          高级：只在存在震动就推送警报信息
        </div>
      </li>
      <li class="msg-item">
        <div class="title">断电警报</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="msgParam.outageAlarm" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">出围栏警报</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="msgParam.fenceAlarm" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">勿扰模式</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="msgParam.mute" />
        </div>
      </li>
    </ul>
    <div class="time-wrap">
      <van-field class="time-item"
                 :readonly="true"
                 :border="false"
                 v-model="msgParam.startTime"
                 @click.native="showTimePicker({ flag: 'start'})" />
      <span class="split-text">至</span>
      <van-field class="time-item"
                 :readonly="true"
                 :border="false"
                 v-model="msgParam.endTime"
                 @click.native="showTimePicker({ flag: 'end'})" />
    </div>
    <van-picker ref="levelPicker"
                :columns="columns"
                show-toolbar
                title="选择级别"
                v-if="showLevelPicker"
                @change="levelPickerChange"
                @cancel="levelPickerCancel"
                @confirm="levelPickerConfirm" />

    <van-datetime-picker type="time"
                         :title="timePickerTitle"
                         v-model="currentTime.time"
                         v-if="isShowTime"
                         @cancel="timePickerCancel"
                         @confirm="timePickerConfirm"
                         @change="changeTime" />
  </div>
</template>

<script>
import { Icon, Toast, Field, Switch, Picker, DatetimePicker } from 'vant';
import navBar from '@/components/nav';

const levels = ['初级', '中级', '高级'];

export default {
  name: 'home',
  components: {
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [Switch.name]: Switch,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [DatetimePicker.name]: DatetimePicker,
    navBar
  },
  data() {
    return {
      msgParam: {
        shockAlarm: true, // 振动
        outageAlarm: true, // 断电
        fenceAlarm: true, // 围栏
        mute: false, // 勿扰
        startTime: '00:00',
        endTime: '23:59'
      },
      renewalLevel: '初级',
      prevLevel: null,
      columns: [],
      showLevelPicker: false,
      prevStartTime: null,
      prevEndTime: null,
      currentTime: { time: null, flag: '' },
      timePickerTitle: '',
      isShowTime: false
    };
  },
  watch: {
    // 为了每次打开能保留上次选择的值
    renewalLevel(newLevel, oldLevel) {
      this.columns = [
        {
          values: levels,
          defaultIndex: levels.indexOf(newLevel)
        }
      ];
    }
  },
  created() {},
  activated() {
    // 请求接口获取上次消息设置的值
    const params = {
      openId: this.Global.userInfo.openId
    };

    this.$http.get('/messageSetting/get.htm', params, this).then(res => {
      if (res) {
        this.renewalLevel = res.renewalLevel;
        delete res.renewalLevel;
        this.msgParam = res;

        this.columns = [
          {
            values: levels,
            defaultIndex: levels.indexOf(this.renewalLevel)
          }
        ];
      }
    });
  },
  methods: {
    async save() {
      // 保存消息设置
      const params = Object.assign({ renewalLevel: this.renewalLevel }, this.msgParam);
      const res = await this.$http.post(
        '/messageSetting/add.htm',
        params,
        this
      );

      if (res) {
        Toast.success('保存成功');
      }
    },

    // 等级改变
    levelPickerChange() {
      this.prevLevel = this.renewalLevel;
      this.renewalLevel = this.$refs.levelPicker.getValues()[0];
      this.$refs.levelPicker.setValues = this.renewalLevel;
    },

    levelPickerCancel() {
      this.renewalLevel = this.prevLevel;
      this.showLevelPicker = false;
    },

    levelPickerConfirm() {
      this.showLevelPicker = false;
    },

    // 点击等级弹出 picker
    clickLevelPicker() {
      this.showLevelPicker = true;
      this.isShowTime = false;
    },

    showTimePicker(state) {
      // 显示时间选择器
      this.showLevelPicker = false;
      this.isShowTime = true;
      if (state.flag === 'start') {
        this.currentTime = {
          time: this.msgParam.startTime,
          flag: 'start'
        };
        this.timePickerTitle = '开始时间';
      } else {
        this.currentTime = {
          time: this.msgParam.endTime,
          flag: 'end'
        };
        this.timePickerTitle = '结束时间';
      }
    },

    timePickerCancel() {
      // // 时间选择器点击取消
      this.isShowTime = false;
      if (this.currentTime.flag === 'start') {
        this.msgParam.startTime = this.prevStartTime;
      } else {
        this.msgParam.endTime = this.prevEndTime;
      }
    },

    timePickerConfirm() {
      // 时间选择器点击确定
      this.isShowTime = false;
    },

    changeTime() {
      // 时间选择器值发生了变化
      if (this.currentTime.flag === 'start') {
        this.prevStartTime = this.msgParam.startTime;
        this.msgParam.startTime = this.currentTime.time;
      } else {
        this.prevEndTime = this.msgParam.endTime;
        this.msgParam.endTime = this.currentTime.time;
      }
    }
  }
};
</script>

<style scoped>
.msg-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.18rem 0.2rem 0.18rem 0.3rem;
  line-height: 1;
  font-size: 0.26rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fff;
}

.title {
  font-size: 0.3rem;
  font-weight: bold;
}

.set-bar {
  display: flex;
  align-items: center;
  height: 0.64rem;
}

.level-text,
.right-arrow {
  font-size: 0.32rem;
  color: #858585;
}

.level-info {
  display: block;
  padding: 0.16rem 0.1rem 0.16rem 0.54rem;
  background-color: #f2f2f2;
}

.level-info-item {
  line-height: 0.46rem;
  font-size: 0.24rem;
  color: #858585;
}

.time-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.64rem;
}

.time-item {
  width: 30%;
  height: 0.76rem;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.split-text {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  font-size: 0.24rem;
  color: #858585;
}
</style>
