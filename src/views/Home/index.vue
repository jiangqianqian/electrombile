<template>
  <div>
    <van-tabbar class="bottom-bar"
                v-model="active">
      <van-tabbar-item to="/home">
        <van-icon slot="icon"
                  slot-scope="props"
                  :name="active === 0 ? 'shouye-xuanzhong' : 'shouye-moren'" />
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item to="/home/footPrint">
        <van-icon slot="icon"
                  slot-scope="props"
                  :name="active === 1 ? 'guiji-xuanzhong' : 'guiji-moren'" />
        <span>轨迹</span>
      </van-tabbar-item>
      <van-tabbar-item to="/home/fence">
        <van-icon slot="icon"
                  slot-scope="props"
                  :name="active === 2 ? 'weilan-xuanzhong' : 'weilan-moren'" />
        <span>围栏</span>
      </van-tabbar-item>
      <van-tabbar-item to="/home/message">
        <van-icon slot="icon"
                  slot-scope="props"
                  :name="active === 3 ? 'xiaoxi-xuanzhong' : 'xiaoxi-moren'" />
        <span>消息</span>
      </van-tabbar-item>
      <van-tabbar-item>
        <van-icon slot="icon"
                  slot-scope="props"
                  :name="active === 4 ? 'wode-xuanzhong' : 'wode-moren'" />
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

export default {
  name: 'tab',
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
  created() {
    this.active = this.$route.meta.active || 0;
  },
  methods: {}
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
  font-size: 22px;
  margin-bottom: 6px;
}

.van-icon-xiaoxi-moren,
.van-icon-xiaoxi-xuanzhong {
  position: relative;
  top: 3px;
  display: block;
  height: 22px;
  font-size: 18px;
}

.content {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
