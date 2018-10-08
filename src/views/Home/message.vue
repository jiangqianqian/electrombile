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
             v-for="(item, index) in records"
             :key="index">
          <div class="header">
            <div class="title">{{item.alarmTypeName}}</div>
            <div class="time">{{item.receiveTime}}</div>
          </div>
          <div class="info">{{alarmText[item.alarmType]}}</div>
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
      finished: false, // 列表加载完成
      curPage: 1,
      limit: 10,
      isNoData: false,
      records: [],
      alarmText: {
        1: '紧急报警',
        2: '超速报警',
        3: '疲劳驾驶',
        4: '终端低电量',
        5: '已断电，可能发生电源脱离或没电',
        6: '震动了一下',
        7: '超时停车',
        8: '已超出你设定的安全范围',
        9: '油量异常',
        10: '非法点火',
        11: '距上次停车点发生了偏移',
        12: '碰撞预警',
        13: '侧翻预警',
        14: '非法开门',
      },
    };
  },
  methods: {
    goSetMsg() {
      this.$router.push('/messageSet');
    },
    async onLoad() {
      const params = {
        openId: Global.userInfo.openId,
        curPage: this.curPage,
        limit: this.limit
      };

      const res = await this.$http.get(
        '/findAlarmItemPage',
        params,
        this
      );

      if (!res) {
        return;
      }

      if (res.records.length) {
        this.records = [...res.records, ...this.records];
        this.loading = false;
        if (res.count > (this.curPage - 1) * this.limit + res.records.length) {
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
