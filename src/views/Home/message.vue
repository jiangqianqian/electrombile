<template>
  <div>
     <navBar title="消息" leftText="返回" rightText="设置"  @clickLeft="back()"  @clickRight="goSetMsg" />
     <ul class="msg-list">
       <li class="msg-item" v-for="(item, index) in msgList" :key="index">
         <div class="header">
           <div class="title">{{item.title}}</div>
           <div class="time">{{item.time}}</div>
         </div>
         <div class="info">{{item.info}}</div>
       </li>
     </ul>
  </div>
</template>

<script>
import { Icon, Tabbar, TabbarItem, Toast } from 'vant';
import navBar from '@/components/nav';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    [Icon.name]: Icon,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Toast.name]: Toast,
    navBar
  },
  data() {
    return {
      msgList: [{
        title: '震动警报',
        time: '06-11 12:24',
        info: '设备：001震动了一下'
        },
        {
        title: '震动警报2',
        time: '06-11 12:25',
        info: '设2备：001震动了一下'
        }]

    };
  },
  computed: {
    ...mapGetters(['loading', 'finished', 'list'])
  },
  created() {
  },
  methods: {
    goSetMsg() {
      console.log(1)
       this.$router.push('/messageSet');
    }
  }
};
</script>

<style scoped>
.msg-item {
  padding: 0.3rem;
  line-height: 1;
  font-size: 0.26rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fff;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.15rem;
}
.title {
  flex: 1;
  font-size: 0.3rem;
  font-weight: bold;
}
.time {
  color: #858585;
}
</style>
