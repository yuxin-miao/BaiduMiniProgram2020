<template>
  <el-row type="flex" align="middle" justify="center">
    <el-col :span="12">
      <el-form ref="loginForm" :model="user" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="onLogin" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
/* ============
 * Login Index Page
 * ============
 *
 * Page where the user can login.
 */

export default {
  /**
   * The name of the page.
   */
  name: 'LoginIndex',

  /**
   * The components the page can use.
   */
  /**
   * The data that can be used by the page.
   *
   * @returns {Object} The view-model data.
   */
  data() {
    return {
      loading: false,
      user: {
        username: null,
        password: null
      },
    };
  },

  /**
   * The methods the page can use.
   */
  methods: {
    /**
     * Will log the user in.
     *
     * @param {Object} user The user to be logged in.
     */
    onLogin() {
      this.loading = true;
      this.$store.dispatch('auth/login', this.user)
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
