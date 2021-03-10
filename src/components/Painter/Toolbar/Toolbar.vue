<script lang="ts">
import { defineComponent } from 'vue'
import { useMachine } from '@xstate/vue';
import { Machine } from 'xstate';

export default defineComponent({
  name: 'PainterToolbar',
})
</script>


<template>
  <canvas ref="grid">
    <template v-slot:context-menu="">
    <slot name="context-menu" :context="activeCell">
    </slot>
    </template>
  </canvas>
</template>

<style>

</style>
