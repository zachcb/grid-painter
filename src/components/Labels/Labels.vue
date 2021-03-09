<script lang="ts">
import { defineComponent } from 'vue'
import { useMachine } from '@xstate/vue';
import { Machine } from 'xstate';

export default defineComponent({
  name: 'Grid',
})
</script>


<template>
  <canvas ref="grid"></canvas>
</template>

<style>

</style>