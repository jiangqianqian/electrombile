<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
html {
  height: 100%;
}
body {
  font-size: 16px;
  background-color: #f2f2f2;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
