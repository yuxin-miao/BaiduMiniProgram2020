<template>
  <el-row id="app">
    <el-col :span="4">
      <NavBar class="nav-side" />
    </el-col>
    <el-col :span="20">
      <router-view />
    </el-col>
  </el-row>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'Main',
  components: { NavBar },
  mounted() {
    // If the user is authenticated,
    if (this.$store.state.auth.authenticated) {
      // fetch the data from the API
      this.$store.dispatch('account/find');
    }
    this.$http('http://localhost:8000/').then(res => {
      console.log(res);
    })
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
</style>
