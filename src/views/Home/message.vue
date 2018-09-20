<template>
  <div>
    <navBar title="消息"
            leftText="返回"
            rightText="设置"
            @clickLeft="back()"
            @clickRight="goSetMsg" />
    <div class="msg-list">
      <van-list v-model="loading"
                :finished="finished"
                @load="onLoad">
        <div class="msg-item"
             v-for="(item, index) in msgList"
             :key="index">
          <div class="header">
            <div class="title">{{item.title}}</div>
            <div class="time">{{item.time}}</div>
          </div>
          <div class="info">{{item.info}}</div>
        </div>
        <div class="no-data"
             v-if="isNoData">暂无数据</div>
        <div class="no-more-data"
             v-if="finished">没有更多数据了
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Icon, Tabbar, TabbarItem, Toast, List } from 'vant';
import navBar from '@/components/nav';

export default {
  name: 'message',
  components: {
    [Icon.name]: Icon,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Toast.name]: Toast,
    [List.name]: List,
    navBar
  },
  data() {
    return {
      loading: false, // 列表加载中
      finished: false,  // 列表加载完成
      curPage: 1,
      pageSize: 10,
      isNoData: false,
      msgList: []
    };
  },
  methods: {
    goSetMsg() {
      this.$router.push('/messageSet');
    },
    async onLoad() {
      const params = {
        curPage: this.curPage,
        pageSize: this.pageSize
      };

      const res = await this.$http.get(
        '/getMsgList',
        params,
        this
      );

      if (!res) {
        return;
      }

      if (res.msgList.length) {
        this.msgList = [...res.msgList, ...this.msgList];
        this.loading = false;
        if (res.count > (this.curPage - 1) * this.pageSize + res.msgList.length) {
          this.curPage += 1;
        } else {
          this.finished = true;
        }
      } else if (this.curPage === 1) {
        // 消息页面暂无数据
        this.isNoData = true;
      }
    }
  }
};
</script>

<style scoped>
.msg-list {
  position: fixed;
  top: 46px;
  bottom: 50px;
  width: 100%;
  overflow-y: auto;
}

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

.no-more-data {
  line-height: 50px;
  font-size: 13px;
  color: #999;
  text-align: center;
}
</style>
