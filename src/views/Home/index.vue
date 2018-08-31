<template>
  <div>
    <router-link to='/swiper'>进入第二页</router-link>
    <van-row>
      <van-col span="8">span: 8</van-col>
      <van-col span="8">span: 8</van-col>
      <van-col span="8">span: 8</van-col>
    </van-row>
    <van-icon name="success" class="success"/>
    <van-icon name="clippy" color="#f91" />
    <van-list
      v-model="loading.loading"
      :finished="finished"
      @load="onLoad"
      loading-text="在加载"
    >
      <van-cell v-for="item in list" :key="item" :title="item + ''" />
    </van-list>
  </div>
</template>

<script>
import { Row, Col, Icon, List, Cell, Toast } from 'vant';
import { mapGetters } from 'vuex';

export default {
  name: 'HelloWorld',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [List.name]: List,
    [Cell.name]: Cell,
  },
  // data() {
  //   return {
  //     list: [],
  //     loading: false,
  //     finished: false
  //   };
  // },
  computed: {
    ...mapGetters(['loading', 'finished', 'list']),
    // ...mapState({
    //   loading: state => state.home,
    //   finished: state => state.home.finished,
    //   list: state => state.home.list,
    // }),
  },
  mounted() {},
  methods: {
    async onLoad() {
      // Toast.loading({
      //   mask: true,
      //   message: '加载中...',
      //   duration: 0
      // });
      await this.$store.dispatch('getList');
      // Toast.clear();
    },
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
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.success {
  font-size: 20px;
}
</style>
