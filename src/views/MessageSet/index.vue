<template>
  <div>
    <navBar title="消息设置"
            leftText="返回"
            rightText="保存"
            @clickLeft="back()"
            @clickRightt="save" />
    <ul class="msg-list">
      <li class="msg-item">
        <div class="title">振动警报</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="vibration" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">振动等级</div>
        <div class="set-bar"
             @click="clickLevelPicker">
          <span class="level-text">{{level}}</span>
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
                      v-model="cut" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">出围栏警报</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="fence" />
        </div>
      </li>
      <li class="msg-item">
        <div class="title">勿扰模式</div>
        <div class="set-bar">
          <van-switch class="switch-btn"
                      size="28px"
                      v-model="noDisturb" />
        </div>
      </li>
    </ul>
    <div class="time-wrap">
      <van-field class="time-item"
                 v-model="startTime"
                 @click="clickStartTime" />
      <span class="split-text">至</span>
      <van-field class="time-item"
                 v-model="endTime"
                 @click="clickEndTime" />
    </div>
    <van-picker ref="levelPicker"
                :columns="columns"
                show-toolbar
                title="选择级别"
                @change="levelPickerChange"
                @cancel="levelPickerCancel"
                @confirm="levelPickerConfirm"
                :value-key='valueKey'
                v-if="showLevelPicker" />

    <van-datetime-picker v-model="startTime"
                         type="time"
                         @cancel="startTimeCancel"
                         @confirm="startTimeConfirm"
                         v-if="showStartTime" />

    <van-datetime-picker v-model="endTime"
                         type="time"
                         @cancel="endTimeCancel"
                         @confirm="endTimeConfirm"
                         v-if="showEndTime" />
  </div>
</template>

<script>
import { Icon, Toast, Field, Switch, Picker, DatetimePicker } from 'vant';
import navBar from '@/components/nav';
import { mapGetters } from 'vuex';

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
      vibration: false,
      prevLevel: null,
      level: '初级',
      cut: true,
      fence: false,
      noDisturb: true,
      startTime: '00:00',
      endTime: '23:59',
      columns: ['初级', '中级', '高级'],
      valueKey: ['a','b','c'],
      showLevelPicker: false,
      showStartTime: false,
      showEndTime: false
    };
  },
  computed: {
    ...mapGetters(['loading', 'finished', 'list'])
  },
  created() {},
  methods: {
    save() {
      //  this.$router.push('/goSetMsg');
    },
    levelPickerChange() {
      if (!this.prevLevel) {
        this.prevLevel = this.level;
      }
      this.level = this.$refs.levelPicker.getValues()[0];
       this.$refs.levelPicker.setValues = this.level;
    },
    levelPickerCancel() {
      this.level = this.prevLevel;
      this.showLevelPicker = false;
    },
    levelPickerConfirm() {
      this.showLevelPicker = false;
    },
    clickLevelPicker() {
      this.showLevelPicker = true;
      this.showStartTime = this.showEndTime = false;
    },
    clickStartTime() {
      this.showStartTime = true;
      this.showLevelPicker = this.showEndTime = false;
    },
    clickEndTime() {
      this.showEndTime = true;
      this.showStartTime = this.showLevelPicker = false;
    },
    startTimeCancel() {},
    startTimeConfirm() {},
    endTimeCancel() {},
    endTimeConfirm() {}
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
