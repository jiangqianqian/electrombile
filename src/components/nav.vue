<template>
  <van-nav-bar @click-left="onClickLeft"
               @click-right="onClickRight">
    <template class="van-nav-bar__left"
              slot="left">
      <van-icon class="left-arrow"
                name="yuanzuojiantou"
                v-if="leftText || leftArrow" />
      <span class="van-nav-bar__text"
            v-if="leftText">{{leftText}}</span>
    </template>
    <div class="van-ellipsis van-nav-bar__title"
         slot="title"
         v-if="title">{{title}}</div>
    <slot name="titleBox"
          slot="title"
          v-else></slot>
    <span class="van-nav-bar__text"
          v-if="rightText"
          slot="right">{{rightText}}</span>
    <van-icon class="right-icon"
              :name="rightIcon"
              v-else-if="rightIcon"
              slot="right" />
  </van-nav-bar>
</template>

<script>
import { NavBar, Icon } from 'vant';

export default {
  name: 'navBar',
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon
  },
  props: {
    title: {
      type: String
    },
    leftText: {
      type: String
    },
    rightText: {
      type: String
    },
    rightIcon: {
      type: String
    },
    leftArrow: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$emit('clickLeft');
    },
    onClickRight() {
      this.$emit('clickRight');
    }
  }
};
</script>

<style scoped>
.left-arrow,
.right-icon {
  top: -3px;
  font-size: 0.44rem;
  color: #333;
}
</style>
<style>
.van-nav-bar__left {
  left: 0.1rem;
}

.van-nav-bar__text {
  padding: 0 10px;
  color: #333;
}

.van-nav-bar__title {
  font-size: 14px;
}
</style>

