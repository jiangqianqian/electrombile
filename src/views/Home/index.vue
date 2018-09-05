<template>
  <div>
    <van-tabbar class="bottom-bar" v-model="active">
      <van-tabbar-item to="/home">
        <van-icon slot="icon" slot-scope="props" name="shouye" />
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/home/footPrint">
        <van-icon slot="icon" slot-scope="props" name="guiji" />
        <span>轨迹</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <van-icon slot="icon" slot-scope="props" name="dingwei" />
        <span>围栏</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <van-icon slot="icon" slot-scope="props" name="duanxin" />
        <span>消息</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <van-icon slot="icon" slot-scope="props" name="wode" />
        <span>我的</span>
      </van-tabbar-item>
    </van-tabbar>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { Icon, Tabbar, TabbarItem, Toast } from 'vant';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    [Icon.name]: Icon,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Toast.name]: Toast
  },
  data() {
    return {
      active: 0
    };
  },
  computed: {
    ...mapGetters(['loading', 'finished', 'list'])
    // ...mapState({
    //   loading: state => state.home,
    //   finished: state => state.home.finished,
    //   list: state => state.home.list,
    // }),
  },
  created() {
    this.active = this.$route.meta.active || 0;
  },
  methods: {
    // onLoad() {
    //   setTimeout(() => {
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }
    //     this.loading = false;

    //     if (this.list.length >= 40) {
    //       this.finished = true;
    //     }
    //   }, 500);
    // }
  }
};
</script>

<style scoped>
</style>
<style>
[class*='van-hairline']::after {
  border-color: #d0d0d0;
}

.van-tabbar-item--active {
  color: #47bafe;
}

.van-tabbar-item__icon {
  margin-bottom: 6px;
}

.content {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
