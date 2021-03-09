<script lang="ts">
import { defineComponent } from 'vue'
import Grid from './components/Grid'

export default defineComponent({
  name: 'App',
  components: {
    Grid
  }
})
</script>

<template>
  <div>
    <Grid :options="{ width: 600, height: 600 }"></Grid>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>