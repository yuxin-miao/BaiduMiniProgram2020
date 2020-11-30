<template>
  <el-row>
    <h1>XiaoU 问题管理系统</h1>
    <h2>用户名: {{ this.$store.state.auth.username }}</h2>
    <el-button @click="onLogout">注销</el-button>
  </el-row>
</template>

<script>
/* ============
 * Home Index Page
 * ============
 *
 * The home index page.
 */
export default {
  /**
   * The name of the page.
   */
  name: 'HomeIndex',
  data() {
    return {
      value: true,
    };
  },
  methods: {
    onLogout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
