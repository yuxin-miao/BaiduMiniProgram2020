<template>
  <el-menu @select="navigateTo">
    <el-menu-item index="home.index">
      <i class="el-icon-s-home" />
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="question.index">
      <i class="el-icon-question" />
      <span slot="title">问题模板</span>
    </el-menu-item>
    <el-menu-item index="feedback.index">
      <i class="el-icon-info" />
      <span slot="title">用户反馈</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  /**
   * The name of the component.
   */
  name: 'NavBar',
  props: {},
  computed: {},
  methods: {
    navigateTo(key, keyPath) {
      this.$router.push({
        name: key,
      });
    }
  }
};
</script>
