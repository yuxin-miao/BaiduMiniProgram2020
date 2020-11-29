<template>
  <el-row id="app" type="flex">
    <el-col :span="4">
      <NavBar class="nav-side"/>
    </el-col>
    <el-col :span="20" class="main-content">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="20">
          <router-view/>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import BaseProxy from '@/proxies/Proxy';

export default {
  name: 'Main',
  components: { NavBar },
  mounted() {
    // If the user is authenticated,
    // if (this.$store.state.auth.authenticated) {
    //   // fetch the data from the API
    //   this.$store.dispatch('account/find');
    // }
  },
};
</script>

<style scoped>
#app {
  height: 100vh;
}

.nav-side {
  height: 100vh;
}

.main-content {
  height: 100vh;
  padding-top: 5%;
  overflow: hidden;
}
</style>
